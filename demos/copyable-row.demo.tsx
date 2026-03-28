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
    <div className="space-y-1 rounded-lg terminal bg-term-bg p-4 font-mono text-[13px] text-term-text">
      {fixture.label && (
        <p className="text-xs text-term-text-muted mb-3">{fixture.label}</p>
      )}
      {fixture.rows.map((row, i) => (
        <CopyableRow key={i} text={row.text}>
          {row.prefix && (
            <span className={row.prefixColor ?? "text-term-text-muted"}>{row.prefix}</span>
          )}{" "}
          <span className={row.displayColor}>{row.display}</span>
        </CopyableRow>
      ))}
    </div>
  ),
  propsMeta,
  fixtureCode: `export interface CopyableRowFixture {
  label: string;
  rows: Array<{
    text: string;
    prefix?: string;
    prefixColor?: string;
    display: string;
    displayColor?: string;
  }>;
}

const BASE: CopyableRowFixture = {
  label: "Terminal commands",
  rows: [
    { text: "npx shadcn@latest add step-flow", prefix: "$", prefixColor: "text-green-400", display: "npx shadcn@latest add step-flow" },
    { text: "pnpm add lucide-react", prefix: "$", prefixColor: "text-green-400", display: "pnpm add lucide-react" },
  ],
};

const fx = (o: Partial<CopyableRowFixture>) => ({ ...BASE, ...o });

export const ALL_FIXTURES: Record<string, CopyableRowFixture> = {
  "Commands": BASE,
  "Key-Value pairs": fx({ label: "Configuration", rows: [...] }),
  "Single row": fx({ label: "Single item", rows: [{ text: "npm install", ... }] }),
};`,
  sourceCode: `export interface CopyableRowProps {
  text: string;        // Text to copy to clipboard on click
  children: ReactNode; // Row content
  className?: string;
  style?: CSSProperties;
}

export function CopyableRow({ text, children, className, style }: CopyableRowProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy}
      className="group/copy flex w-full items-start gap-1 rounded-md px-1.5 py-0.5 hover:bg-white/5"
      style={style}>
      {children}
      <span className="ml-auto opacity-0 group-hover/copy:opacity-100">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
    </button>
  );
}`,
};
