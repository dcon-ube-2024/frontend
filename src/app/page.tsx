"use client";
import {useNotification} from "@/notifications/useNotification";
import React from "react";
import {NotificationSubscriptionForm} from "@/components/NotificationSubscriptionForm";
import {UnsupportedNotificationMessage} from "@/components/UnsupportedNotificationMessage";
import NotificationSubscriptionStatus from "@/components/NotificationSubscriptionStatus";
import {SigninForm} from "@/components/SigninForm";

const Home = () => {
    const {isSupported, isSubscribed} = useNotification();

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100dvh)] bg-gray-100 p-4">
            {!isSupported ? (
                <UnsupportedNotificationMessage/>
            ) : (
                <NotificationSubscriptionStatus/>
            )}
            <SigninForm/>
        </div>
    );
};

export default Home;
