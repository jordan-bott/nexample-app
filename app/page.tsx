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

  return (
    <div className="">
      <main className="text-4xl font-thin">
        <OrganizationSwitcher />
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
          <Link href="/user-profile">User Profile</Link>
          <Link href="/create-organization">Create New Organization</Link>
          <Link href="/organization-profile">Organization Profile</Link>
        </SignedIn>
      </main>
    </div>
  );
}
