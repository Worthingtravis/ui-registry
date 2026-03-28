"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCopy } from "@/lib/use-copy";
import { Copy, Check } from "lucide-react";

interface CodeHighlightProps {
  code: string;
  language?: string;
  label?: string;
  className?: string;
}

export function CodeHighlight({ code, language = "tsx", label, className }: CodeHighlightProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, copy] = useCopy();

  useEffect(() => {
    import("shiki").then(({ codeToHtml }) => {
      codeToHtml(code, {
        lang: language,
        theme: "github-dark-default",
      }).then(setHtml);
    });
  }, [code, language]);

  return (
    <div className={cn("relative rounded-lg border border-code-border bg-code-bg overflow-hidden", className)}>
      {label && (
        <div className="flex items-center border-b border-code-border/60 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
      )}
      <button
        onClick={() => copy(code)}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-term-bg-header hover:bg-term-bg-muted text-term-text-muted hover:text-term-text transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      {html ? (
        <div
          className="p-4 overflow-x-auto text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-code-text">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
