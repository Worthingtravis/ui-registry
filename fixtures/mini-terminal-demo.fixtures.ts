import type { DemoScenario } from "@/registry/mini-terminal-demo";

const BASE_SCENARIO: DemoScenario = {
  id: "install",
  title: "Install component",
  category: "setup",
  entries: [
    { kind: "input", text: "npx shadcn@latest add step-flow", prompt: ">", typingMs: 1000, pauseAfter: 400 },
    { kind: "output", text: "Installing step-flow...", color: "zinc", pauseAfter: 300 },
    { kind: "output", text: "Created registry/step-flow.tsx", color: "green", pauseAfter: 200 },
    { kind: "input", text: "pnpm dev", prompt: ">", typingMs: 400, pauseAfter: 300 },
    { kind: "output", text: "Ready on http://localhost:3000", color: "green", pauseAfter: 0 },
  ],
};

export interface MiniTerminalDemoFixture {
  scenario: DemoScenario;
  play: boolean;
  playDelay?: number;
}

const BASE: MiniTerminalDemoFixture = {
  scenario: BASE_SCENARIO,
  play: true,
  playDelay: 0,
};

const fx = (overrides: Partial<MiniTerminalDemoFixture>): MiniTerminalDemoFixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, MiniTerminalDemoFixture> = {
  "Install flow": BASE,
  "Deploy flow": fx({
    scenario: {
      id: "deploy",
      title: "Deploy to production",
      category: "deploy",
      entries: [
        { kind: "input", text: "vercel --prod", prompt: ">", typingMs: 600, pauseAfter: 400 },
        { kind: "output", text: "Building...", color: "zinc", pauseAfter: 300 },
        { kind: "output", text: "Deploying to production...", color: "zinc", pauseAfter: 400 },
        { kind: "output", text: "https://my-app.vercel.app", color: "green", pauseAfter: 0 },
      ],
    },
  }),
  "With tool call": fx({
    scenario: {
      id: "tool-call",
      title: "MCP tool call",
      category: "ai",
      entries: [
        { kind: "input", text: "add a poll: Elden Ring vs Minecraft", prompt: ">", typingMs: 1000, pauseAfter: 300 },
        { kind: "tool-call", toolName: "create_poll", args: { title: "What game?", choices: ["Elden Ring", "Minecraft"], duration: 60 }, result: "Poll created", pauseAfter: 200 },
        { kind: "claude", text: "Done! Poll is live for 60 seconds.", pauseAfter: 0 },
      ],
    },
  }),
};
