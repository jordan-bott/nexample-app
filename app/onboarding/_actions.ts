"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    const telRes = await client.phoneNumbers.createPhoneNumber({
      userId: userId,
      phoneNumber: formData.get("phoneNumber"),
    });
    return { publicMetaData: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
