import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { REGISTRY, getEntry } from "@/lib/registry";
import { PreviewClient } from "./preview-client";

export function generateStaticParams() {
  return REGISTRY.map((entry) => ({ name: entry.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const entry = getEntry(name);
  if (!entry) return {};
  return { title: `${name} — UI Registry` };
}

export default async function PreviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!getEntry(name)) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <Link
        href="/"
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; All Components
      </Link>

      <Suspense fallback={<div className="text-sm text-muted-foreground animate-pulse">Loading...</div>}>
        <PreviewClient name={name} />
      </Suspense>

      <div className="pt-8 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
        <a
          href={`https://github.com/Worthingtravis/ui-registry/blob/main/registry/${name}.tsx`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          View source &rarr;
        </a>
        <Link href="/" className="hover:text-foreground transition-colors">
          All Components
        </Link>
      </div>
    </div>
  );
}
