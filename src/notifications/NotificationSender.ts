import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
    "mailto:tarougu74@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "BGkTM_f63kh4-nv6GORyYsg6jNpYkkA8ZTUhrqL_LA1XjG_05Dc_JRUN3FYIAMfYr1YAaFXlqLl5UAe8rjyJu9g",
    process.env.VAPID_PRIVATE_KEY ?? "bAYmYRwL5PEeLx_Djwnbnr-n4Nkda5LU6z0DPAhCbEI"
);

export const sendNotification = async (subscription: PushSubscription, title: string, message: string) => {
    const pushPayload: any = {
        title: title,
        body: message,
        //image: "/logo.png", if you want to add an image
        icon: "/user.png",
        url: process.env.NOTIFICATION_URL ?? "/",
        badge: "/logo.svg",
    };

    webpush
        .sendNotification(subscription, JSON.stringify(pushPayload))
        .then(() => {
            console.log("Notification sent");
        })
        .catch((error) => {
            console.error("Error sending notification", error);
        });
};
