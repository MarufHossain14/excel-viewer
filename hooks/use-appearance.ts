"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";

export function useAppearance() {
  const settings = useAppStore((state) => state.settings);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const dark = settings.theme === "dark" || (settings.theme === "system" && media.matches);
      root.classList.toggle("dark", dark);
      root.dataset.fontSize = settings.fontSize;
    };
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [settings.fontSize, settings.theme]);
}
