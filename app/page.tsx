"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const buttonClasses =
    "bg-dark-green p-4 rounded-xl font-semibold text-sm w-40 text-center border-[1.25] border-light-green hover:scale-108 justify-self-center cursor-pointer";

  return (
    <div className="">
      <main className="text-4xl font-thin">
        <div className="grid h-screen w-[40%] grid-cols-2 place-content-around gap-4 place-self-center">
          <SignedIn>
            <Link className={buttonClasses} href="/create-organization">
              Create New Organization
            </Link>
            <Link className={buttonClasses} href="/organization-profile">
              Organization Profile
            </Link>
            <Link className={buttonClasses} href="/organization-list">
              Organization List
            </Link>
            <Link className={buttonClasses} href="/user-profile">
              User Profile
            </Link>
            <Link className={buttonClasses} href="/custom-flows/manage-mfa">
              Set up MFA (Custom)
            </Link>
            <SignOutButton>
              <button className={buttonClasses}>Sign Out</button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link className={buttonClasses} href="/custom-flows/sign-in">
              Custom Sign In
            </Link>
            <Link className={buttonClasses} href="/custom-flows/sign-up">
              Custom Sign Up
            </Link>
            <SignInButton>
              <button className={buttonClasses}>
                Self Hosted <br /> Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className={buttonClasses}>
                Self Hosted <br /> Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}
