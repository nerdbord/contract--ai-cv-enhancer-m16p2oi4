import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import invariant from "tiny-invariant";
import { cvSchema, resumeSchema, resumeType } from "~/types/resume";

const openaiApiKey = process.env.OPENAI_API_KEY;

/* 
Hey Nerdy, you should find what you're looking for in this file.
*/
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
  resumeText: string,
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
        Your job is to create a CV for the user by filling out the provided schema. The CV you create should be based on 
        the provided resume, but fine-tuned for that specific job offer.`,
      },
      { role: "user", content: `\nThis is the job offer: ${parsedWebsite}\n` },
      { role: "user", content: `\nThis is the resume: ${resumeText}\n` },
    ],
  });
};

export const enhanceCVBasedOnOffer = async (
  resumeText: string,
  parsedWebsite: string
) => {
  return generateObject({
    model: openaiClient("gpt-4-turbo"),
    schema: resumeSchema,
    output: "object",
    messages: [
      {
        role: "system",
        content: `You will be provided with two prompts from the user. 
        The first one will be text of a job offer they are applying to, and the second one will be the contents of their resume.
        Your job is to fill out the resume schema by upgrading the resume a little bit. You can make stuff up, but don't go crazy.`,
      },
      { role: "user", content: parsedWebsite },
      { role: "user", content: resumeText },
    ],
  });
};
