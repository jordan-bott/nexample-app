"use client";

import { useUser, useReverification } from "@clerk/nextjs";
import { TOTPResource } from "@clerk/types";
import Link from "next/link";
import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { GenerateBackupCodes } from "../page";

type AddTotpSteps = "add" | "verify" | "backupcodes" | "success";

type DisplayFormat = "qr" | "uri";

function AddTotpScreen({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
}) {
  const { user } = useUser();
  const [totp, setTOTP] = React.useState<TOTPResource | undefined>(undefined);
  const [displayFormat, setDisplayFormat] = React.useState<DisplayFormat>("qr");
  const createTOTP = useReverification(() => user?.createTOTP());

  React.useEffect(() => {
    void createTOTP()
      .then((totp) => {
        setTOTP(totp);
      })
      .catch((err) =>
        // See https://clerk.com/docs/guides/development/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      );
  }, []);

  return (
    <>
      <h1>Add TOTP MFA</h1>

      {totp && displayFormat === "qr" && (
        <>
          <div>
            <QRCodeSVG value={totp?.uri || ""} size={200} />
          </div>
          <button onClick={() => setDisplayFormat("uri")}>
            Use URI instead
          </button>
        </>
      )}
      {totp && displayFormat === "uri" && (
        <>
          <div>
            <p>{totp.uri}</p>
          </div>
          <button onClick={() => setDisplayFormat("qr")}>
            Use QR Code instead
          </button>
        </>
      )}
      <button onClick={() => setStep("add")}>Reset</button>

      <p>Once you have set up your authentication app, verify your code</p>
      <button onClick={() => setStep("verify")}>Verify</button>
    </>
  );
}

function VerifyTotpScreen({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
}) {
  const { user } = useUser();
  const [code, setCode] = React.useState("");

  const verifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await user?.verifyTOTP({ code });
      setStep("backupcodes");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="text-dark-text">
      <h1>Verify TOTP</h1>
      <form onSubmit={(e) => verifyTotp(e)}>
        <label htmlFor="totp-code">
          Enter the code from your authentication app
        </label>
        <input
          type="text"
          id="totp-code"
          onChange={(e) => setCode(e.currentTarget.value)}
        />
        <button type="submit">Verify code</button>
        <button onClick={() => setStep("add")}>Reset</button>
      </form>
    </div>
  );
}

function BackupCodeScreen({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
}) {
  return (
    <>
      <h1>Verification was a success!</h1>
      <div>
        <p>
          Save this list of backup codes somewhere safe in case you need to
          access your account in an emergency
        </p>
        <GenerateBackupCodes />
        <button onClick={() => setStep("success")}>Finish</button>
      </div>
    </>
  );
}

function SuccessScreen() {
  return (
    <>
      <h1>Success!</h1>
      <p>
        You have successfully added TOTP MFA via an authentication application.
      </p>
    </>
  );
}

export default function AddMFaScreen() {
  const [step, setStep] = React.useState<AddTotpSteps>("add");
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    // Handle loading state
    return null;
  }

  if (!isSignedIn) {
    // Handle signed out state
    return <p>You must be logged in to access this page</p>;
  }

  return (
    <div className="text-dark-text">
      {step === "add" && <AddTotpScreen setStep={setStep} />}
      {step === "verify" && <VerifyTotpScreen setStep={setStep} />}
      {step === "backupcodes" && <BackupCodeScreen setStep={setStep} />}
      {step === "success" && <SuccessScreen />}
      <Link href="/custom-flows/manage-mfa">Manage MFA</Link>
    </div>
  );
}
