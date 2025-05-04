import { format } from 'date-fns';

/**
 * Formats a date string to local date and time
 * @param dateString The date string to format (in UTC)
 * @returns Formatted date string in local timezone
 */
export function formatLocalDateTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
}

/**
 * Formats a date string to local date only
 * @param dateString The date string to format (in UTC)
 * @returns Formatted date string in local timezone
 */
export function formatLocalDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

/**
 * Formats a date string to local time only
 * @param dateString The date string to format (in UTC)
 * @returns Formatted time string in local timezone
 */
export function formatLocalTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
}

/**
 * Formats a date string to local date in a more verbose format
 * @param dateString The date string to format (in UTC)
 * @returns Formatted date string in local timezone
 */
export function formatLocalDateVerbose(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'PPP');
} 