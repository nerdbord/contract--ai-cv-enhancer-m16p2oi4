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
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { transformCVBasedOnOffer } from "~/models/openai.server";
import { resumeSchema } from "~/types/resume";
import { getWebsiteText } from "netlify/functions/dataScraper";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Parser",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/");
  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  const cvData = session.get("cvData");
  const formData = await request.formData();
  const url = formData.get("url-string");
  console.log("Action URL: ", url);

  const extractedText = await getWebsiteText(url as string);
  
  const finetunedCV = await transformCVBasedOnOffer(cvData, extractedText);
  const parsedFineTunedCV = resumeSchema.safeParse(finetunedCV.object).data;
  console.log("Parsed: ",parsedFineTunedCV);

  session.unset("cvData");
  await commitSession(session);
  session.set("fine-tuned", parsedFineTunedCV);

  return redirect("/result", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Parser() {
  const [isLoading, setIsLoading] = useState(false);
  const submit = useSubmit();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-[80vh] z-10">
        <img src={logo} alt="Logo" className="absolute top-16 left-24" />

        <div className="absolute w-[100vw] h-[100vh] top-0">
          <Form
            method="post"
            className="flex flex-col items-center justify-center align-middle h-full"
          >
            <div className="max-w-[80vh] flex flex-col">
              <label htmlFor="url-string">
                <h1 className="text-black text-3xl leading-9 pointer-events-none mb-6">
                  Paste the job offer URL in the field below
                </h1>
                <div className="text-gray-700 text-base leading-normal pointer-events-none mb-1.5">
                  AI will tailor your CV to the job you are applying for
                </div>
              </label>
              <div className="flex flex-col w-full items-end space-x-2">
                <Input
                  id="url-string"
                  type="string"
                  name="url-string"
                  placeholder="http/justjoin.it/offer"
                  className="mb-6"
                />
                <Button
                  type="submit"
                  className="bg-cyan-700 hover:bg-cyan-800 focus:bg-cyan-900"
                >
                  Generate my resume
                </Button>
              </div>
            </div>
          </Form>
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
