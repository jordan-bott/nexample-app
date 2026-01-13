"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";

export default function Home() {
  const auth = useAuth();

  console.log(auth.orgId);

  const buttonClasses =
    "bg-dark-green p-4 rounded-xl font-semibold text-sm w-40 text-center border-[1.25] border-light-green hover:scale-108 justify-self-center";
  return (
    <div className="">
      <main className="text-4xl font-thin">
        <div className="grid h-screen w-[40%] grid-cols-2 place-content-around gap-4 place-self-center">
          <SignedIn>
            <SignOutButton>
              <button className={buttonClasses}>Sign Out</button>
            </SignOutButton>
            <Link href="/user-profile">User Profile</Link>
            <Link href="/create-organization">Create New Organization</Link>
            <Link href="/organization-profile">Organization Profile</Link>
          </SignedIn>
          <SignedOut>
            <Link className={buttonClasses} href="/custom-flows/sign-in">
              Custom Sign In
            </Link>
            <Link className={buttonClasses} href="/custom-flows/sign-up">
              Custom Sign Up
            </Link>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
        </div>
      </main>
    </div>
  );
}
