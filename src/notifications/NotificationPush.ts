const SERVICE_WORKER_FILE_PATH = "./notification-sw.js";

export function isNotificationSupported(): boolean {
    let unsupported = false;
    if (
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("showNotification" in ServiceWorkerRegistration.prototype)
    ) {
        unsupported = true;
    }
    return !unsupported;
}

export function isPermissionGranted(): boolean {
    return Notification.permission === "granted";
}

export function isPermissionDenied(): boolean {
    return Notification.permission === "denied";
}

export async function registerAndSubscribe(onSubscribe: (subs: PushSubscription | null) => void,onError: (e: Error) => void): Promise<void> {
    try {
        await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
        navigator.serviceWorker.ready
            .then((registration: ServiceWorkerRegistration) => {
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: "BGkTM_f63kh4-nv6GORyYsg6jNpYkkA8ZTUhrqL_LA1XjG_05Dc_JRUN3FYIAMfYr1YAaFXlqLl5UAe8rjyJu9g",
                });
            })
            .then((subscription: PushSubscription) => {
                console.info("Created subscription Object: ", subscription.toJSON());
                onSubscribe(subscription);
            })
            .catch((e) => {
                onError(e);
            });
    } catch (e: any) {
        onError(e);
    }
}