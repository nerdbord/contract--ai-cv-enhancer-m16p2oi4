import React, { useRef, useState } from "react";
import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { verifyLogin } from "~/models/user.server";
import {
  commitSession,
  createUserSession,
  getSession,
  getUserId,
} from "~/session.server";
import { validateEmail } from "~/utils";
import { Button } from "~/components/ui/button";

import logo from "../../public/logo.svg";
import triangles from "../../public/main triangles.svg";
import { Input } from "~/components/ui/input";
import { readCVIntoSchema } from "~/models/openai.server";
import { resumeSchema } from "~/types/resume";

import { createWorker } from "tesseract.js";

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
  console.log(file);

  if (!file) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  //this line uses tesseract to OCR the file
  const {
    data: { text },
  } = await (await createWorker("eng")).recognize(file);

  try {
    // Send file to AI model (generateObjectFromFile is a hypothetical SDK function)
    const cvData = await readCVIntoSchema(text);

    // Validate the response against the CVSchema (this ensures the data structure is correct)
    const parsedCV = resumeSchema.safeParse(cvData);

    if (!parsedCV.success) {
      return json(
        { error: "Failed to parse CV data", issues: parsedCV.error.errors },
        { status: 400 }
      );
    }

    const session = await getSession(request);
    session.set("cvData", parsedCV.data);

    console.log(parsedCV.data);

    // If everything is fine, return the parsed CV data
    // return json({ success: true, data: parsedCV.data });
    return redirect("/result", {
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
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const formRef = useRef<HTMLFormElement | null>(null); // Create a ref for the form
  const submit = useSubmit();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-3xl">
        <div className="left-24">
          <img src={logo} alt="Logo" className="absolute top-16 left-24" />
          <Form
            method="post"
            encType="multipart/form-data"
            onChange={(event) => {
              submit(event.currentTarget);
            }}
          >
            <div className="relative w-full h-[264px] left-24 bg-neutral-50 rounded-lg border border-neutral-400 flex justify-center items-center">
              <label
                htmlFor="file-upload"
                className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
              >
                <div className="relative w-[188px] h-10 px-4 py-2 bg-cyan-700 hover:bg-cyan-950 focus:bg-cyan-700 rounded-md justify-center items-center gap-2.5 inline-flex z-20">
                  <span className="text-white text-base leading-normal">
                    Upload your resume
                  </span>
                  <div className="absolute top-14 text-gray-500 text-base leading-normal pointer-events-none">
                    or drag and drop file
                  </div>
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                name="file-upload"
                required
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </Form>
          <div className="relative top-2 left-24 flex flex-row justify-between">
            <span className="text-gray-700 text-xs leading-tight">
              Supported formats: DOC, DOCX, PDF
            </span>
            {uploadedFile && (
              <span className="text-gray-700 text-xs font-medium">
                Selected file: {uploadedFile.name}
              </span>
            )}
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
