import type { TerminalEntry } from "@/registry/new-york/terminal-demo/terminal-demo";

/** Fixture shape: the actual script entries that drive the terminal animation. */
export interface TerminalDemoFixture {
  script: TerminalEntry[];
}

// ---------------------------------------------------------------------------
// Scripts
// ---------------------------------------------------------------------------

const MCP_SETUP_SCRIPT: TerminalEntry[] = [
  { kind: "phase", label: "Setup", pauseAfter: 300 },
  { kind: "input", text: "claude mcp add --transport http twitch https://your-app.vercel.app/api/mcp", prompt: "$", typingMs: 1200, pauseAfter: 400 },
  { kind: "output", text: "✓ Added twitch (143 tools)", color: "green", pauseAfter: 600 },
  { kind: "input", text: "/mcp", prompt: "$", typingMs: 400, pauseAfter: 400 },
  { kind: "output", text: "✓ Connected as @your_channel", color: "green", pauseAfter: 600 },
  { kind: "phase", label: "Stream", pauseAfter: 300 },
  { kind: "input", text: "add a poll, what game should I play? Elden Ring, Minecraft, and always include Viewer's Choice", prompt: ">", typingMs: 1400, pauseAfter: 200 },
  { kind: "tool-call", toolName: "create_poll", args: { title: "What game should I play next?", choices: ["Elden Ring", "Minecraft", "Viewer's Choice"], duration: 60 }, result: "✓ Poll created — 60s, 3 choices", pauseAfter: 400 },
  { kind: "memory", text: "Game poll prefs: Elden Ring, Minecraft, always Viewer's Choice.", pauseAfter: 0 },
];

const CODE_REVIEW_SCRIPT: TerminalEntry[] = [
  { kind: "phase", label: "Review", pauseAfter: 300 },
  { kind: "input", text: "review the PR for auth changes", prompt: ">", typingMs: 1000, pauseAfter: 200 },
  { kind: "thinking", text: "Analyzing diff...", durationMs: 1200, pauseAfter: 200 },
  { kind: "tool-call", toolName: "read_file", args: { path: "src/auth/middleware.ts" }, result: "234 lines read", pauseAfter: 300 },
  { kind: "tool-call", toolName: "read_file", args: { path: "src/auth/session.ts" }, result: "89 lines read", pauseAfter: 300 },
  { kind: "claude", text: "The auth middleware looks good. Two suggestions:", pauseAfter: 200 },
  { kind: "output", text: "1. Session token rotation should use crypto.randomUUID()", color: "zinc", pauseAfter: 200 },
  { kind: "output", text: "2. Missing rate limiting on /api/auth/refresh", color: "zinc", pauseAfter: 200 },
  { kind: "ask", question: "Want me to fix these?", options: ["Yes, apply both fixes", "Show me the diff first", "Skip for now"], pauseAfter: 0 },
];

const DEPLOY_SCRIPT: TerminalEntry[] = [
  { kind: "phase", label: "Deploy", pauseAfter: 300 },
  { kind: "input", text: "deploy to production", prompt: ">", typingMs: 800, pauseAfter: 200 },
  { kind: "tool-call", toolName: "run_tests", args: { suite: "all" }, result: "✓ 142 tests passed", pauseAfter: 400 },
  { kind: "tool-call", toolName: "build", args: { target: "production", minify: true }, result: "✓ Built in 4.2s", pauseAfter: 400 },
  { kind: "claude", text: "Tests pass, build clean. Deploying now.", pauseAfter: 200 },
  { kind: "tool-call", toolName: "deploy", args: { target: "production", region: "us-east-1" }, result: "✓ Deployed to https://app.example.com", pauseAfter: 300 },
  { kind: "output", text: "✓ All health checks passing", color: "green", pauseAfter: 0 },
];

const MINIMAL_SCRIPT: TerminalEntry[] = [
  { kind: "input", text: "hello", prompt: ">", typingMs: 300, pauseAfter: 200 },
  { kind: "claude", text: "Hi! How can I help you today?", pauseAfter: 0 },
];

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const BASE: TerminalDemoFixture = {
  script: MCP_SETUP_SCRIPT,
};

const fx = (overrides: Partial<TerminalDemoFixture>): TerminalDemoFixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, TerminalDemoFixture> = {
  "MCP Setup + Poll": BASE,
  "Code Review": fx({ script: CODE_REVIEW_SCRIPT }),
  "Deploy Pipeline": fx({ script: DEPLOY_SCRIPT }),
  "Minimal Chat": fx({ script: MINIMAL_SCRIPT }),
};
