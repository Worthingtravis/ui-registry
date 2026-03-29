"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEntry } from "@/lib/registry";
import { kebabToTitle } from "@/lib/utils";
import type { PreviewLabConfig } from "@/lib/types";

export function ComponentCell({ name, description }: { name: string; description: string }) {
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
      className="group relative block overflow-hidden transition-colors hover:bg-muted/30"
    >
      {/* Live preview */}
      <div className="p-4 min-h-[120px] max-h-[180px] overflow-hidden pointer-events-none select-none">
        <div className="scale-[0.6] origin-top-left w-[167%]">
          {config && firstFixture ? (
            config.render(firstFixture)
          ) : (
            <div className="flex items-center justify-center min-h-[80px]">
              <span className="text-xs text-muted-foreground/20 font-mono animate-pulse">...</span>
            </div>
          )}
        </div>
      </div>
      {/* Label */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
          {kebabToTitle(name)}
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}
