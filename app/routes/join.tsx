import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUserSession, getUserId } from "~/session.server";
import { createUser, getProfileByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils";
import * as React from "react";
import logo from "/logo.svg";
import github from "/github.svg";
import google from "/google.svg";
import figma from "/figma.svg";
import triangles from "/login triangles.svg";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Sign Up",
    },
  ];
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    terms?: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const acceptedTerms = formData.get("terms");
  
  // Ensure the email is valid  
  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid." } },
      { status: 400 }
    );
  }

  // What if a user sends us a password through other means than our form?
  if (typeof password !== "string") {
    return json(
      { errors: { password: "Valid password is required." } },
      { status: 400 }
    );
  }

  // Enforce minimum password length
  if (password.length < 6) {
    return json<ActionData>(
      { errors: { password: "Password is too short." } },
      { status: 400 }
    );
  }

  // A user could potentially already exist within our system
  // and we should communicate that well
  const existingUser = await getProfileByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email." } },
      { status: 400 }
    );
  }

  //Accept terms and conditions
  if (!acceptedTerms) {
    return json<ActionData>(
      { errors: { terms: "Please accept terms and conditions." } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user?.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef?.current?.focus();
    }

    if (actionData?.errors?.password) {
      passwordRef?.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-2xl p-8">
        <img src={logo} alt="Logo" className="absolute top-16 left-24" />

        <Form className="space-y-6" method="post" noValidate>
          <div>
            <label
              className={`text-sm font-medium ${
                actionData?.errors?.email ? "text-red-600" : "text-black"
              }`}
              htmlFor="email"
            >
              <span className="block">Email</span>
              <input
                className={`w-full rounded-md border  px-3 py-2 my-1.5 text-lg ${
                  actionData?.errors?.email
                    ? "border-red-600"
                    : "border-gray-400"
                }`}
                autoComplete="email"
                placeholder="Email"
                type="email"
                name="email"
                id="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                ref={emailRef}
              />
              {actionData?.errors?.email && (
                <span className="block pt-1" id="email-error">
                  {actionData?.errors?.email}
                </span>
              )}
            </label>
          </div>
          <div>
            <label
              className={`text-sm font-medium ${
                actionData?.errors?.password ? "text-red-600" : "text-black"
              }`}
              htmlFor="password"
            >
              <span className="block">Password</span>
              <input
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                autoComplete=""
                className={`w-full rounded-md border px-3 py-2 my-1.5 text-lg ${
                  actionData?.errors?.password
                    ? "border-red-600"
                    : "border-gray-400"
                }`}
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                ref={passwordRef}
              />
              {actionData?.errors?.password && (
                <span className="pt-1" id="password-error">
                  {actionData?.errors?.password}
                </span>
              )}
            </label>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox id="terms" name="terms" />
              <label
                htmlFor="terms"
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  actionData?.errors?.terms ? "text-red-600" : "text-black"
                }`}
              >
                Accept terms and conditions
              </label>
            </div>
            {actionData?.errors?.terms && (
              <span
                className={`pt-1 text-red-600`}
                id="terms-error"
              >
                {actionData?.errors?.terms}
              </span>
            )}
          </div>
          <Button
            className="w-full rounded bg-cyan-700 py-2 px-4 text-white hover:bg-cyan-800 focus:bg-cyan-900 "
            type="submit"
          >
            Sign up
          </Button>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex items-center justify-start">
            <div className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-cyan-900 hover:underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
