import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";
import CV from "~/components/cv";
import { getSession } from "~/session.server";
import { resumeType } from "~/types/resume";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const fineTunedData = session.get("fine-tuned") as resumeType;

  if (!fineTunedData) {
    throw new Response("No CV data found", { status: 404 });
  }

  return { fineTunedData };
};

export default function Result() {
  const { fineTunedData } = useLoaderData<typeof loader>();
  const typedData: resumeType = fineTunedData;
  return <CV data={typedData} />;
}
