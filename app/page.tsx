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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
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
