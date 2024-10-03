import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json({ errors: { title: "Title is required" } }, { status: 400 });
  }

  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { body: "Body is required" } }, { status: 400 });
  }

  const note = await createNote({ title, body, userId });
  return redirect(`/notes/${note.id}`);
};

interface FetcherData {
  bodyText: string;
}

export default function NewNotePage() {
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");

  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data && (fetcher.data as FetcherData).bodyText) {
      setBodyText((fetcher.data as FetcherData).bodyText);
    }
  }, [fetcher.data]);

  return (
    <div>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Title: </span>
            <input
              name="title"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Body: </span>
            <textarea
              name="body"
              rows={8}
              className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            ></textarea>
          </label>
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 ml-4  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </Form>
      <fetcher.Form action="/notes/new/generate" method="post">
        <input type="hidden" name="titleText" value={titleText} />
        <Button type="submit" disabled={fetcher.state != "idle"}>
          {fetcher.state !='idle' ? "Loading..." : "Generate text"}
        </Button>
      </fetcher.Form>
    </div>
  );
}
