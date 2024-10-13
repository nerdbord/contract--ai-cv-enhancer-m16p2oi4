import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";
import CVComponent from "~/components/cvComponent";
import CV from "~/components/cvComponent";
import { mockCVData } from "~/lib/mock/jobOffer";
import { getSession } from "~/session.server";
import { cvType, resumeType } from "~/types/resume";
import logo from "/logo.svg";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async ({ request }) => {
  // const session = await getSession(request);
  // const fineTunedData = session.get("fine-tuned") as resumeType;

  // if (!fineTunedData) {
  //   throw new Response("No CV data found", { status: 404 });
  // }

  // return { fineTunedData };
  return json({});
};

export default function Result() {
  // const { fineTunedData } = useLoaderData<typeof loader>();
  // const typedData: resumeType = fineTunedData;
  const typedData: cvType = mockCVData;
  // return <CVComponent data={typedData} />;
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-[80vh] z-10">
        <img src={logo} alt="Logo" className="absolute top-16 left-24" />
        <div className="w-full flex justify-end mt-24">
          <Button
            type="button"
            variant="default"
            className="bg-cyan-700 hover:bg-cyan-800 focus:bg-cyan-900 mb-6"
          >
            Download your CV
          </Button>
        </div>
        <CVComponent data={typedData} />
      </div>
    </div>
  );
}
