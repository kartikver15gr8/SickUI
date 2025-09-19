"use client";

import { useState } from "react";
import { Button } from "@sickui/core";
import { Copy, Check } from "lucide-react";
import { CodeHighlighter } from "./syntax-highlighter";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
}

export function CodeBlock({
  code,
  language = "bash",
  title,
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden rounded-lg border text-xs sm:text-sm dark:border-[#2E2E2E]">
      {title && (
        <div className="bg-muted flex items-center justify-between rounded-t-lg border-b px-3 py-2 sm:px-4">
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}
      <div className="relative w-full overflow-hidden">
        <div className="w-full overflow-hidden rounded-b-lg">
          <CodeHighlighter code={code} language={language} className="w-full" />
        </div>
        {showCopy && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0 text-slate-400 hover:text-black sm:right-2 sm:top-2 sm:h-8 sm:w-8 dark:hover:text-white"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
