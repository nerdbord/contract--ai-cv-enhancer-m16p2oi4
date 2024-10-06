import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import invariant from "tiny-invariant";
import { resumeSchema } from "~/types/resume";

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

export const readCVIntoSchema = async (parsedResume: string) => {
  return generateObject({
    model: openaiClient("gpt-4-turbo"),
    system: "Fill out the schema based on the provided file.",
    prompt: parsedResume,
    schema: resumeSchema,
  });
};