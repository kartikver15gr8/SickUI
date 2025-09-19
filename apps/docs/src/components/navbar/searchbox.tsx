"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const BORDER_COLORS = {
  parentBoxBorder: "border border[#d5d5d5] dark:border-[#212121]",
  searchBoxBorder: "border border-[#D5D5D5] dark:border-[#2D2D2D]",
  searchBoxBg: "bg-[#f0f0f0c4] dark:bg-[#0F0F0F]",
  searchResultParentBorder:
    "border-[2px] border-[#D5D5D5] dark:border-[#2D2D2D]",
  searchResultOptionBg: "hover:bg-[#F4F4F4] dark:hover:bg-[#1b1b1b]",
};

const SearchOptionList = [
  { href: "/docs/installation", title: "Installation" },
  { href: "/docs/components", title: "Components" },
  { href: "/docs/cli", title: "CLI" },
];

const SearchOptionComponentList = [
  { href: "/docs/components/button", title: "Button" },
];

export default function SearchBox() {
  const [searchKey, setSearchKey] = useState("");

  const searchKeyArray = SearchOptionList.filter((key) =>
    key.title.toLowerCase().includes(searchKey)
  );

  const searchKeyCompArray = SearchOptionComponentList.filter((key) =>
    key.title.toLowerCase().includes(searchKey)
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, filter: "blur(12px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(12px)" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div
          className={`max-h-[50%] w-full max-w-xl rounded-2xl ${BORDER_COLORS.parentBoxBorder} bg-background p-2 shadow-xl`}
        >
          <input
            className={`h-12 w-full rounded-xl border-4 p-2 outline-none ${BORDER_COLORS.searchBoxBorder} ${BORDER_COLORS.searchBoxBg} xl:text-lg`}
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <div
            className={`scrollbar-hide h-52 overflow-y-auto ${BORDER_COLORS.searchResultParentBorder} mt-2 rounded-[12px]`}
          >
            <span className={`mt-2 flex pl-2 text-sm text-[#787879]`}>
              Explore pages
            </span>
            {searchKeyArray.map((elem, key) => {
              return (
                <SearchOption key={key} href={elem.href} title={elem.title} />
              );
            })}
            <span className={`mt-2 flex pl-2 text-sm text-[#787879]`}>
              Components
            </span>
            {searchKeyCompArray.map((elem, key) => {
              return (
                <SearchOption key={key} href={elem.href} title={elem.title} />
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SearchOption({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href ? href : ""}
      className={`flex items-center justify-between rounded-lg p-2 ${BORDER_COLORS.searchResultOptionBg}`}
    >
      <p>{title}</p>
    </Link>
  );
}
