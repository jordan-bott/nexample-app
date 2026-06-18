"use client";

import {
  useOrganizationCreationDefaults,
  useOrganizationList,
} from "@clerk/nextjs";
import { FormEventHandler, useEffect, useState } from "react";

export default function CreateOrganization() {
  const { isLoaded, createOrganization, setActive } = useOrganizationList();
  const { data: defaults, isLoading: isLoadingDefaults } =
    useOrganizationCreationDefaults();
  const [organizationName, setOrganizationName] = useState("");

  // Pre-populate the form with suggested organization name
  useEffect(() => {
    if (defaults?.form.name) {
      setOrganizationName(defaults.form.name);
    }
  }, [defaults?.form.name]);

  if (!isLoaded || isLoadingDefaults) return <p>Loading...</p>;

  // Check if an organization with this name/domain already exists
  const advisory = defaults?.advisory;
  const showWarning = advisory?.code === "organization_already_exists";
  const existingOrgName = advisory?.meta?.organization_name;
  const existingOrgDomain = advisory?.meta?.organization_domain;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const newOrganization = await createOrganization?.({
        name: organizationName,
      });
      // Set the created Organization as the Active Organization
      if (newOrganization)
        await setActive({ organization: newOrganization.id });
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
    setOrganizationName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.currentTarget.value)}
        placeholder="Organization name"
      />
      {showWarning && (
        <p style={{ color: "orange" }}>
          An organization "{existingOrgName}" already exists for the domain "
          {existingOrgDomain}".
        </p>
      )}
      <button type="submit">Create organization</button>
    </form>
  );
}
