import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    if (eventType === "user.created") {
      try {
        await prisma.user.create({
          data: {
            email: evt.data.email_addresses[0].email_address,
            clerk_id: evt.data.id,
          },
        });
      } catch (error) {
        console.error("Error updating user table", error);
      }
    }

    const users = await prisma.user.findMany();

    console.log(users);

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
