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
      <pre
        className={`max-h-[350px] overflow-x-auto bg-[#F8F8F8] dark:bg-[#161616] p-4 text-sm ${className}`}
      >
        <code>{code}</code>
      </pre>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className={`relative ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={isDark ? vscDarkPlus : vs}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          maxHeight: "350px",
          overflow: "auto",
          background: isDark ? "#161616" : "#F8F8F8",
          border: "0px",
          borderRadius: "8px 8px",
        }}
        codeTagProps={{
          style: {
            fontSize: "0.875rem",
            fontFamily:
              "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
