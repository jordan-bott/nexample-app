"use client";
import React, { useEffect, useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({
            session: result.createdSessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                // Check for tasks and navigate to custom UI to help users resolve them
                // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
                console.log(session?.currentTask);
                return;
              }

              router.push("/");
            },
          });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div className="flex flex-col place-content-center w-screen h-screen place-items-center text-dark-text">
      <h1 className="bg-med-green rounded-t-xl p-4 w-[50%] text-center border-dark-green border-[1.6] border-b-[1.5] text-dark-text font-semibold">
        Forgot Password?
      </h1>
      <form
        className="bg-light-green flex flex-col w-[50%] p-4 border-dark-green border-[1.6] rounded-b-xl"
        onSubmit={!successfulCreation ? create : reset}
      >
        {!successfulCreation && (
          <div>
            <label htmlFor="email">Provide your email address</label>
            <input
              className="border-dark-green border-2 ml-4 rounded-lg w-[50%] px-3 hover:scale-105"
              type="email"
              placeholder="e.g john@doe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="mt-4 cursor-pointer hover:scale-110 self-center w-full text-center text-dark-text">
              Send password reset code
            </button>
            {error && <p>{error}</p>}
          </div>
        )}

        {successfulCreation && (
          <div>
            <div>
              <label htmlFor="password">Enter your new password</label>
              <input
                className="border-dark-green border-2 ml-4 rounded-lg w-[50%] px-3 hover:scale-105"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="code">
                Enter the password reset code that was sent to your email
              </label>
              <input
                className="border-dark-green border-2 ml-4 rounded-lg w-[25%] px-3 hover:scale-105 mt-2"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button className="mt-4 cursor-pointer hover:scale-110 self-center text-dark-text w-full text-center">
              Reset
            </button>
            {error && <p>{error}</p>}
          </div>
        )}

        {secondFactor && (
          <p>2FA is required, but this UI does not handle that</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
