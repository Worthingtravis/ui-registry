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
    { text: "npx shadcn@latest add step-flow", prefix: "$", prefixColor: "text-term-success", display: "npx shadcn@latest add step-flow" },
    { text: "pnpm add lucide-react", prefix: "$", prefixColor: "text-term-success", display: "pnpm add lucide-react" },
    { text: "npm run dev", prefix: "$", prefixColor: "text-term-success", display: "npm run dev" },
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
      { text: "sk-proj-abc123...", prefix: "API Key:", prefixColor: "text-term-text-muted", display: "sk-proj-abc123...", displayColor: "text-term-warning" },
      { text: "https://api.example.com/v2", prefix: "Endpoint:", prefixColor: "text-term-text-muted", display: "https://api.example.com/v2", displayColor: "text-term-accent" },
    ],
  }),
  "Single row": fx({
    label: "Single item",
    rows: [
      { text: "npm install", prefix: "$", prefixColor: "text-term-success", display: "npm install" },
    ],
  }),
};
