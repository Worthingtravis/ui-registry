import type { TerminalDemoProps } from "@/registry/terminal-demo";

const BASE: TerminalDemoProps = {
  mcpEndpoint: "https://your-app.vercel.app/api/mcp",
};

const fx = (overrides: Partial<TerminalDemoProps>): TerminalDemoProps => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, TerminalDemoProps> = {
  "Default script": BASE,
  "Custom endpoint": fx({
    mcpEndpoint: "https://twitch-mcp.example.com/api/mcp",
  }),
};
