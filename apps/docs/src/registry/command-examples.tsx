"use client";
import { RAW_ICONS } from "@/lib/icons";
import SVGIcon from "@/lib/svg-icon";
import { useState } from "react";

const inactive = "h-7 rounded-lg px-2 text-sm";
const active = "h-7 rounded-lg px-2 text-sm bg-accent border";

export function CodeCopyPaste() {
  const [packageManager, setPackageManager] = useState<"pnpm" | "npm" | "yarn">(
    "pnpm"
  );

  return (
    <div className="flex h-20 w-full flex-col rounded-xl border">
      <div className="flex h-10 w-full items-center border-b">
        <div className="flex w-full items-center justify-between px-2 md:px-3">
          <div className="flex items-center gap-x-1 md:gap-x-2">
            <SVGIcon className="flex w-4" svgString={RAW_ICONS.Terminal} />
            <button
              onClick={() => setPackageManager("pnpm")}
              className={packageManager === "pnpm" ? active : inactive}
            >
              pnpm
            </button>
            <button
              onClick={() => setPackageManager("npm")}
              className={packageManager === "npm" ? active : inactive}
            >
              npm
            </button>
            <button
              onClick={() => setPackageManager("yarn")}
              className={packageManager === "yarn" ? active : inactive}
            >
              yarn
            </button>
          </div>
          <button className="flex h-7 w-8 items-center justify-center rounded-xl border">
            <SVGIcon className="flex w-4" svgString={RAW_ICONS.Copy} />
          </button>
        </div>
      </div>
      <div className="flex h-10 w-full items-center px-2 md:px-3">
        <p className="font-mono text-xs font-extralight md:text-sm">
          {`${packageManager} install @sickui/cli@latest add button`}
        </p>
      </div>
    </div>
  );
}
