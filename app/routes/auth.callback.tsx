import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import {
  createServerClient,
  parse,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr/src";


export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";
  const headers = new Headers();
  console.log("kakasraka: ", requestUrl);
  console.log("code: ", code);
//   console.log(`\n\nALL KURWA: \n\n`, request);

  console.log("dupasraka");

  const cookies = request.headers.get("cookie") ?? "";
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    return redirect(next, { headers });
  } else  {
    console.log("Supabase authentication error: ", error.message);
    return redirect("/", { headers });
  }
}

// import { LoaderFunction, redirect } from "@remix-run/node";
// import { supabase } from "~/models/user.server";

// export let loader: LoaderFunction = async ({ request }) => {
//   const url = new URL(request.url);
//   const code = url.searchParams.get("code");

//   if (code) {
//     // Supabase will automatically exchange the code for a session
//     const { error } = await supabase.auth.exchangeCodeForSession(code);

//     if (error) {
//       console.error("Error exchanging code for session:", error.message);
//       return redirect("/login?error=oauth");
//     }

//     // The session is now stored and the user is logged in.
//     return redirect("/upload"); // Redirect to your desired page
//   }

//   return redirect("/login");
// };
