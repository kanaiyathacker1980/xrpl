import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXRPAmount(drops: string | number): string {
  const xrp = typeof drops === "string" ? parseInt(drops) / 1000000 : drops / 1000000;
  return xrp.toFixed(6);
}

export function formatTokenAmount(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toFixed(2);
}
