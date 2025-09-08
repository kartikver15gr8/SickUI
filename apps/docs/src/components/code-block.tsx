"use client";

import { useState } from "react";
import { Button } from "@sickui/core";
import { Copy, Check } from "lucide-react";

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
  showCopy = true 
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
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}
      <div className="relative">
        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
        {showCopy && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 text-slate-400 hover:text-slate-50"
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
