import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { REGISTRY, getEntry } from "@/lib/registry-config";
import { PreviewClient } from "./preview-client";

/** Generate static params for all registry entries. */
export function generateStaticParams() {
  return REGISTRY.map((entry) => ({ name: entry.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const entry = getEntry(name);
  if (!entry) return {};
  return {
    title: `${entry.title} — UI Registry`,
    description: entry.description,
  };
}

export default async function PreviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const entry = getEntry(name);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-10">
      {/* Back link */}
      <Link
        href="/"
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; All Components
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{entry.title}</h1>
        <p className="text-sm text-muted-foreground">{entry.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Install command */}
      <div className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Install</span>
        <pre className="text-xs font-mono bg-muted/30 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
          {entry.installCommand}
        </pre>
      </div>

      {/* Live preview */}
      <div className="space-y-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Preview</span>
        <div className="rounded-xl border border-border/40 bg-card/20 p-6">
          <Suspense fallback={<div className="text-sm text-muted-foreground animate-pulse">Loading preview...</div>}>
            <PreviewClient name={name} />
          </Suspense>
        </div>
      </div>

      {/* Source link */}
      <div className="pt-8 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
        <a
          href={`https://github.com/Worthingtravis/ui-registry/blob/main/registry/${name}.tsx`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          View source on GitHub &rarr;
        </a>
        <Link href="/" className="hover:text-foreground transition-colors">
          All Components
        </Link>
      </div>
    </div>
  );
}
