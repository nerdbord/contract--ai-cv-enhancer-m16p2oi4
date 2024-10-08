import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import invariant from "tiny-invariant";
import { cvSchema, resumeSchema, resumeType } from "~/types/resume";

const openaiApiKey = process.env.OPENAI_API_KEY;

invariant(
  openaiApiKey,
  "OPENAI_API_KEY must be set in your environment variables."
);

const openaiClient = createOpenAI({
  compatibility: "strict", // strict mode, enable when using the OpenAI API
  baseURL: "https://training.nerdbord.io/api/v1/openai",
  apiKey: openaiApiKey,
});

export const generateAiBodyText = async (prompt: string) => {
  return await generateText({
    model: openaiClient("gpt-4-turbo"),
    system: `You are supposed to create the body of a personal post-it note based on the provided note's title. 
        Please write a maximum of two paragraphs.`,
    prompt,
  });
};

export const readCVTextIntoSchema = async (parsedResume: string) => {
  return generateObject({
    model: openaiClient("gpt-4-turbo"),
    system:
      "You will be provided with data parsed from a pdf file. Your task is to read the data, and fill out the schema as per info from the data.",
    prompt: parsedResume,
    schema: resumeSchema,
  });
};

export const readCVFileIntoSchema = async (
  resumeData: string | Uint8Array | Buffer | ArrayBuffer | URL
) => {
  return generateObject({
    model: openaiClient("gpt-4-turbo"),
    schema: resumeSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: resumeData,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
  });
};

export const transformCVBasedOnOffer = async (
  resumeObject: string,
  parsedWebsite: string
) => {
  return generateObject({
    model: openaiClient("gpt-4-turbo"),
    schema: cvSchema,
    output: "object",
    messages: [
      {
        role: "system",
        content: `You will be provided with two prompts from the user. 
        The first one will be text of a job offer they are applying to, and the second one will be the contents of their resume.
        Your job is to fill out the resume schema, fine-tuning the resume in a way fitting to that specific offer.`,
      },
      { role: "user", content: parsedWebsite },
      { role: "user", content: resumeObject },
    ],
  });
};

export const enhanceCVBasedOnOffer = async (
  resumeObject: string,
  parsedWebsite: string
) => {
  return generateObject({
    model: openaiClient("gpt-4-turbo"),
    schema: cvSchema,
    output: "object",
    messages: [
      {
        role: "system",
        content: `You will be provided with two prompts from the user. 
        The first one will be text of a job offer they are applying to, and the second one will be the contents of their resume.
        Your job is to fill out the resume schema by upgrading the resume a little bit. You can make stuff up, but don't go crazy.`,
      },
      { role: "user", content: parsedWebsite },
      { role: "user", content: JSON.stringify(resumeObject) },
    ],
  });
};
