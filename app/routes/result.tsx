import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/session.server";
import { resumeType } from "~/types/resume";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const cvData = session.get("cvData") as resumeType;

  if (!cvData) {
    throw new Response("No CV data found", { status: 404 });
  }

  return { cvData };
};

export default function Result() {
  const { cvData } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>CV Parsing Result</h1>
      <pre>{JSON.stringify(cvData, null, 2)}</pre>
    </div>
  );
}
