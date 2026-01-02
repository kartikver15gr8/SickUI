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
import { motion } from "framer-motion";

const navigation = [
  { name: "Docs", href: "/docs/installation" },
  { name: "Components", href: "/docs/components" },
  { name: "CLI", href: "/docs/cli" },
];

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const wrapperVariants = {
  open: {
    scaleY: 1,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const COLORS = {
  headerBorder: "border border-[#d5d5d5] dark:border-[#212121]",
  searchBg: "bg-[#f0f0f0] dark:bg-[#1e1e1e58]",
  searchBorder: "border border-[#9CA3AF] dark:border-[#2d2d2d]",
  buttonBorder: "border border-[#9CA3AF] dark:border-[#4c5055]",
  textMuted: "text-[#98999B]",
  divider: "border-[#C6C9CF] dark:border-[#2D2D2D]",
  logoBorder: "dark:border-[#9493935a]",
} as const;

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileTabOpen, _setProfileTabOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="bg-background flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex w-full items-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 2xl:px-40">
        <div
          className={`my-2 flex h-[55px] w-full items-center justify-between rounded-xl px-2 ${COLORS.headerBorder} bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur`}
        >
          <div className="flex w-full justify-between md:justify-normal">
            <Link href="/" className="mr-5 flex items-center space-x-3">
              <Image
                className={`h-9 w-9 dark:border ${COLORS.logoBorder} rounded-lg`}
                src={"/logo/sickui-logo.png"}
                alt="SickUI Logo"
                width={200}
                height={200}
              />
              <span className="text-[15px] font-bold sm:inline-block sm:text-[12px] md:text-[14px] lg:text-[15px]">
                SickUI
              </span>
            </Link>
            <ul className="hidden items-center space-x-5 text-[12px] font-medium md:flex md:text-[14px] lg:text-[15px]">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`hover:text-foreground/80 transition-colors ${
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </ul>

            {/* Mobile menu button */}
            <div className="h-9 w-9 md:hidden">
              <button
                aria-label="Toggle menu"
                aria-expanded={profileTabOpen}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="group flex h-9 w-9 cursor-pointer flex-col items-center justify-center focus:outline-none"
                type="button"
              >
                <span
                  className={`block h-0.5 w-6 rounded bg-[#959292] transition-all duration-300 ${isOpen ? "translate-y-2 rotate-45" : ""} `}
                />
                <span
                  className={`my-1 block h-0.5 w-6 rounded bg-[#959292] transition-all duration-300 ${isOpen ? "opacity-0" : ""} `}
                />
                <span
                  className={`block h-0.5 w-6 rounded bg-[#959292] transition-all duration-300 ${isOpen ? "-translate-y-2 -rotate-45" : ""} `}
                />
              </button>
            </div>
          </div>

          {/* Search box with github and theme toggle buttons */}
          <div className="hidden items-start gap-x-2 md:flex">
            {/* Search field + buttons wrapper */}
            <SearchField
              searchBoxActive={searchBoxActive}
              setSearchBoxActive={setSearchBoxActive}
            />
            {/* Whatever comes next */}
            <div className="flex items-center">
              <GitHubStarBtn />
              <span
                className={`h-5 rounded-full border-[0.4px] ${COLORS.divider}`}
              ></span>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {isOpen && (
        <MobileNav
          isOpen={isOpen}
          searchBoxActive={searchBoxActive}
          setSearchBoxActive={setSearchBoxActive}
        />
      )}

      {/* {searchBoxActive && <SearchBox />} */}
      {searchBoxActive && (
        <SearchBox closeButtonHandler={() => setSearchBoxActive(false)} />
      )}

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

function MobileNav({
  isOpen,
  searchBoxActive,
  setSearchBoxActive,
}: {
  isOpen: boolean;
  searchBoxActive: boolean;
  setSearchBoxActive: (val: boolean) => void;
}) {
  return (
    <div className="fixed z-50 mt-[70px] w-full rounded px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 2xl:px-40">
      <motion.div
        className="bg-background/95 supports-[backdrop-filter]:bg-background/60 relative z-50 w-full rounded-lg shadow-lg backdrop-blur"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={wrapperVariants}
      >
        <div className="flex flex-col rounded-lg border border-[#9DA3AF] font-medium shadow-[inset_5px_2px_30px_rgba(0,0,0,0.1)] dark:border-[#2D2D2D]">
          {navigation.map((elem, key) => {
            return (
              <motion.div
                variants={itemVariants}
                className={`flex h-12 items-center border-b border-[#9DA3AF] dark:border-[#2D2D2D]`}
                key={key}
              >
                <Link
                  className="flex h-full w-full items-center p-2"
                  href={elem.href}
                >
                  {elem.name}
                </Link>
              </motion.div>
            );
          })}
          <motion.div
            variants={itemVariants}
            className={`flex h-12 items-center gap-x-1 p-2`}
          >
            <SearchField
              searchBoxActive={searchBoxActive}
              setSearchBoxActive={setSearchBoxActive}
            />
            <div className="flex items-center">
              <GitHubStarBtn />
              <span
                className={`h-5 rounded-full border-[0.4px] ${COLORS.divider}`}
              ></span>

              <ThemeToggle />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function SearchField({
  searchBoxActive,
  setSearchBoxActive,
}: {
  searchBoxActive: boolean;
  setSearchBoxActive: (val: boolean) => void;
}) {
  return (
    <div
      onClick={() => setSearchBoxActive(true)}
      className={`relative ${COLORS.searchBg} flex h-9 w-full items-center rounded-xl hover:cursor-pointer md:w-60 lg:w-72 ${COLORS.searchBorder} px-2`}
    >
      <span
        className={`${COLORS.textMuted} text-[12px] md:text-[14px] lg:text-[15px]`}
      >
        Search
      </span>

      {/* Button cluster – absolute-positioned in the top-right */}
      <div className="absolute right-2 top-0 flex h-full items-center gap-x-1">
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
  );
}
