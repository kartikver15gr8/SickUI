"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import SVGIcon from "../lib/svg-icon";
import { RAW_ICONS } from "../lib/icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
        <SVGIcon className="flex w-5" svgString={RAW_ICONS.DarkModeBtn} />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-[#F0F0F0] dark:hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
    >
      {theme === "light" ? (
        <SVGIcon className="flex w-5" svgString={RAW_ICONS.LightModeBtn} />
      ) : (
        <SVGIcon className="flex w-5" svgString={RAW_ICONS.DarkModeBtn} />
      )}
    </button>
  );
}
