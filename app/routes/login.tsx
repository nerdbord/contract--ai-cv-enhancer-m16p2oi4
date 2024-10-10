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

import logo from "/logo.svg";
import github from "/github.svg";
import google from "/google.svg";
import figma from "/figma.svg";
import triangles from "/login triangles.svg";

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
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return json(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/upload",
  });
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/upload";

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

        <Form
          method="post"
          className="mt-34 ml-52 space-y-6 max-w-md"
          noValidate
        >
          <h2 className="text-center text-2xl font-semibold">Log In</h2>
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
          <Button
            className="w-full rounded bg-cyan-700 py-2 px-4 text-white hover:bg-cyan-800 focus:bg-cyan-900 "
            type="submit"
          >
            Log in
          </Button>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="text-center">
            <span className="my-5">or continue with</span>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" type="reset">
              <img src={github} className="mr-2" />
              Github
            </Button>
            <Button variant="outline" type="reset">
              <img src={google} className="mr-2" />
              Google
            </Button>
            <Button variant="outline" type="reset">
              <img src={figma} className="mr-2 object-contain max-h-6" />
              Figma
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center mt-6 text-gray-500">
              Don't have an account?{" "}
              <Link
                className="text-cyan-900 hover:text-cyan-700 focus:text-cyan-950"
                to={{ pathname: "/join" }}
              >
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
