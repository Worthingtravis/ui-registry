"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyableRow } from "@/registry/new-york/copyable-row/copyable-row";
import { TerminalChrome } from "@/registry/new-york/terminal-chrome/terminal-chrome";
import { useCopy } from "@/registry/new-york/use-copy/use-copy";
import { REGISTRY, installCommand } from "@/lib/registry";

const NAMESPACE_CONFIG = `{
  "registries": {
    "@worthingtravis": {
      "url": "https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r"
    }
  }
}`;

const AI_PROMPT = `Install the @worthingtravis/ui-registry components into this project.

Step 1: Add the registry namespace to components.json (merge with existing registries if present):
${NAMESPACE_CONFIG}

Step 2: Run these commands:
${REGISTRY.map((e) => `npx shadcn@latest add @worthingtravis/${e.name}`).join("\n")}

These are animated terminal UI components built with Tailwind CSS. After installing, import from @/registry/new-york/{name}/{name}. See https://github.com/Worthingtravis/ui-registry for docs.`;

export function InstallSection() {
  const [mode, setMode] = useState<"namespace" | "direct">("namespace");
  const [aiCopied, copyAi] = useCopy();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Installation</h2>
        <button
          onClick={() => copyAi(AI_PROMPT)}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all border",
            aiCopied
              ? "bg-term-success/10 border-term-success/30 text-term-success"
              : "bg-transparent text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground",
          )}
        >
          {aiCopied ? <Check className="size-3" /> : <Sparkles className="size-3" />}
          {aiCopied ? "Copied for AI" : "Copy for AI"}
        </button>
      </div>

      <div className="flex gap-2">
        {(["namespace", "direct"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-all border",
              mode === m
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:bg-muted/60",
            )}
          >
            {m === "namespace" ? "Namespace" : "Direct URL"}
          </button>
        ))}
      </div>

      {mode === "namespace" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Add to your <code className="text-primary">components.json</code>:
          </p>
          <TerminalChrome title="components.json">
            <CopyableRow text={NAMESPACE_CONFIG}>
              <pre className="text-term-text-bright text-[12px] whitespace-pre">{NAMESPACE_CONFIG}</pre>
            </CopyableRow>
          </TerminalChrome>

          <p className="text-sm text-muted-foreground">Then install by name:</p>
          <TerminalChrome title="terminal">
            <div className="space-y-0.5">
              {REGISTRY.map((e) => (
                <CopyableRow key={e.name} text={`npx shadcn@latest add @worthingtravis/${e.name}`}>
                  <span className="text-term-success shrink-0 select-none">$</span>{" "}
                  <span className="text-term-text-bright">npx shadcn@latest add @worthingtravis/{e.name}</span>
                </CopyableRow>
              ))}
            </div>
          </TerminalChrome>
        </div>
      )}

      {mode === "direct" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Install everything:</p>
          <TerminalChrome title="terminal">
            <div className="space-y-0.5">
              {REGISTRY.map((e) => (
                <CopyableRow key={e.name} text={installCommand(e.name)}>
                  <span className="text-term-success shrink-0 select-none">$</span>{" "}
                  <span className="text-term-text-bright">{installCommand(e.name)}</span>
                </CopyableRow>
              ))}
            </div>
          </TerminalChrome>

          <p className="text-sm text-muted-foreground">Or pick one:</p>
          <TerminalChrome title="terminal">
            <CopyableRow text={installCommand("terminal-demo")}>
              <span className="text-term-success shrink-0 select-none">$</span>{" "}
              <span className="text-term-text-bright">{installCommand("terminal-demo")}</span>
            </CopyableRow>
          </TerminalChrome>
        </div>
      )}
    </div>
  );
}
