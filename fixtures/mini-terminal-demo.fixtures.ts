import type { DemoScenario } from "@/registry/new-york/mini-terminal-demo/mini-terminal-demo";

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
  "Staggered delay": fx({
    playDelay: 800,
    scenario: {
      id: "git-push",
      title: "Git push",
      category: "git",
      entries: [
        { kind: "input", text: "git push origin main", prompt: ">", typingMs: 700, pauseAfter: 400 },
        { kind: "output", text: "Enumerating objects: 12, done.", color: "zinc", pauseAfter: 200 },
        { kind: "output", text: "Compressing objects: 100% (8/8)", color: "zinc", pauseAfter: 200 },
        { kind: "output", text: "To github.com:user/repo.git", color: "green", pauseAfter: 0 },
      ],
    },
  }),
  "Claude conversation": fx({
    scenario: {
      id: "claude-chat",
      title: "Claude Code",
      category: "ai",
      entries: [
        { kind: "input", text: "explain this error in auth.ts", prompt: ">", typingMs: 900, pauseAfter: 300 },
        { kind: "claude", text: "The JWT token is expired. The refresh logic on line 42 doesn't handle clock skew.", pauseAfter: 200 },
        { kind: "output", text: "→ auth.ts:42", color: "purple", pauseAfter: 0 },
      ],
    },
  }),
};
