import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { commitSession, getSession, getUserId } from "~/session.server";
import logo from "/logo.svg";
import triangles from "/main triangles.svg";
import { readCVTextIntoSchema } from "~/models/openai.server";
import { resumeSchema } from "~/types/resume";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { parseOffice } from "officeparser";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Upload",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/");
  return json({});
}

export const action: ActionFunction = async ({ request }) => {

  const formData = await request.formData();
  const file = formData.get("file-upload") as File;

  if (!file) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const parseFile = () => {
      return new Promise<string>((resolve, reject) => {
        parseOffice(fileBuffer, (value: any, error: any) => {
          if (error) {
            console.error("error: ", error);
            reject(error); // Handle the error
          } else {
            resolve(value); // Resolve when done
          }
        });
      });
    };

    const resolvedString = await parseFile();

    const session = await getSession(request);
    session.set("cvData", resolvedString);

    // If everything is fine, return the parsed CV data
    return redirect("/parser", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error(error);
    return json({ error: "Error processing the file" }, { status: 500 });
  }
};

export default function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const submit = useSubmit();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-3xl">
        <div className="left-24">
          <img src={logo} alt="Logo" className="absolute top-16 left-24" />
          <Form
            method="post"
            encType="multipart/form-data"
            onChange={(e) => {
              setIsLoading(true);
              submit(e.currentTarget);
            }}
          >
            <div className="relative w-full h-[264px] left-24 bg-neutral-50 rounded-lg border border-neutral-400 flex justify-center items-center">
              <label
                htmlFor="file-upload"
                className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
              >
                <Button
                  disabled={isLoading}
                  className="relative w-[188px] h-10 px-4 py-2 bg-cyan-700 hover:bg-cyan-950 focus:bg-cyan-700 rounded-md justify-center items-center gap-2.5 inline-flex z-20"
                >
                  <span className="text-white text-base leading-normal">
                    Upload your resume
                  </span>
                  <div className="absolute top-14 text-gray-500 text-base leading-normal pointer-events-none">
                    or drag and drop file
                  </div>
                </Button>
              </label>
              <input
                id="file-upload"
                accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.oasis.opendocument.text"
                type="file"
                name="file-upload"
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </Form>
          <div className="relative top-2 left-24 flex flex-row justify-between">
            <span className="text-gray-700 text-xs leading-tight">
              Supported formats: PDF, DOCX, ODT, PPT, XLSX
            </span>
            <span className="text-gray-700 text-xs font-medium">
              Maximum size: 5 MB
            </span>
          </div>
        </div>
      </div>
      <div className="hidden lg:block flex-1">
        <img
          src={triangles}
          alt="Decorative Triangles"
          className="absolute inset-y-0 right-0 h-full object-cover"
        />
      </div>
    </div>
  );
}
