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
import puppeteer from "puppeteer";
import { transformCVBasedOnOffer } from "~/models/openai.server";

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
  const formData = await request.formData();
  const url = formData.get("url-string");
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url as string);
  const extractedText = await page.$eval("*", (el) => {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNode(el);
      selection.removeAllRanges();
      selection.addRange(range);
      return selection.toString();
    }
    return "";
  });
  //console.log(extractedText);
  const session = await getSession(request)
  const cvData = session.get("cvData")

  await browser.close();

  const finetunedCV = await transformCVBasedOnOffer(cvData, extractedText)
  console.log(finetunedCV);
  
  session.unset('cvData')
  session.set("fine-tuned", finetunedCV)

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
