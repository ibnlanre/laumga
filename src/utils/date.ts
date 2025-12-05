import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Timestamp } from "firebase/firestore";

export type DateInput = Date | number | string | Timestamp | null | undefined;

/**
 * Convert any date input to a JavaScript Date object
 */
export function toDate(date: DateInput): Date | null {
  if (!date) return null;

  if (date instanceof Date) return date;

  if (typeof date === "number") return new Date(date);

  if (typeof date === "string") {
    // Try parsing ISO string first
    const parsed = parseISO(date);
    if (parsed.toString() !== "Invalid Date") return parsed;
    // Fallback to new Date() for other formats
    return new Date(date);
  }

  if (date instanceof Timestamp) return date.toDate();

  // Handle object with seconds/nanoseconds (Firestore Timestamp-like)
  if (typeof date === "object" && "seconds" in date && "nanoseconds" in date) {
    // @ts-ignore - checking for duck typing
    return new Timestamp(date.seconds, date.nanoseconds).toDate();
  }

  return null;
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
export function now(): number {
  return Date.now();
}
