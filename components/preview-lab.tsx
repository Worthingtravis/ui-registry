"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import type { PreviewLabConfig } from "@/lib/types";

// ---------------------------------------------------------------------------
// Shared sub-components (exported for reuse)
// ---------------------------------------------------------------------------

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative rounded-lg border border-border/40 bg-zinc-950 overflow-hidden">
      {label && (
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
      )}
      <CopyButton text={code} className="absolute top-3 right-3" />
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab types
// ---------------------------------------------------------------------------

const TABS = ["preview", "code", "fixtures", "props"] as const;
type Tab = (typeof TABS)[number];

// ---------------------------------------------------------------------------
// PreviewLab
// ---------------------------------------------------------------------------

interface PreviewLabComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: PreviewLabConfig<any>;
  installCommand: string;
}

export function PreviewLab({ config, installCommand }: PreviewLabComponentProps) {
  const {
    title,
    description,
    tags,
    fixtures,
    render,
    variants,
    sourceCode,
    fixtureCode,
    propsMeta,
  } = config;

  const fixtureKeys = Object.keys(fixtures);
  const [fixtureIndex, setFixtureIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("preview");

  const activeFixtureKey = fixtureKeys[fixtureIndex] ?? fixtureKeys[0];
  const activeFixture = activeFixtureKey ? fixtures[activeFixtureKey] : undefined;

  // Keyboard navigation: Up/Down = fixtures, Left/Right = variants
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

  // Active variant's render function
  const activeRender =
    variants && variants.length > 0 && variantIndex < variants.length
      ? (fixture: unknown) => {
          const Comp = variants[variantIndex]!.component;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return <Comp {...(fixture as any)} />;
        }
      : render;

  // Available tabs (only show tabs that have content)
  const availableTabs = TABS.filter((tab) => {
    if (tab === "preview") return true;
    if (tab === "code") return !!sourceCode;
    if (tab === "fixtures") return !!fixtureCode;
    if (tab === "props") return propsMeta && propsMeta.length > 0;
    return false;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Install */}
      <CodeBlock code={installCommand} label="Install" />

      {/* Variant selector */}
      {variants && variants.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Variants
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              (Left/Right arrows)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={v.name}
                onClick={() => setVariantIndex(i)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                  i === variantIndex
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60 hover:border-border",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
          {variants[variantIndex]?.description && (
            <p className="text-xs text-muted-foreground">
              {variants[variantIndex].description}
            </p>
          )}
        </div>
      )}

      {/* Fixture selector */}
      {fixtureKeys.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Fixtures
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              (Up/Down arrows)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {fixtureKeys.map((key, i) => (
              <button
                key={key}
                onClick={() => setFixtureIndex(i)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                  i === fixtureIndex
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60 hover:border-border",
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs: Preview / Code / Fixtures / Props */}
      <div className="space-y-3">
        <div className="flex items-center gap-1 border-b border-border/30 pb-px">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-t-lg -mb-px border-b-2",
                activeTab === tab
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "preview" && activeFixture !== undefined && (
          <div className="rounded-xl border border-border/40 bg-card/20 p-6 min-h-[120px]">
            {activeRender(activeFixture)}
          </div>
        )}

        {activeTab === "code" && sourceCode && (
          <CodeBlock code={sourceCode} />
        )}

        {activeTab === "fixtures" && fixtureCode && (
          <CodeBlock code={fixtureCode} label="Fixtures" />
        )}

        {activeTab === "props" && propsMeta && propsMeta.length > 0 && (
          <div className="rounded-xl border border-border/40 bg-zinc-950 overflow-hidden">
            <div className="border-b border-border/30 px-4 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Props</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/20 text-left">
                    <th className="px-4 py-2 font-semibold text-muted-foreground">Name</th>
                    <th className="px-4 py-2 font-semibold text-muted-foreground">Type</th>
                    <th className="px-4 py-2 font-semibold text-muted-foreground">Required</th>
                    <th className="px-4 py-2 font-semibold text-muted-foreground">Default</th>
                    <th className="px-4 py-2 font-semibold text-muted-foreground">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {propsMeta.map((prop) => (
                    <tr key={prop.name} className="border-b border-border/10">
                      <td className="px-4 py-2 font-mono text-primary">{prop.name}</td>
                      <td className="px-4 py-2 font-mono text-zinc-400">{prop.type}</td>
                      <td className="px-4 py-2">{prop.required ? "Yes" : "No"}</td>
                      <td className="px-4 py-2 font-mono text-zinc-500">{prop.defaultValue ?? "—"}</td>
                      <td className="px-4 py-2 text-muted-foreground">{prop.description ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* All fixtures matrix */}
      {fixtureKeys.length > 1 && (
        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            All Fixtures
          </span>
          <div className="space-y-6">
            {fixtureKeys.map((key) => (
              <div key={key} className="space-y-2">
                <span className="text-xs font-semibold">{key}</span>
                <div className="rounded-xl border border-border/40 bg-card/20 p-6">
                  {activeRender(fixtures[key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
