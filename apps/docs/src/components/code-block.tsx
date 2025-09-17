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
    <div className="relative rounded-lg border text-[12px] md:text-[14px] lg:text-[15px] dark:border-[#2E2E2E]">
      {title && (
        <div className="bg-muted flex items-center justify-between rounded-t-lg border-b px-4 py-2">
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}
      <div className="relative">
        <div className="overflow-hidden rounded-b-lg">
          <CodeHighlighter code={code} language={language} className="" />
        </div>
        {showCopy && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0 text-slate-400 hover:text-black dark:hover:text-white"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
