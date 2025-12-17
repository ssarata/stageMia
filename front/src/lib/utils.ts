import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) {
    return "—";
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Date invalide";
    }
    return new Intl.DateTimeFormat('fr-FR').format(date);
  } catch (error) {
    return "Date invalide";
  }
};