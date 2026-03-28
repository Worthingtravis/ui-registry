"use client";

import { CopyableRow } from "@/registry/copyable-row";
import { ALL_FIXTURES, type CopyableRowFixture } from "@/fixtures/copyable-row.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "text", type: "string", required: true, description: "Text to copy to clipboard on click" },
  { name: "children", type: "ReactNode", required: true, description: "Row content" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
  { name: "style", type: "CSSProperties", required: false, description: "Inline styles" },
];

export const config: PreviewLabConfig<CopyableRowFixture> = {
  title: "Copyable Row",
  description: "Click-to-copy wrapper with hover highlight and copy/check icon transition.",
  tags: ["interactive", "clipboard", "copy"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-1 rounded-lg bg-zinc-900 p-4 font-mono text-[13px] text-zinc-300">
      {fixture.label && (
        <p className="text-xs text-zinc-500 mb-3">{fixture.label}</p>
      )}
      {fixture.rows.map((row, i) => (
        <CopyableRow key={i} text={row.text}>
          {row.prefix && (
            <span className={row.prefixColor ?? "text-zinc-500"}>{row.prefix}</span>
          )}{" "}
          <span className={row.displayColor}>{row.display}</span>
        </CopyableRow>
      ))}
    </div>
  ),
  propsMeta,
};
