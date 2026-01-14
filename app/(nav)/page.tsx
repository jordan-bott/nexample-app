"use client";

import { OrganizationSwitcher, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function NavBar() {
  const pathname = usePathname();
  const auth = useAuth();

  return (
    <>
      {!auth.isSignedIn && pathname === "/" ? null : (
        <div className="border-b-2 border-periwinkle w-screen flex justify-end h-15">
          <SignedIn>
            <OrganizationSwitcher />
          </SignedIn>
          {pathname != "/" ? (
            <Link
              className="text-sm text-periwinkle p-4 hover:text-dark-green"
              href="/"
            >
              Home Page
            </Link>
          ) : null}
        </div>
      )}
    </>
  );
}
