import { sendNotification } from "@/notifications/NotificationSender";
import { NextRequest } from "next/server";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  const { subscription, title, message } = await req.json();
  await sendNotification(subscription, title, message);
  console.log("Push sent.");
  console.log(subscription);
  console.log(title);
  console.log(message);
  return new Response(JSON.stringify({ message: "Push sent." }), {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
