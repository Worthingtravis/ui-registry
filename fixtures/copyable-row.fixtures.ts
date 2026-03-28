/** Fixture shape for CopyableRow demos — describes a list of rows to render */
export interface CopyableRowFixture {
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
    { text: "npm run dev", prefix: "$", prefixColor: "text-green-400", display: "npm run dev" },
  ],
};

const fx = (overrides: Partial<CopyableRowFixture>): CopyableRowFixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, CopyableRowFixture> = {
  "Commands": BASE,
  "Key-Value pairs": fx({
    label: "Configuration",
    rows: [
      { text: "sk-proj-abc123...", prefix: "API Key:", prefixColor: "text-zinc-500", display: "sk-proj-abc123...", displayColor: "text-amber-400" },
      { text: "https://api.example.com/v2", prefix: "Endpoint:", prefixColor: "text-zinc-500", display: "https://api.example.com/v2", displayColor: "text-cyan-400" },
    ],
  }),
  "Single row": fx({
    label: "Single item",
    rows: [
      { text: "npm install", prefix: "$", prefixColor: "text-green-400", display: "npm install" },
    ],
  }),
};
