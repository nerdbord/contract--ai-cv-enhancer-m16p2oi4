import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import invariant from "tiny-invariant";

const openaiApiKey = process.env.OPENAI_API_KEY;

invariant(
  openaiApiKey,
  "OPENAI_API_KEY must be set in your environment variables.",
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
