import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { CvObjI } from "~/lib/types/cvTypes";
import { useEffect, useState } from "react";
import { cvData } from "~/lib/mock/cvData";
import { useFetcher } from "@remix-run/react";
import htmlPdf from "html-pdf-node";

type ColorScheme = {
  lineColor: string;
  backgroundColor: string;
  name: string;
};

const colorSchemes: ColorScheme[] = [
  { lineColor: "#075985", backgroundColor: "#E0F2FE", name: "sky" },
  { lineColor: "#3730A3", backgroundColor: "#EEF2FF", name: "indygo" },
  { lineColor: "#86198F", backgroundColor: "#FDF4FF", name: "fuchsia" },
];

function generateHtmlFromCvObj(
  cvObj: CvObjI,
  colorScheme: ColorScheme
): string {
  return `   
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${cvObj.name} ${cvObj.surname}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
        <style> 
            body {
                font-family: Inter, sans-serif;
                line-height: 1.6;
                color: black;
                margin:0;
                width:100%;
            }
            h1, h2, h3, h4, h5, p, ul {
                margin:0;
                padding:0;
                font-family: Inter, sans-serif;
            }
            .sectionName {
                border-bottom: 1px solid ${colorScheme.lineColor};
                font-size: 16px;
                font-weight: 500;
                line-height: 24px;
                text-align: left;
            }
            .name {
                font-family: Inter, sans-serif;
                font-size: 24px;
                font-weight: 600;
                line-height: 32px;
                letter-spacing: -0.006em;
                text-align: center;
                margin-bottom: 32px;
                color: #1E293B;
            }
            .professionalTitle {
                font-size: 16px;
                font-weight: 400;
                line-height: 28px;
                text-align: center;
                border-style: solid;
                border-color: ${colorScheme.lineColor};
                border-left-width:0;
                border-right-width:0;
                border-top-width: 1px;
                border-bottom-width: 1px;
                color: #1E293B;
                padding: 8px 0;
                margin-bottom: 32px;
            }
            .content {
                display: flex;
                gap: 32px;
            }
            .column {
                width: auto ;  
                min-width: 176px;
                background-color: ${colorScheme.backgroundColor};
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding: 8px;
            }
            .main {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            .contact {                  
                font-size: 12px;
                font-weight: 500;
                line-height: 20px;
                text-align: justified;
                display: flex;
                flex-direction: column;
                gap: 8px;
           
            }
            .unorderedList {
                list-style-type: none;
            }
            .detail {
                font-size: 12px;
                font-weight: 500;
                line-height: 20px;
                text-align: left;
            }
            .gap12 {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .gap16 {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .gap4 {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .jobTitle {
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                text-align: left;
             }
            .dates {
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                text-align: left;   
            }
            .responsibilities {
                padding:8px;
            }
            .contactLi {
                display:flex;
                align-items: center;
                gap:8px;
            }
        </style>
    </head>
    <body>
        <h1 class="name">${cvObj.name} ${cvObj.surname}</h1>
        <p class="professionalTitle">${cvObj.professionalTitle}</p>
        
        <div class="content">
            <div class="column">
                <ul class="contact unorderedList">
                    <li class="contactLi"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.9999 16.9201V19.9201C22.0011 20.1986 21.944 20.4743 21.8324 20.7294C21.7209 20.9846 21.5572 21.2137 21.352 21.402C21.1468 21.5902 20.9045 21.7336 20.6407 21.8228C20.3769 21.912 20.0973 21.9452 19.8199 21.9201C16.7428 21.5857 13.7869 20.5342 11.1899 18.8501C8.77376 17.3148 6.72527 15.2663 5.18993 12.8501C3.49991 10.2413 2.44818 7.27109 2.11993 4.1801C2.09494 3.90356 2.12781 3.62486 2.21643 3.36172C2.30506 3.09859 2.4475 2.85679 2.6347 2.65172C2.82189 2.44665 3.04974 2.28281 3.30372 2.17062C3.55771 2.05843 3.83227 2.00036 4.10993 2.0001H7.10993C7.59524 1.99532 8.06572 2.16718 8.43369 2.48363C8.80166 2.80008 9.04201 3.23954 9.10993 3.7201C9.23656 4.68016 9.47138 5.62282 9.80993 6.5301C9.94448 6.88802 9.9736 7.27701 9.89384 7.65098C9.81408 8.02494 9.6288 8.36821 9.35993 8.6401L8.08993 9.9101C9.51349 12.4136 11.5864 14.4865 14.0899 15.9101L15.3599 14.6401C15.6318 14.3712 15.9751 14.1859 16.3491 14.1062C16.723 14.0264 17.112 14.0556 17.4699 14.1901C18.3772 14.5286 19.3199 14.7635 20.2799 14.8901C20.7657 14.9586 21.2093 15.2033 21.5265 15.5776C21.8436 15.9519 22.0121 16.4297 21.9999 16.9201Z" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <p>${cvObj.contact.phone}</p>
                  </li>
                  <li class="contactLi"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <p>${cvObj.contact.email}</p>
                  </li>
                  <li class="contactLi"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M6 9H2V21H6V9Z" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <p>${cvObj.contact.linkedin}</p>
                  </li>
                  <li class="contactLi"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M2 12H22" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="${
                            colorScheme.lineColor
                          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <p>${cvObj.contact.portfolio}</p>
                  </li>
                </ul>
                <h2 class="sectionName">SKILLS</h2>
                <ul class="unorderedList detail">
                  ${cvObj.skills.map((skill) => `<li>${skill}</li>`).join("")}
                </ul>
                <h2 class="sectionName">LANGUAGES</h2>
                <ul class="unorderedList detail">
                  ${cvObj.languages
                    .map((lang) => `<li>${lang.name} - ${lang.level}</li>`)
                    .join("")}
                </ul>
                <h2 class="sectionName">COURSES</h2>
                <ul class="unorderedList detail gap12">
                  ${cvObj.courses
                    .map(
                      (course) =>
                        `<li><p>${course.name}</p><p>${course.date}</p></li>`
                    )
                    .join("")}
                </ul>
                <h2 class="sectionName">AWARDS</h2>
                <ul class="unorderedList detail gap12">
                  ${cvObj.awards
                    .map(
                      (award) =>
                        `<li><p>${award.name}</p><p>${award.date}</p></li>`
                    )
                    .join("")}
                </ul>
            </div>
            <div class="main"> 
              <div class="section">
                  <h2 class="sectionName" style="margin-bottom:12px;">PROFILE</h2>
                  <p class="detail" style="text-align: justify;">${
                    cvObj.profile
                  }</p>
              </div>
              <div class="section gap16">
                  <h2 class="sectionName">WORK EXPERIENCE</h2>
                  ${cvObj.workExperience
                    .map(
                      (job) => `
                      <div class="gap4">
                          <h3 class="jobTitle">${job.jobTitle}</h3>
                          <h4 class="detail">${job.companyName}</h4>
                          <p class="dates">${job.dates}</p>
                          <ul class="detail responsibilities" style="margin-left:30px;">
                              ${job.responsibilities
                                .map((resp) => `<li>${resp}</li>`)
                                .join("")}
                          </ul>
                      </div>
                  `
                    )
                    .join("")}
              </div>
              <div class="section gap16">
                  <h2 class="sectionName" ">EDUCATION</h2>
                  ${cvObj.education
                    .map(
                      (edu) => `
                      <div class="gap4">
                          <h3 class="detail">${edu.degreeAndMajor}</h3>
                          <p class="detail">${edu.universityName}, ${edu.location}</p>
                          <p class="detail">${edu.dates}</p>
                      </div>
                  `
                    )
                    .join("")}
              </div>
          </div>
        </div>
    </body>
    </html>`;
}

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
    const htmlContent = generateHtmlFromCvObj(cvData, colorScheme);
    const pdfBuffer = await htmlPdf.generatePdf(
      { content: htmlContent },
      {
        format: "A4",
        printBackground: true,
        margin: { top: "18mm", left: "15mm", right: "14.25mm", bottom: "18mm" },
      }
    );
    console.log("PDF Buffer length:", pdfBuffer.length);

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
    console.log("Fetcher data type:", typeof data);
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