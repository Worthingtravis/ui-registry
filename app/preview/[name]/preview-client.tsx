"use client";

import { useEffect, useState } from "react";
import { getEntry, installCommand } from "@/lib/registry";
import type { PreviewLabConfig } from "@/lib/types";
import { PreviewLab } from "@/components/preview-lab";

interface PreviewClientProps {
  name: string;
  sourceCode: string | null;
  fixtureCode: string | null;
}

export function PreviewClient({ name, sourceCode, fixtureCode }: PreviewClientProps) {
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
      .then((mod) => {
        const config = { ...mod.config };
        // Server-loaded real source overrides handwritten stubs
        if (sourceCode) config.sourceCode = sourceCode;
        if (fixtureCode) config.fixtureCode = fixtureCode;
        setLabConfig(config);
      })
      .catch(() => setError(`Failed to load demo for "${name}"`));
  }, [name, sourceCode, fixtureCode]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!labConfig) return <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>;

  return <PreviewLab config={labConfig} installCommand={installCommand(name)} />;
}
