import { clsx, type ClassValue } from "clsx";
import { differenceInMinutes, formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function softTime(date: Date) {
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function respondedIn(createdAt: Date, respondedAt: Date) {
  const minutes = Math.max(0, differenceInMinutes(respondedAt, createdAt));
  return minutes <= 1 ? "Responded in 1 min" : `Responded in ${minutes} min`;
}
