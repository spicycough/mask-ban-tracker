import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTitle(title = "Home") {
  return "%s | Vike Solid".replace("%s", title);
}

export function toTitlecase(str: string) {
  return str.replace(/\w\S*/g, (s) => {
    const [first, rest] = [s.charAt(0), s.slice(1)];
    return first.toUpperCase() + rest.toLowerCase();
  });
}
