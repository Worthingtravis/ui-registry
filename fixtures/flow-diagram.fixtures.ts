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
    { id: "c-a", from: "client", to: "api", fromSide: "right", toSide: "left", label: "requests" },
    { id: "a-d", from: "api", to: "db", fromSide: "right", toSide: "left", label: "queries" },
  ],
  positions: {
    client: { x: 15, y: 35 },
    api: { x: 50, y: 35 },
    db: { x: 85, y: 35 },
  },
  height: 300,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Simple (3 nodes)": BASE,

  "MCP Architecture": fx({
    nodes: [
      { id: "you", label: "You", description: "" },
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
    wideNodeId: "mcp",
    wideNodeWidth: 220,
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
      { id: "r-c", from: "repo", to: "ci", fromSide: "right", toSide: "left", label: "push" },
      { id: "c-t", from: "ci", to: "test", fromSide: "bottom", toSide: "top", label: "run" },
      { id: "c-d", from: "ci", to: "deploy", fromSide: "right", toSide: "left", label: "on success" },
    ],
    positions: {
      repo: { x: 12, y: 30 },
      ci: { x: 42, y: 30 },
      test: { x: 42, y: 70 },
      deploy: { x: 80, y: 30 },
    },
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
      { id: "g-a", from: "gateway", to: "auth", fromSide: "right", toSide: "left", label: "verify" },
      { id: "g-u", from: "gateway", to: "users", fromSide: "bottom", toSide: "top", label: "route" },
      { id: "g-o", from: "gateway", to: "orders", fromSide: "right", toSide: "left" },
      { id: "o-q", from: "orders", to: "queue", fromSide: "bottom", toSide: "top", label: "publish", bidirectional: true },
      { id: "u-q", from: "users", to: "queue", fromSide: "right", toSide: "left", label: "subscribe", optional: true },
    ],
    positions: {
      gateway: { x: 12, y: 25 },
      auth: { x: 45, y: 10 },
      users: { x: 30, y: 65 },
      orders: { x: 70, y: 25 },
      queue: { x: 70, y: 70 },
    },
    wideNodeId: "gateway",
    height: 400,
  }),

  "No Grid / No Glow": fx({
    showGrid: false,
    showGlow: false,
  }),
};
