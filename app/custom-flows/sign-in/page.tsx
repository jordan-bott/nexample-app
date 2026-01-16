"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { EmailCodeFactor, TOTPFactor } from "@clerk/types";
import { useRouter } from "next/navigation";
import { OAuthStrategy } from "@clerk/types";
import { useState } from "react";

export default function CustomSignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showEmailCode, setShowEmailCode] = useState(false);
  const router = useRouter();
  const [displayTOTP, setDisplayTOTP] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded) return null;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
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
      } else if (signInAttempt.status === "needs_second_factor") {
        // Check if email_code is a valid second factor
        // This is required when Client Trust is enabled and the user
        // is signing in from a new device.
        // See https://clerk.com/docs/guides/secure/client-trust
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor): factor is EmailCodeFactor =>
            factor.strategy === "email_code"
        );

        const totpFactor = signInAttempt.supportedSecondFactors?.find(
          (factor): factor is TOTPFactor => factor.strategy === "totp"
        );

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setShowEmailCode(true);
        }

        if (totpFactor) {
          setDisplayTOTP(true);
        }
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }

  // Handle the submission of the TOTP of Backup Code submission
  const handleTOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      await signIn.create({
        identifier: email,
        password,
      });

      // Attempt the TOTP or backup code verification
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: useBackupCode ? "backup_code" : "totp",
        code: code,
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

            await router.push("/");
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.log(signInAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  // Handle the submission of the email verification code
  const handleEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            router.push("/");
          },
        });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Display email code verification form
  if (showEmailCode) {
    return (
      <>
        <h1>Verify your email</h1>
        <p>A verification code has been sent to your email.</p>
        <form onSubmit={handleEmailCode}>
          <div>
            <label htmlFor="code">Enter verification code</label>
            <input
              onChange={(e) => setCode(e.target.value)}
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              value={code}
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      </>
    );
  }

  if (displayTOTP) {
    return (
      <div>
        <h1>Verify your account</h1>
        <form onSubmit={(e) => handleTOTPSubmit(e)}>
          <div>
            <label htmlFor="code">Code</label>
            <input
              onChange={(e) => setCode(e.target.value)}
              id="code"
              name="code"
              type="text"
              value={code}
            />
          </div>
          <div>
            <label htmlFor="backupcode">This code is a backup code</label>
            <input
              onChange={() => setUseBackupCode((prev) => !prev)}
              id="backupcode"
              name="backupcode"
              type="checkbox"
              checked={useBackupCode}
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      </div>
    );
  }

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn
      ?.authenticateWithRedirect({
        strategy,
        redirectUrl: "/custom-flows/sign-in/sso-callback",
        redirectUrlComplete: "/", // Learn more about session tasks at https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
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
        <div>
          <label htmlFor="password">Enter password</label>
          <input
            className="border-dark-green border-2 ml-4 rounded-lg w-[50%] px-3 hover:scale-105"
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            value={password}
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
