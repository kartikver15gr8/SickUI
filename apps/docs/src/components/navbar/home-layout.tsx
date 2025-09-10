"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
import Image from "next/image";
import SVGIcon from "../../lib/svg-icon";
import { RAW_ICONS } from "../../lib/icons";
import { useEffect, useState } from "react";
import { useKeyboardShortcut } from "../../hooks/use-keyboard-shortcut";
import SearchBox from "./searchbox";
import GitHubStarBtn from "../githubstar-btn";

const navigation = [
  { name: "Docs", href: "/docs/installation" },
  { name: "Components", href: "/docs/components" },
  { name: "CLI", href: "/docs/cli" },
];

const COLORS = {
  headerBorder: "border border-[#9DA3AF] dark:border-[#2D2D2D]",
  searchBg: "bg-[#f0f0f0] dark:bg-[#1e1e1e58]",
  searchBorder: "border border-[#9CA3AF] dark:border-[#2d2d2d]",
  buttonBorder: "border border-[#9CA3AF] dark:border-[#4c5055]",
  textMuted: "text-[#9CA3AF]",
  divider: "border-[#C6C9CF] dark:border-[#2D2D2D]",
  logoBorder: "dark:border-[#9493935a]",
} as const;

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchBoxActive, setSearchBoxActive] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useKeyboardShortcut("k", "meta", () => setSearchBoxActive(true));
  useKeyboardShortcut("k", "ctrl", () => setSearchBoxActive(true));

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchBoxActive(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky flex items-center top-0 z-50 w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 2xl:px-40">
        <div
          className={`px-2 my-2 h-[55px] w-full rounded-xl flex items-center justify-between  ${COLORS.headerBorder} bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 `}
        >
          <div className="flex">
            <Link href="/" className="flex items-center space-x-3 mr-5">
              <Image
                className={`h-9 w-9 dark:border ${COLORS.logoBorder} rounded-lg`}
                src={"/logo/sickuilogo.png"}
                alt="SickUI Logo"
                width={200}
                height={200}
              />
              <span className="hidden font-bold sm:inline-block">SickUI</span>
            </Link>
            <ul className="flex items-center space-x-5 text-[15px] font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors hover:text-foreground/80 ${
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </ul>
          </div>

          {/* Search box with github and theme toggle buttons */}
          <div className="flex items-start gap-x-2">
            {/* Search field + buttons wrapper */}
            <div
              onClick={() => setSearchBoxActive(true)}
              className={`relative ${COLORS.searchBg} flex items-center h-9 w-72 hover:cursor-pointer rounded-xl ${COLORS.searchBorder} px-2`}
            >
              <span className={COLORS.textMuted}>Search</span>

              {/* Button cluster – absolute-positioned in the top-right */}
              <div className="absolute right-2 top-0 flex gap-x-1  items-center h-full">
                <button
                  className={`flex h-5 w-5 items-center justify-center rounded-md ${COLORS.buttonBorder}`}
                >
                  <SVGIcon className="flex" svgString={RAW_ICONS.CommandBtn} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents event from bubbling up
                    setSearchBoxActive(!searchBoxActive);
                  }}
                  className={`flex h-5 w-5 items-center justify-center rounded-md ${COLORS.buttonBorder} ${COLORS.textMuted}`}
                >
                  <span className="text-xs font-medium">k</span>
                </button>
              </div>
            </div>
            {/* Whatever comes next */}
            <div className="flex items-center">
              <GitHubStarBtn />
              <span
                className={`border-[0.4px] h-5 rounded-full ${COLORS.divider}`}
              ></span>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {searchBoxActive && <SearchBox />}

      <main className="flex-1">{children}</main>
    </div>
  );
}
