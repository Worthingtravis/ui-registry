import type { ToolCallBlockProps } from "@/registry/new-york/tool-call-block/tool-call-block";

export type ToolCallBlockFixture = Omit<ToolCallBlockProps, "delay">;
type Fixture = ToolCallBlockFixture;

const BASE: Fixture = {
  toolName: "read_file",
  args: { path: "src/auth/middleware.ts" },
  result: "234 lines read",
};

const fx = (overrides: Partial<Fixture>): Fixture => ({ ...BASE, ...overrides });

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Single arg": BASE,
  "Multiple args": fx({
    toolName: "deploy",
    args: { target: "production", region: "us-east-1", force: true },
    result: "Deployed to https://app.example.com",
  }),
  "Array arg": fx({
    toolName: "run_tests",
    args: { suites: ["unit", "integration", "e2e"], parallel: true },
    result: "142 tests passed",
  }),
};
