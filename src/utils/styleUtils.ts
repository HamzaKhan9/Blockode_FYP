import clsx from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function clsMerge(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}
