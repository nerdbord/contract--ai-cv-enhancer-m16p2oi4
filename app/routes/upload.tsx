import React, { useState } from "react";
import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { validateEmail } from "~/utils";
import { Button } from "~/components/ui/button";

import logo from "../../public/logo.svg";
import triangles from "../../public/main triangles.svg";
import { Input } from "~/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Upload",
    },
  ];
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/");
  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid." } }, { status: 400 });
  }

  if (typeof password !== "string") {
    return json(
      { errors: { password: "Valid password is required." } },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return json(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/notes",
  });
};

export default function Upload() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/notes";
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();

  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef?.current?.focus();
    }

    if (actionData?.errors?.password) {
      passwordRef?.current?.focus();
    }
  }, [actionData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first uploaded file
    if (file) {
      setUploadedFile(file); // Update the state with the uploaded file
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-3xl">
        <div className="left-24">
          <img src={logo} alt="Logo" className="absolute top-16 left-24" />
          <div className="relative w-full h-[264px] left-24 bg-neutral-50 rounded-lg border border-neutral-400 flex justify-center items-center">
            <label
              htmlFor="file-upload"
              className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
            >
              <div className="relative w-[188px] h-10 px-4 py-2 bg-cyan-700 hover:bg-cyan-950 focus:bg-cyan-700 rounded-md justify-center items-center gap-2.5 inline-flex z-20">
                <span className="text-white text-base leading-normal">
                  Upload your resume
                </span>
                <div className="absolute top-14 text-gray-500 text-base leading-normal">
                  or drag and drop file
                </div>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          <div className="relative top-2 left-24 flex flex-row justify-between">
            <span className="text-gray-700 text-xs leading-tight">
              Supported formats: DOC, DOCX, PDF
            </span>
            {uploadedFile && <span className="text-gray-700 text-xs font-medium">
              Selected file: {uploadedFile.name}
            </span>}
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
