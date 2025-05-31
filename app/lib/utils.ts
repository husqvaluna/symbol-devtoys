import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string) {
  if (text.length === 0) {
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.info(`Copied to clipBoard!`);
      console.info(text);
    })
    .catch((error) => console.error("Your browser doesn't support copy to clipboard"));
}
