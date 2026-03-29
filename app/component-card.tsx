"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEntry } from "@/lib/registry";
import { kebabToTitle } from "@/lib/utils";
import type { PreviewLabConfig } from "@/lib/types";

export function ComponentCard({ name, description }: { name: string; description: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [config, setConfig] = useState<PreviewLabConfig<any> | null>(null);

  useEffect(() => {
    const entry = getEntry(name);
    if (!entry) return;
    entry.lab().then((mod) => setConfig(mod.config)).catch(() => {});
  }, [name]);

  const firstFixtureKey = config ? Object.keys(config.fixtures)[0] : null;
  const firstFixture = firstFixtureKey ? config!.fixtures[firstFixtureKey] : null;

  return (
    <Link
      href={`/preview/${name}`}
      className="group relative rounded-lg border border-border/50 bg-card overflow-hidden transition-all hover:border-border hover:shadow-md hover:shadow-primary/5"
    >
      {/* Live preview */}
      <div className="rounded-t-lg border-b border-border/30 bg-background p-3 min-h-[100px] max-h-[160px] overflow-hidden pointer-events-none select-none">
        <div className="scale-[0.65] origin-top-left w-[154%]">
          {config && firstFixture ? (
            config.render(firstFixture)
          ) : (
            <div className="flex items-center justify-center min-h-[80px]">
              <span className="text-xs text-muted-foreground/30 font-mono animate-pulse">Loading...</span>
            </div>
          )}
        </div>
      </div>
      {/* Label */}
      <div className="p-3 pt-2.5">
        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
          {kebabToTitle(name)}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}
