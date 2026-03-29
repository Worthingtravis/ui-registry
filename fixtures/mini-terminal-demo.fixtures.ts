import type { DemoScenario } from "@/registry/new-york/mini-terminal-demo/mini-terminal-demo";

export interface MiniTerminalDemoFixture {
  scenario: DemoScenario;
  play: boolean;
  playDelay?: number;
}

const BASE: MiniTerminalDemoFixture = {
  play: true,
  playDelay: 0,
  scenario: {
    id: "git-push",
    title: "Git push",
    category: "git",
    entries: [
      { kind: "input", text: "git push origin main", prompt: ">", typingMs: 700, pauseAfter: 400 },
      { kind: "output", text: "Enumerating objects: 12, done.", color: "zinc", pauseAfter: 200 },
      { kind: "output", text: "To github.com:user/repo.git", color: "green", pauseAfter: 0 },
    ],
  },
};

const fx = (overrides: Partial<MiniTerminalDemoFixture>): MiniTerminalDemoFixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, MiniTerminalDemoFixture> = {
  "Input + output": BASE,
  "With tool call": fx({
    scenario: {
      id: "tool-call",
      title: "Code review",
      category: "ai",
      entries: [
        { kind: "input", text: "review the auth middleware", prompt: ">", typingMs: 800, pauseAfter: 300 },
        { kind: "tool-call", toolName: "read_file", args: { path: "src/auth/middleware.ts" }, result: "234 lines read", pauseAfter: 200 },
        { kind: "claude", text: "Session token rotation should use crypto.randomUUID().", pauseAfter: 0 },
      ],
    },
  }),
  "Claude response": fx({
    scenario: {
      id: "claude-chat",
      title: "Claude Code",
      category: "ai",
      entries: [
        { kind: "input", text: "explain this error in auth.ts", prompt: ">", typingMs: 900, pauseAfter: 300 },
        { kind: "claude", text: "The JWT token is expired. The refresh logic on line 42 doesn't handle clock skew.", pauseAfter: 200 },
        { kind: "output", text: "\u2192 auth.ts:42", color: "purple", pauseAfter: 0 },
      ],
    },
  }),
};
