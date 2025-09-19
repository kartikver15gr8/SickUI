"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CodeHighlighterProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeHighlighter({
  code,
  language = "tsx",
  className = "",
  showLineNumbers = false,
}: CodeHighlighterProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with similar styling to avoid hydration mismatch
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <pre className="max-h-[350px] w-full overflow-x-auto bg-[#F8F8F8] p-3 text-xs sm:p-4 sm:text-sm dark:bg-[#161616]">
          <code className="block w-full whitespace-pre-wrap break-words sm:whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="w-full [&>pre]:!w-full [&>pre]:!max-w-full [&>pre]:!overflow-x-auto [&>pre]:!p-3 [&>pre]:!text-xs [&>pre]:!leading-tight sm:[&>pre]:!p-4 sm:[&>pre]:!text-sm sm:[&>pre]:!leading-normal [&_code]:!whitespace-pre-wrap [&_code]:!break-words sm:[&_code]:!whitespace-pre sm:[&_code]:!break-normal">
        <SyntaxHighlighter
          language={language}
          style={isDark ? vscDarkPlus : vs}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            maxHeight: "350px",
            background: isDark ? "#161616" : "#F8F8F8",
            border: "0px",
            borderRadius: "8px 8px",
            width: "100%",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
            },
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
