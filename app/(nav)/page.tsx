"use client";

import {
  OrganizationSwitcher,
  SignedIn,
  // useOrganizationList,
  // useOrganization,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
// import { useEffect, useRef } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const auth = useAuth();

  // Below is for setting Org Switcher to the first Org in the list,
  //   rather than using the last selected organization

  // const { setActive, userMemberships, isLoaded } = useOrganizationList({
  //   userMemberships: {
  //     pageSize: 1, // Just get the first one
  //   },
  // });

  // useEffect(() => {
  //   if (isLoaded && userMemberships?.data[0]?.organization) {
  //     const firstOrg = userMemberships?.data[0]?.organization;
  //     setActive({ organization: firstOrg.id });
  //   }
  // }, [isLoaded]);

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
