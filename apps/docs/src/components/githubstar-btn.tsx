"use client";
import { useTheme } from "next-themes";
import SVGIcon from "../lib/svg-icon";
import { RAW_ICONS } from "../lib/icons";

export default function GitHubStarBtn() {
  const { theme } = useTheme();

  return (
    <a
      href="https://github.com/kartikver15gr8/SickUI"
      target="_blank"
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-[#F0F0F0] dark:hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
    >
      {theme === "light" ? (
        <SVGIcon
          className="flex h-6 w-6"
          svgString={RAW_ICONS.GitHubIconLight}
        />
      ) : (
        <SVGIcon
          className="flex h-6 w-6"
          svgString={RAW_ICONS.GitHubIconDark}
        />
      )}
    </a>
  );
}
