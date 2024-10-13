import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
  useRef,
  useState,
} from "react";
import CVComponent from "~/components/cvComponent";
import CV from "~/components/cvComponent";
import { mockCVData } from "~/lib/mock/jobOffer";
import { getSession } from "~/session.server";
import { cvType, resumeType } from "~/types/resume";
import logo from "/logo.svg";
import { Button } from "~/components/ui/button";
import generatePDF from "react-to-pdf";
import { Colors } from "~/types/color";

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
  const [color, setColor] = useState<Colors>(Colors.Sky);
  // const { fineTunedData } = useLoaderData<typeof loader>();
  // const typedData: cvType = fineTunedData;
  const typedData: cvType = mockCVData;
  const targetRef = useRef(null);

  const handleDownload = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    generatePDF(() => targetRef.current, { filename: "yourCV.pdf" });
  };

  const handleColorChange = (color: Colors) => {
    setColor(color);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col mt-12 mr-12">
        Colors:
        {(Object.keys(Colors) as Array<keyof typeof Colors>).map(
          (value, index) => {
            const colorString = Colors[value] as string;
            const classString = `w-16 h-16 ${
              Colors[value] === color
                ? `border-8 border-${colorString}-100`
                : ""
            } rounded-full m-1 bg-${colorString}-50`;
            return (
              <div
                key={index}
                className={classString}
                onClick={() => handleColorChange(Colors[value])}
              ></div>
            );
          }
        )}
      </div>
      <div className="w-full max-w-[80vh] z-10">
        <img src={logo} alt="Logo" className="absolute top-16 left-24" />
        <div className="w-full flex justify-end mt-24">
          <Button
            type="button"
            variant="default"
            className="bg-cyan-700 hover:bg-cyan-800 focus:bg-cyan-900 mb-6"
            onClick={handleDownload}
          >
            Download your CV
          </Button>
        </div>
        <div ref={targetRef}>
          <CVComponent data={typedData} color={color} />
        </div>
      </div>
    </div>
  );
}
