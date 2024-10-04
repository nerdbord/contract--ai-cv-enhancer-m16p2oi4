import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser } from "./session.server";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }];
};
import appStylesHref from "./styles/tailwind.css?url";
import tailwind from "./styles/index.css?url";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: appStylesHref },
    { rel: "stylesheet", href: tailwind },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await getUser(request);
    return json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return json({ user: null }, { status: 500 });
  }
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
