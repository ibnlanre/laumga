import { notifications } from "@mantine/notifications";
import { AlertCircle, CheckCircle2, CircleSlash, Info } from "lucide-react";

export interface NotificationOptions {
  autoClose?: boolean | number;
  message: string;
  title?: string;
  withCloseButton?: boolean;
}

/**
 * Show an error notification with red color and alert icon
 */
export function showErrorNotification(options: NotificationOptions) {
  notifications.show({
    autoClose: options.autoClose ?? 7000,
    color: "red",
    icon: <CircleSlash size={16} />,
    message: options.message,
    title: options.title,
    withCloseButton: options.withCloseButton ?? true,
  });
}

/**
 * Show an info notification with blue color and info icon
 */
export function showInfoNotification(options: NotificationOptions) {
  notifications.show({
    autoClose: options.autoClose ?? 5000,
    color: "blue",
    icon: <Info size={16} />,
    message: options.message,
    title: options.title,
    withCloseButton: options.withCloseButton ?? true,
  });
}

/**
 * Show a success notification with green color and check icon
 */
export function showSuccessNotification(options: NotificationOptions) {
  notifications.show({
    autoClose: options.autoClose ?? 5000,
    color: "green",
    icon: <CheckCircle2 size={16} />,
    message: options.message,
    title: options.title,
    withCloseButton: options.withCloseButton ?? true,
  });
}

/**
 * Show a warning notification with yellow color and exclamation icon
 */
export function showWarningNotification(options: NotificationOptions) {
  notifications.show({
    autoClose: options.autoClose ?? 6000,
    color: "yellow",
    icon: <AlertCircle size={16} />,
    message: options.message,
    title: options.title,
    withCloseButton: options.withCloseButton ?? true,
  });
}
