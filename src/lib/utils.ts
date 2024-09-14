import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NODE_WALLET_PUBLIC_KEY = "HC7xyZvuwMyA6CduUMbAWXmvp4vTmNLUGoPi5xVc3t7P";

export function filterNodeWallet(keys: string[]): string[] {
  // console.log("Original keys:", keys);
  const filteredKeys = keys.filter(key => {
    try {
      return key !== NODE_WALLET_PUBLIC_KEY;
    } catch (error) {
      console.error(`無効な公開鍵: ${key}`, error);
      return false;
    }
  });
  // console.log("Filtered keys:", filteredKeys);
  return filteredKeys;
}

