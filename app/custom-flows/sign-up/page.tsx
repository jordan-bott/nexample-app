"use client";

import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CustomSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signUp) return null;

    try {
      // Start the sign-up process using the phone number method
      await signUp.create({
        emailAddress: email,
      });

      // Start the verification - a SMS message will be sent to the
      // number with a one-time code
      await signUp.prepareEmailAddressVerification();

      // Set verifying to true to display second form and capture the OTP code
      setVerifying(true);
    } catch (err: any) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
      alert(`Whoops. Something bad happened. ${err.errors[0].longMessage}`);
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signUp) return null;

    try {
      // Use the code provided by the user and attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }

            await router.push("/");
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signUpAttempt);
      }
    } catch (err: any) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
      alert(`Whoops. Something bad happened. ${err.errors[0].longMessage}`);
    }
  }

  if (verifying) {
    return (
      <>
        <h1>Verify your email address</h1>
        <form onSubmit={handleVerification}>
          <label htmlFor="code">Enter your verification code</label>
          <input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      </>
    );
  }

  return (
    <div className="flex flex-col place-content-center w-screen h-screen place-items-center">
      <h1 className="bg-med-green rounded-t-xl p-4 w-[50%] text-center border-dark-green border-[1.6] border-b-[1.5] text-dark-text font-semibold">
        Sign Up
      </h1>
      <form
        className="bg-light-green flex flex-col w-[50%] rounded-b-xl p-4 border-dark-green border-[1.6]"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="email">Enter your email address:</label>
          <input
            className="border-dark-green border-2 ml-4 rounded-lg w-[50%] px-3 hover:scale-105"
            value={email}
            id="email"
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="mt-4 cursor-pointer hover:scale-110" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}
