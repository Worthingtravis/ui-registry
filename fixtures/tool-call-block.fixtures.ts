import type { ToolCallBlockProps } from "@/registry/new-york/tool-call-block/tool-call-block";

export type ToolCallBlockFixture = Omit<ToolCallBlockProps, "delay">;
type Fixture = ToolCallBlockFixture;

const BASE: Fixture = {
  toolName: "search_docs",
  args: { query: "button variants", limit: 5 },
  result: "Found 3 matching components",
};

const fx = (overrides: Partial<Fixture>): Fixture => ({ ...BASE, ...overrides });

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Search docs": BASE,
  "Read file": fx({
    toolName: "read_file",
    args: { path: "registry/step-flow.tsx" },
    result: "148 lines read",
  }),
  "Write file": fx({
    toolName: "write_file",
    args: { path: "components/ui/card.tsx", lines: 42 },
    result: "File written successfully",
  }),
  "Deploy": fx({
    toolName: "deploy",
    args: { target: "production", region: "us-east-1", force: true },
    result: "Deployed to https://app.example.com",
  }),
  "Many args": fx({
    toolName: "create_poll",
    args: {
      title: "What game should I play next?",
      choices: ["Elden Ring", "Minecraft", "Viewer's Choice"],
      duration: 60,
    },
    result: "Poll created — 60s, 3 choices",
  }),
};
