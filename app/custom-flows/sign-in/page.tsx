"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { EmailCodeFactor, SignInFirstFactor } from "@clerk/types";
import { useRouter } from "next/navigation";
import { OAuthStrategy } from "@clerk/types";

export default function CustomSignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [verifying, setVerifying] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signIn) return null;

    try {
      // Start the sign-in process using the phone number method
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      // Filter the returned array to find the 'phone_code' entry
      const isEmailCodeFactor = (
        factor: SignInFirstFactor
      ): factor is EmailCodeFactor => {
        return factor.strategy === "email_code";
      };
      const emailCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor);

      if (emailCodeFactor) {
        // Grab the phoneNumberId
        const { emailAddressId } = emailCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId,
        });

        // Set verifying to true to display second form
        // and capture the OTP code
        setVerifying(true);
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signIn) return null;

    try {
      // Use the code provided by the user and attempt verification
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
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
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signInAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
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

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/custom-flows/sign-in/sso-callback",
        redirectUrlComplete: "/", // Learn more about session tasks at https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: any) => {
        // See https://clerk.com/docs/guides/development/custom-flows/error-handling
        // for more info on error handling
        console.log(err.errors);
        console.error(err, null, 2);
        alert(`Whoops. Something bad happened. ${err.errors[0].longMessage}`);
      });
  };

  return (
    <div className="flex flex-col place-content-center w-screen h-screen place-items-center text-dark-text">
      <h1 className="bg-med-green rounded-t-xl p-4 w-[50%] text-center border-dark-green border-[1.6] border-b-[1.5] text-dark-text font-semibold">
        Sign in
      </h1>
      <form
        className="bg-light-green flex flex-col w-[50%] p-4 border-dark-green border-[1.6] border-b-0"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="email">Enter your email address</label>
          <input
            className="border-dark-green border-2 ml-4 rounded-lg w-[50%] px-3 hover:scale-105"
            value={email}
            id="email"
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="mt-4 cursor-pointer hover:scale-110 self-center text-dark-text"
          type="submit"
        >
          Continue
        </button>
      </form>
      <div className="bg-light-green flex flex-col w-[50%] rounded-b-xl p-4 border-dark-green border-[1.6]">
        <button
          className="cursor-pointer hover:scale-110"
          onClick={() => signInWith("oauth_google")}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
