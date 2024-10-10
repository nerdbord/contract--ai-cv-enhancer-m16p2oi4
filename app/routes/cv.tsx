import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ColorScheme, CvObjI } from "~/lib/types/cvTypes";
import { generateCvHtmlMarkup } from "~/lib/generateCvHtmlMarkup";
import { useEffect, useState } from "react";
import { cvData } from "~/lib/mock/cvData";
import { useFetcher } from "@remix-run/react";
import htmlPdf from "html-pdf-node";
import clsx from "clsx";

const colorSchemes: ColorScheme[] = [
  { lineColor: "#075985", backgroundColor: "#E0F2FE", name: "sky" },
  { lineColor: "#3730A3", backgroundColor: "#EEF2FF", name: "indygo" },
  { lineColor: "#86198F", backgroundColor: "#FDF4FF", name: "fuchsia" },
  { lineColor: "#9D174D", backgroundColor: "#FFF1F2", name: "rose" },
  { lineColor: "#9A3412", backgroundColor: "#FFF7ED", name: "orange" },
  { lineColor: "#92400E", backgroundColor: "#FFFBEB", name: "amber" },
  { lineColor: "#166534", backgroundColor: "#F0FDF4", name: "green" },
];
const generateNewPdf = (cvData: CvObjI, colorScheme: ColorScheme) => {
  const htmlContent = generateCvHtmlMarkup(cvData, colorScheme);

  return new Promise<Buffer>((resolve, reject) => {
    htmlPdf.generatePdf(
      { content: htmlContent },
      {
        format: "A4",
        printBackground: true,
        margin: {
          top: "18mm",
          left: "15mm",
          right: "14.25mm",
          bottom: "18mm",
        },
      },
      (err: Error, buffer: Buffer) => {
        if (err) {
          console.error("error: ", err);
          reject(err);
        } else {
          resolve(buffer);
        }
      }
    );
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const colorSchemeName = formData.get("colorScheme") as string;

  const colorScheme = colorSchemes.find(
    (scheme) => scheme.name === colorSchemeName
  );

  if (!colorScheme) {
    console.log("Invalid color scheme");
    return json({ error: "Invalid color scheme" }, { status: 400 });
  }

  try {
    const pdfBuffer = await generateNewPdf(cvData, colorScheme);
    // console.log("PDF Buffer length:", pdfBuffer.length);
    const base64Pdf = pdfBuffer.toString("base64");

    return json({ pdf: base64Pdf });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return json({ error: "Failed to generate PDF" }, { status: 500 });
  }
};

export default function CvPdfGeneratorPage() {
  const { data, submit } = useFetcher();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<string>(
    colorSchemes[0].name
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generatePdf(selectedScheme);
  }, [selectedScheme]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    if (data != null && typeof data === "object" && "pdf" in data) {
      const base64Pdf = data.pdf as string;
      const blob = base64ToBlob(base64Pdf, "application/pdf");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setError(null);
    }
  }, [data]);

  const generatePdf = (colorSchemeName: string) => {
    const formData = new FormData();
    formData.append("colorScheme", colorSchemeName);
    formData.append("cvObj", JSON.stringify(cvData));
    submit(formData, { method: "post" });
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `cv-${selectedScheme.toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const base64ToBlob = (base64: string, type: string = "application/pdf") => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: type });
  };

  return (
    <>
      <div className="h-[152px] flex justify-between items-center px-[96px]">
        <h1 className="font-">CV PDF Generator</h1>
        <div>USER NAME</div>
      </div>
      <div className="flex ml-[96px]">
        <div className="w-[318px]">
          <div className="mb-[24px]">
            <h4 className="font-semibold text-xl mb-[8px]">Job title name</h4>
            <p className="font-light text-base">Company name</p>{" "}
          </div>
          <button className="text-cyan-900 border-cyan-900 border rounded-[6px] px-[5.5px] py-[8px]">
            Change URL
          </button>
        </div>
        <div className="flex flex-col pt-[88px] items-center mr-[24px]">
          <p className="text-center font-semibold mb-[40px]">Color</p>
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => setSelectedScheme(scheme.name)}
              className={clsx(
                "rounded-full w-[64px] aspect-square border-[8px]",
                `bg-[${scheme.backgroundColor}]`,
                selectedScheme === scheme.name && `border-[${scheme.lineColor}]`
              )}
              style={{
                backgroundColor: scheme.backgroundColor,
                borderColor: `${
                  selectedScheme === scheme.name ? scheme.lineColor : "white"
                }`,
              }}
            ></button>
          ))}
        </div>

        <div className="flex items-end flex-col mb-[16px]">
          {pdfUrl ? ( //TODO:
            <button
              className="mb-[24px] text-white bg-cyan-700 rounded-[6px] py-[8px] px-[12px]"
              onClick={downloadPdf}
            >
              Download
            </button>
          ) : (
            <button
              className="mb-[24px] text-white bg-cyan-700 rounded-[6px] py-[8px] px-[20px]"
              onClick={() => console.log("redirect to login")}
            >
              Log in to Download
            </button>
          )}
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
              width="800px"
              height="1104px"
              style={{ border: "none", backgroundColor: "white" }}
              title="cv"
              data-toolbar="false"
              data-navpanes="false"
            />
          )}
        </div>
      </div>
    </>
  );
}
