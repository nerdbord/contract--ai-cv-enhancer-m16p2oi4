import React from "react";
import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { verifyLogin } from "../models/user.server";
import { createUserSession, getUserId } from "../session.server";
import { validateEmail } from "../utils";
import { Button } from "../components/ui/button";

import logo from '../../public/logo.svg'
import triangles from '../../public/login triangles.svg'

export const meta: MetaFunction = () => {
  return [
    {
      title: "Login",
    },
  ];
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
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
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid." } }, { status: 400 });
  }

  if (typeof password !== "string") {
    return json(
      { errors: { password: "Valid password is required." } },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return json(
      { errors: { password: "Password is too short" } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password" } },
      { status: 400 },
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/notes",
  });
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/notes";

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
        <img
          src={logo}
          alt="Logo"
          className="absolute top-16 left-24"
        />

        <Form
          method="post"
          className="mt-34 ml-52 space-y-6 max-w-md"
          noValidate
        >
          <h2 className="text-center text-2xl font-semibold">Log In</h2>
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              <span className="block text-gray-900 ">Email</span>
              {actionData?.errors?.email && (
                <span className="block pt-1 text-red-700" id="email-error">
                  {actionData?.errors?.email}
                </span>
              )}
            </label>
            <input
              className="w-full rounded-md border border-gray-400 px-3 py-2 my-1.5 text-lg"
              autoComplete="email"
              placeholder="Email"
              type="email"
              name="email"
              id="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
              ref={emailRef}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">
              <span className="block text-gray-900">Password</span>
              {actionData?.errors?.password && (
                <span className="pt-1 text-red-700" id="password-error">
                  {actionData?.errors?.password}
                </span>
              )}
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              autoComplete=""
              className="w-full rounded-md border border-gray-400 px-3 py-2 my-1.5 text-lg"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              ref={passwordRef}
            />
          </div>
          <Button
            className="w-full rounded bg-cyan-900 py-2 px-4 text-white hover:bg-cyan-950 focus:bg-cyan-700"
            type="submit"
          >
            Log in
          </Button>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex items-center justify-between">
            <div className="text-center mt-6 text-gray-500">
              Don't have an account?{" "}
              <Link className="text-cyan-900 hover:text-cyan-700 focus:text-cyan-950" to={{ pathname: "/join" }}>
                Sign Up
              </Link>
            </div>
          </div>
        </Form>
      </div>
      <div className="hidden lg:block flex-1">
        <img
          src={triangles}
          alt="Decorative Triangles"
          className="absolute inset-y-0 right-0 h-full object-cover"
        />
      </div>
    </div>
  );
}