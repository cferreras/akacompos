import { set16Runtime } from "./Set16";
import { set17Runtime } from "./Set17";
import type { SetRuntime } from "../types";

const runtimes: Record<string, SetRuntime> = {
  [set16Runtime.id]: set16Runtime,
  [set17Runtime.id]: set17Runtime,
};

export function getSetRuntime(set?: string | null): SetRuntime {
  const normalizedSet = set?.trim().toLowerCase();
  if (!normalizedSet) return set16Runtime;
  return runtimes[normalizedSet] || set17Runtime;
}

export function getSetLabel(set?: string | null): string {
  return getSetRuntime(set).label;
}

export function isLegacySet(set?: string | null): boolean {
  return (set?.trim().toLowerCase() || "set16") === "set16";
}
