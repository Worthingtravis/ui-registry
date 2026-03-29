"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useCopy } from "@/registry/new-york/use-copy/use-copy";
import { CodeHighlight } from "@/components/code-highlight";
import type { PreviewLabConfig } from "@/lib/types";

// ---------------------------------------------------------------------------
// CopyButton — used by InstallTabs (dark-bg context)
// ---------------------------------------------------------------------------

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, copy] = useCopy();
  return (
    <button
      onClick={() => copy(text)}
      className={cn(
        "p-1.5 rounded-md bg-term-bg-muted hover:bg-term-bg-header text-term-text-muted hover:text-term-text transition-colors",
        className,
      )}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Install tabs
// ---------------------------------------------------------------------------

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

function InstallTabs({ baseCommand }: { baseCommand: string }) {
  const [pm, setPm] = useState<(typeof PACKAGE_MANAGERS)[number]>("pnpm");

  const suffix = baseCommand.replace(/^npx shadcn@latest add /, "");
  const command = useMemo(() => {
    switch (pm) {
      case "pnpm": return `pnpm dlx shadcn@latest add ${suffix}`;
      case "npm": return baseCommand;
      case "yarn": return `npx shadcn@latest add ${suffix}`;
      case "bun": return `bunx --bun shadcn@latest add ${suffix}`;
    }
  }, [pm, baseCommand, suffix]);

  return (
    <div className="rounded-lg border border-border/40 bg-code-bg overflow-hidden">
      <div className="flex items-center border-b border-border/30">
        <div className="flex items-center gap-0 px-1">
          {PACKAGE_MANAGERS.map((p) => (
            <button
              key={p}
              onClick={() => setPm(p)}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-colors rounded-t",
                pm === p
                  ? "text-code-text bg-term-bg-header"
                  : "text-term-text-muted hover:text-code-text",
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <CopyButton text={command} className="ml-auto mr-2" />
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-code-text">
        <code>{command}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tags to hide from consumers (internal dev categories)
// ---------------------------------------------------------------------------

const INTERNAL_TAGS = new Set(["primitive", "composed"]);

// ---------------------------------------------------------------------------
// PreviewLab
// ---------------------------------------------------------------------------

const TABS = ["preview", "source", "data", "props"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  preview: "Preview",
  source: "Source",
  data: "Data",
  props: "Props",
};

interface PreviewLabComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: PreviewLabConfig<any>;
  installCommand: string;
}

export function PreviewLab({ config, installCommand }: PreviewLabComponentProps) {
  const {
    title, description, tags, fixtures, render, variants,
    sourceCode, fixtureCode, propsMeta,
  } = config;

  const fixtureKeys = useMemo(() => Object.keys(fixtures), [fixtures]);
  const [fixtureIndex, setFixtureIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("preview");

  const activeFixtureKey = fixtureKeys[fixtureIndex] ?? fixtureKeys[0];
  const activeFixture = activeFixtureKey ? fixtures[activeFixtureKey] : undefined;
  const fixtureJson = useMemo(() => JSON.stringify(activeFixture, null, 2), [activeFixture]);

  const visibleTags = useMemo(
    () => tags?.filter((t) => !INTERNAL_TAGS.has(t)) ?? [],
    [tags],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setFixtureIndex((i) => (i > 0 ? i - 1 : fixtureKeys.length - 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setFixtureIndex((i) => (i < fixtureKeys.length - 1 ? i + 1 : 0));
          break;
        case "ArrowLeft":
          if (variants && variants.length > 1) {
            e.preventDefault();
            setVariantIndex((i) => (i > 0 ? i - 1 : variants.length - 1));
          }
          break;
        case "ArrowRight":
          if (variants && variants.length > 1) {
            e.preventDefault();
            setVariantIndex((i) => (i < variants.length - 1 ? i + 1 : 0));
          }
          break;
      }
    },
    [fixtureKeys.length, variants],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activeVariant =
    variants && variants.length > 0 && variantIndex < variants.length
      ? variants[variantIndex]!.component
      : undefined;

  const availableTabs = useMemo(() =>
    TABS.filter((tab) => {
      if (tab === "preview") return true;
      if (tab === "source") return !!sourceCode;
      if (tab === "data") return true;
      if (tab === "props") return propsMeta && propsMeta.length > 0;
      return false;
    }),
    [sourceCode, propsMeta],
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-base text-muted-foreground max-w-2xl">{description}</p>
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {visibleTags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Install — first thing users want */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Installation</h2>
        <InstallTabs baseCommand={installCommand} />
      </div>

      {/* Variants */}
      {variants && variants.length > 1 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Variants</h2>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={v.name}
                onClick={() => setVariantIndex(i)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
                  i === variantIndex
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:bg-muted/60 hover:border-border",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
          {variants[variantIndex]?.description && (
            <p className="text-xs text-muted-foreground">{variants[variantIndex].description}</p>
          )}
        </div>
      )}

      {/* Examples selector */}
      {fixtureKeys.length > 1 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Examples</h2>
          <div className="flex flex-wrap gap-1.5">
            {fixtureKeys.map((key, i) => (
              <button
                key={key}
                onClick={() => setFixtureIndex(i)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all border",
                  i === fixtureIndex
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:bg-muted/60",
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabbed content */}
      <div className="space-y-0">
        <div className="flex items-center border-b border-border">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground/80 hover:text-foreground",
              )}
            >
              {TAB_LABELS[tab]}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "preview" && activeFixture !== undefined && (
          <div className="rounded-b-lg border border-t-0 border-border bg-background p-4 sm:p-6 min-h-[100px]">
            <div className="w-full" key={`${fixtureIndex}-${variantIndex}`}>
              {render(activeFixture, activeVariant)}
            </div>
          </div>
        )}

        {activeTab === "source" && sourceCode && (
          <div className="border border-t-0 border-border rounded-b-lg overflow-hidden">
            <CodeHighlight code={sourceCode} language="tsx" />
          </div>
        )}

        {activeTab === "data" && (
          <div className="border border-t-0 border-border rounded-b-lg overflow-hidden space-y-0">
            <CodeHighlight
              code={fixtureJson}
              language="json"
              label={activeFixtureKey}
              className="rounded-none border-0 border-b border-code-border/30 max-h-[400px] overflow-y-auto"
            />
            {fixtureCode && (
              <CodeHighlight code={fixtureCode} language="tsx" label="All examples" className="rounded-none border-0" />
            )}
          </div>
        )}

        {activeTab === "props" && propsMeta && propsMeta.length > 0 && (
          <div className="border border-t-0 border-border rounded-b-lg bg-code-bg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/20 text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Prop</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Default</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {propsMeta.map((prop) => (
                    <tr key={prop.name} className="border-b border-border/10">
                      <td className="px-4 py-2.5">
                        <code className="font-mono text-primary text-xs">{prop.name}</code>
                        {prop.required && <span className="text-destructive ml-1">*</span>}
                        {prop.description && (
                          <p className="text-muted-foreground mt-0.5 text-[11px]">{prop.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground text-xs">{prop.type}</td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground text-xs">{prop.defaultValue ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* All examples gallery */}
      {fixtureKeys.length > 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Examples</h2>
          <div className="space-y-4">
            {fixtureKeys.map((key) => (
              <div key={key} className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">{key}</span>
                <div className="rounded-lg border border-border bg-background p-6">
                  {render(fixtures[key], activeVariant)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
