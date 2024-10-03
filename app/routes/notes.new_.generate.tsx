import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { generateAiBodyText } from "../models/openai.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const titleText = formData.get("titleText") as string;
  const response = await generateAiBodyText(
    titleText || "Please generate a random message.",
  );
  return json({ bodyText: response.text });
};
