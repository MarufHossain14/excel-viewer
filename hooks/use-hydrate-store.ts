"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";

export function useHydrateStore() {
  const hydrated = useAppStore((state) => state.hydrated);
  const hydrate = useAppStore((state) => state.hydrate);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  return hydrated;
}
