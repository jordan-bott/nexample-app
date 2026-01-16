"use client";

import * as React from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import Link from "next/link";
import { BackupCodeResource } from "@clerk/types";

// If TOTP is enabled, provide the option to disable it
const TotpEnabled = () => {
  const { user } = useUser();
  const disableTOTP = useReverification(() => user?.disableTOTP());

  return (
    <div>
      <p>
        TOTP via authentication app enabled -{" "}
        <button onClick={() => disableTOTP()}>Remove</button>
      </p>
    </div>
  );
};

// If TOTP is disabled, provide the option to enable it
const TotpDisabled = () => {
  return (
    <div>
      <p>
        Add TOTP via authentication app -{" "}
        <Link href="/custom-flows/manage-mfa/add">
          <button>Add</button>
        </Link>
      </p>
    </div>
  );
};

// Generate and display backup codes
export function GenerateBackupCodes() {
  const { user } = useUser();
  const [backupCodes, setBackupCodes] = React.useState<
    BackupCodeResource | undefined
  >(undefined);
  const createBackupCode = useReverification(() => user?.createBackupCode());

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (backupCodes) {
      return;
    }

    setLoading(true);
    void createBackupCode()
      .then((backupCode: BackupCodeResource | undefined) => {
        setBackupCodes(backupCode);
        setLoading(false);
      })
      .catch((err) => {
        // See https://clerk.com/docs/guides/development/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!backupCodes) {
    return <p>There was a problem generating backup codes</p>;
  }

  return (
    <ol>
      {backupCodes.codes.map((code, index) => (
        <li key={index}>{code}</li>
      ))}
    </ol>
  );
}

export default function ManageMFA() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [showNewCodes, setShowNewCodes] = React.useState(false);

  if (!isLoaded) {
    // Handle loading state
    return null;
  }

  if (!isSignedIn) {
    // Handle signed out state
    return <p>You must be logged in to access this page</p>;
  }

  return (
    <div className="flex flex-col place-content-center w-screen h-screen place-items-center text-dark-text">
      <h1 className="bg-med-green rounded-t-xl p-4 w-[50%] text-center border-dark-green border-[1.6] border-b-[1.5] text-dark-text font-semibold">
        User MFA Settings
      </h1>

      {/* Manage TOTP MFA */}
      {user.totpEnabled ? <TotpEnabled /> : <TotpDisabled />}

      {/* Manage backup codes */}
      {user.backupCodeEnabled && user.twoFactorEnabled && (
        <div>
          <p className="text-dark-text">
            Generate new backup codes? -{" "}
            <button onClick={() => setShowNewCodes(true)}>Generate</button>
          </p>
        </div>
      )}
      {showNewCodes && (
        <>
          <GenerateBackupCodes />
          <button onClick={() => setShowNewCodes(false)}>Done</button>
        </>
      )}
    </div>
  );
}
