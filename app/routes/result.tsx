import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";
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

  return (
    // <div>
    //   <h1>CV Parsing Result</h1>
    //   <pre>{JSON.stringify(cvData, null, 2)}</pre>
    // </div>
    <div className="max-w-4xl mx-auto p-8">
      {/* Personal Information */}
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold">
          {fineTunedData.personalInformation.firstName}{" "}
          {fineTunedData.personalInformation.lastName}
        </h1>
        <p className="text-xl">{fineTunedData.personalInformation.email}</p>
        <p className="text-lg">{fineTunedData.personalInformation.phone}</p>
        <div className="flex justify-center space-x-4 mt-2">
          {fineTunedData.personalInformation.links.linkedin && (
            <a
              href={fineTunedData.personalInformation.links.linkedin}
              className="text-cyan-500 hover:text-cyan-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
          {fineTunedData.personalInformation.links.github && (
            <a
              href={fineTunedData.personalInformation.links.github}
              className="text-cyan-500 hover:text-cyan-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {fineTunedData.personalInformation.links.portfolio && (
            <a
              href={fineTunedData.personalInformation.links.portfolio}
              className="text-cyan-500 hover:text-cyan-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          )}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-cyan-600">Skills</h2>
        <ul className="list-disc pl-5">
          {fineTunedData.skills.technicalSkills.map(
            (
              skill:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined,
              index: Key | null | undefined
            ) => (
              <li key={index}>{skill}</li>
            )
          )}
        </ul>
      </section>

      {/* Work Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-cyan-600">
          Work Experience
        </h2>
        {fineTunedData.workExperience.map(
          (
            experience: {
              jobTitle:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined;
              company:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined;
              location:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined;
              startDate:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined;
              endDate: any;
              responsibilities: any[];
            },
            index: Key | null | undefined
          ) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold">
                {experience.jobTitle} at {experience.company}
              </h3>
              <p className="italic">
                {experience.location} • {experience.startDate} -{" "}
                {experience.endDate || "Present"}
              </p>
              <ul className="list-disc pl-5 mt-2">
                {experience.responsibilities.map(
                  (
                    responsibility:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | null
                      | undefined,
                    idx: Key | null | undefined
                  ) => (
                    <li key={idx}>{responsibility}</li>
                  )
                )}
              </ul>
            </div>
          )
        )}
      </section>

      {/* Languages */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-cyan-600">Languages</h2>
        <ul className="list-disc pl-5">
          {fineTunedData.languages.map(
            (
              languageObj: {
                language:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined;
                proficiency:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined;
              },
              index: Key | null | undefined
            ) => (
              <li key={index}>
                {languageObj.language} - {languageObj.proficiency}
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  );
}
