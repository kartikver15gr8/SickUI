"use client";

import { useState } from "react";
import { Button } from "@sickui/core";
import { Copy, Check, Eye, Code } from "lucide-react";
import { cn } from "@sickui/core";
import { CodeHighlighter } from "./syntax-highlighter";

interface ComponentPreviewProps {
  name: string;
  children: React.ReactNode;
  code: string;
  className?: string;
}

export function ComponentPreview({
  name: _name,
  children,
  code,
  className,
}: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
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
    <div className="relative my-4 flex w-full max-w-full flex-col space-y-2">
      {/* Tabs Header */}
      <div className="flex items-center justify-between">
        <div className="bg-muted flex items-center space-x-1 rounded-md p-1">
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:px-3 sm:text-sm",
              activeTab === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Eye className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:px-3 sm:text-sm",
              activeTab === "code"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Code className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Code
          </button>
        </div>

        {/* Copy Button - only show on code tab */}
        {activeTab === "code" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 sm:h-8 sm:w-8"
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

      {/* Content */}
      <div className="w-full max-w-full overflow-hidden rounded-md border">
        {activeTab === "preview" ? (
          <div
            className={cn(
              "flex min-h-[250px] items-center justify-center p-4 sm:min-h-[350px] sm:p-10",
              className
            )}
          >
            {children}
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <CodeHighlighter code={code} language="tsx" className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
