import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ColorScheme } from "~/lib/types/cvTypes";
import { generateCvHtmlMarkup } from "~/lib/generateCvHtmlMarkup";
import { useEffect, useState } from "react";
import { cvData } from "~/lib/mock/cvData";
import { useFetcher } from "@remix-run/react";
import htmlPdf from "html-pdf-node";

const colorSchemes: ColorScheme[] = [
  { lineColor: "#075985", backgroundColor: "#E0F2FE", name: "sky" },
  { lineColor: "#3730A3", backgroundColor: "#EEF2FF", name: "indygo" },
  { lineColor: "#86198F", backgroundColor: "#FDF4FF", name: "fuchsia" },
];

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
    const htmlContent = generateCvHtmlMarkup(cvData, colorScheme);
    const pdfBuffer = await htmlPdf.generatePdf(
      { content: htmlContent },
      {
        format: "A4",
        printBackground: true,
        margin: { top: "18mm", left: "15mm", right: "14.25mm", bottom: "18mm" },
      }
    );
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
    <div>
      <h1 className="font-">CV PDF Generator</h1>
      <div>
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.name}
            onClick={() => setSelectedScheme(scheme.name)}
            style={{
              backgroundColor: scheme.backgroundColor,
              color: scheme.lineColor,
              margin: "5px",
              padding: "10px",
              border: `1px solid ${scheme.lineColor}`,
            }}
          >
            {scheme.name}
          </button>
        ))}
      </div>

      <div className="w-full flex justify-center">
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

      <button onClick={downloadPdf}>Download PDF</button>
    </div>
  );
}
