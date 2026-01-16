"use client";

import { OrganizationProfile } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
  const auth = useAuth();

  return (
    <div className="flex w-screen h-[calc(100vh-3.75rem)] place-content-center items-center">
      {auth?.orgId ? (
        <OrganizationProfile />
      ) : (
        <p className="text-dark-text text-xl">
          You do not have an organization set, please select your organization
          from the menu at the top left of the page!
        </p>
      )}
    </div>
  );
}
