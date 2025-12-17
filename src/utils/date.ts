import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const ISO_DATE_FORMAT = "yyyy-MM-dd";
export const ISO_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

export type DateInput = Date | number | string | Timestamp | null | undefined;

/**
 * Convert any date input to a JavaScript Date object
 */
export function toDate(date: DateInput): Date | null {
  if (!date) return null;

  if (date instanceof Date) return date;
  if (date instanceof Timestamp) return date.toDate();

  if (typeof date === "number") return new Date(date);
  if (typeof date === "string") {
    const parsedDate = parseISO(date);

    if (parsedDate.toString() !== "Invalid Date") {
      return parsedDate;
    }

    return new Date(date);
  }

  return null;
}

export function formatDateString(date: Date): string | null {
  const d = toDate(date);
  if (!d || d.toString() === "Invalid Date") return null;
  return format(d, ISO_DATE_TIME_FORMAT);
}

/**
 * Format a date to a string
 * Default format: "dd MMM yyyy" (e.g. 04 Dec 2025)
 */
export function formatDate(
  date: DateInput,
  formatStr: string = "dd MMM yyyy"
): string {
  const d = toDate(date);
  if (!d || d.toString() === "Invalid Date") return "";
  return format(d, formatStr);
}

/**
 * Format a date and time to a string
 * Default format: "dd MMM yyyy, h:mm a" (e.g. 04 Dec 2025, 2:30 PM)
 */
export function formatDateTime(
  date: DateInput,
  formatStr: string = "dd MMM yyyy, h:mm a"
): string {
  return formatDate(date, formatStr);
}

/**
 * Format a time to a string
 * Default format: "h:mm a" (e.g. 2:30 PM)
 */
export function formatTime(
  date: DateInput,
  formatStr: string = "h:mm a"
): string {
  return formatDate(date, formatStr);
}

/**
 * Get relative time string (e.g. "2 hours ago")
 */
export function formatRelative(date: DateInput): string {
  const d = toDate(date);
  if (!d || d.toString() === "Invalid Date") return "";
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Convert date to timestamp (milliseconds)
 */
export function toTimestamp(date: DateInput): number | null {
  const d = toDate(date);
  if (!d || d.toString() === "Invalid Date") return null;
  return d.getTime();
}

/**
 * Get current timestamp in milliseconds
 */
export const now = Date.now();
