"use client";

import { useEffect, useState, type ComponentType } from "react";
import { getEntry } from "@/lib/registry-config";

/**
 * Client component that dynamically imports the demo for a given registry name.
 * This keeps the preview page a Server Component while the demo renders client-side.
 */
export function PreviewClient({ name }: { name: string }) {
  const [Demo, setDemo] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const entry = getEntry(name);
    if (!entry) {
      setError(`No demo found for "${name}"`);
      return;
    }
    entry.demo()
      .then((mod) => setDemo(() => mod.default))
      .catch(() => setError(`Failed to load demo for "${name}"`));
  }, [name]);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!Demo) {
    return <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>;
  }

  return <Demo />;
}
