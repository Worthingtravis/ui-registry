"use client";

import { useEffect, useState } from "react";
import { getEntry, installCommand } from "@/lib/registry";
import type { PreviewLabConfig } from "@/lib/types";
import { PreviewLab } from "@/components/preview-lab";

export function PreviewClient({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [labConfig, setLabConfig] = useState<PreviewLabConfig<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const entry = getEntry(name);
    if (!entry) {
      setError(`No component found for "${name}"`);
      return;
    }
    entry.lab()
      .then((mod) => setLabConfig(mod.config))
      .catch(() => setError(`Failed to load demo for "${name}"`));
  }, [name]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!labConfig) return <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>;

  return <PreviewLab config={labConfig} installCommand={installCommand(name)} />;
}
