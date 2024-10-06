import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string; // This will be a base64 encoded string
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file); // Use readAsDataURL for base64 encoding
  });
};