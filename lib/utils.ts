import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLastActive(dateString?: string | null): string {
  if (!dateString) return 'Offline';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Offline';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    // If future or just now (within 1 minute)
    if (diffSecs < 60) {
      return 'Last seen just now';
    }

    // Within the last hour: "Last seen 5 mins ago"
    if (diffMins < 60) {
      return `Last seen ${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    }

    // Format time: e.g. "10:33 AM"
    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    // Today
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return `Last seen today at ${timeStr}`;
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return `Last seen yesterday at ${timeStr}`;
    }

    // Within last 6 days: e.g. "Last seen Thursday at 10:33 AM"
    if (diffHours < 24 * 6) {
      const weekday = date.toLocaleDateString([], { weekday: 'long' });
      return `Last seen ${weekday} at ${timeStr}`;
    }

    // Older than 6 days: e.g. "Last seen Oct 2 at 10:33 AM"
    const dateStr = date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    return `Last seen ${dateStr} at ${timeStr}`;
  } catch {
    return 'Offline';
  }
}
