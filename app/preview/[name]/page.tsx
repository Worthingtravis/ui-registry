import { notFound } from "next/navigation";
import { Suspense } from "react";
import { REGISTRY, getEntry } from "@/lib/registry";
import { kebabToTitle } from "@/lib/utils";
import { PreviewClient } from "./preview-client";

export function generateStaticParams() {
  return REGISTRY.map((entry) => ({ name: entry.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const entry = getEntry(name);
  if (!entry) return {};
  return { title: `${kebabToTitle(name)} — UI Registry` };
}

export default async function PreviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const entry = getEntry(name);
  if (!entry) notFound();

  return (
    <div className="max-w-3xl px-6 lg:px-8 py-10">
      <Suspense fallback={<div className="text-sm text-muted-foreground animate-pulse">Loading preview...</div>}>
        <PreviewClient name={name} />
      </Suspense>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
        <a
          href={`https://github.com/Worthingtravis/ui-registry/blob/main/registry/${name}.tsx`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          View source on GitHub
        </a>
        <a
          href={`https://github.com/Worthingtravis/ui-registry/issues/new?title=Bug:+${name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Report an issue
        </a>
      </div>
    </div>
  );
}
