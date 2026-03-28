import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convert kebab-case to Title Case ("step-flow" -> "Step Flow") */
export function kebabToTitle(name: string) {
  return name.split("-").map(w => w[0]!.toUpperCase() + w.slice(1)).join(" ");
}
