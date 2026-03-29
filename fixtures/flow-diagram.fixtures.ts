import type { FlowDiagramProps } from "@/registry/new-york/flow-diagram/flow-diagram";

export type FlowDiagramFixture = Omit<FlowDiagramProps, "className">;
type Fixture = FlowDiagramFixture;

const BASE: Fixture = {
  nodes: [
    { id: "client", label: "Client", description: "Browser / Mobile" },
    { id: "api", label: "API Gateway", description: "REST + WebSocket", live: true },
    { id: "db", label: "Database", description: "PostgreSQL" },
  ],
  edges: [
    { id: "c-a", from: "client", to: "api", label: "requests" },
    { id: "a-d", from: "api", to: "db", label: "queries" },
  ],
  height: 300,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Simple (auto-layout)": BASE,

  "MCP Architecture": fx({
    nodes: [
      { id: "you", label: "You" },
      { id: "ai", label: "Your AI", description: "Claude, Cursor, Windsurf", optional: true },
      { id: "mcp", label: "MCP Server", description: "Your application" },
      { id: "api", label: "External API", description: "Third-party service", live: true },
      { id: "bot", label: "Chat Bot", description: "StreamElements, Nightbot" },
    ],
    edges: [
      { id: "you-mcp", from: "you", to: "mcp", label: "use directly" },
      { id: "you-ai", from: "you", to: "ai", label: "optionally", optional: true },
      { id: "ai-mcp", from: "ai", to: "mcp", optional: true },
      { id: "mcp-api", from: "mcp", to: "api", label: "calls API" },
      { id: "mcp-bot", from: "mcp", to: "bot", label: "!quiz", bidirectional: true },
    ],
    height: 400,
  }),

  "MCP (manual positions)": fx({
    nodes: [
      { id: "you", label: "You" },
      { id: "ai", label: "Your AI", description: "Claude, Cursor, Windsurf", optional: true },
      { id: "mcp", label: "MCP Server", description: "Your application" },
      { id: "api", label: "External API", description: "Third-party service", live: true },
      { id: "bot", label: "Chat Bot", description: "StreamElements, Nightbot" },
    ],
    edges: [
      { id: "you-mcp", from: "you", to: "mcp", fromSide: "right", toSide: "left", label: "use directly" },
      { id: "you-ai", from: "you", to: "ai", fromSide: "bottom", toSide: "top", label: "optionally", optional: true },
      { id: "ai-mcp", from: "ai", to: "mcp", fromSide: "top", toSide: "left", optional: true },
      { id: "mcp-api", from: "mcp", to: "api", fromSide: "right", toSide: "left", label: "calls API" },
      { id: "mcp-bot", from: "mcp", to: "bot", fromSide: "bottom", toSide: "top", label: "!quiz", bidirectional: true },
    ],
    positions: {
      you: { x: 10, y: 32 },
      ai: { x: 22, y: 68 },
      mcp: { x: 42, y: 16 },
      api: { x: 80, y: 16 },
      bot: { x: 62, y: 68 },
    },
    height: 400,
  }),

  "CI/CD Pipeline": fx({
    nodes: [
      { id: "repo", label: "Repository", description: "GitHub" },
      { id: "ci", label: "CI Runner", description: "GitHub Actions", live: true },
      { id: "test", label: "Tests", description: "Unit + E2E" },
      { id: "deploy", label: "Deploy", description: "Vercel" },
    ],
    edges: [
      { id: "r-c", from: "repo", to: "ci", label: "push" },
      { id: "c-t", from: "ci", to: "test", label: "run" },
      { id: "c-d", from: "ci", to: "deploy", label: "on success" },
    ],
    height: 350,
  }),

  "Microservices": fx({
    nodes: [
      { id: "gateway", label: "API Gateway", description: "Load balancer" },
      { id: "auth", label: "Auth Service", description: "JWT + OAuth" },
      { id: "users", label: "User Service", description: "Profiles" },
      { id: "orders", label: "Order Service", description: "Commerce", live: true },
      { id: "queue", label: "Message Queue", description: "Redis Streams" },
    ],
    edges: [
      { id: "g-a", from: "gateway", to: "auth", label: "verify" },
      { id: "g-u", from: "gateway", to: "users", label: "route" },
      { id: "g-o", from: "gateway", to: "orders" },
      { id: "o-q", from: "orders", to: "queue", label: "publish", bidirectional: true },
      { id: "u-q", from: "users", to: "queue", label: "subscribe", optional: true },
    ],
    height: 400,
  }),

  "No Grid / No Glow": fx({
    showGrid: false,
    showGlow: false,
  }),
};
