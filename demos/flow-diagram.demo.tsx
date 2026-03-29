"use client";

import { FlowDiagram } from "@/registry/new-york/flow-diagram/flow-diagram";
import {
  ALL_FIXTURES,
  type FlowDiagramFixture,
} from "@/fixtures/flow-diagram.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = FlowDiagramFixture;

const propsMeta: PropMeta[] = [
  { name: "nodes", type: "FlowNode[]", required: true, description: "Array of nodes to display" },
  { name: "edges", type: "FlowEdge[]", required: true, description: "Array of edges connecting nodes" },
  { name: "positions", type: "Record<string, FlowPosition>", required: true, description: "Node positions as percentage coordinates (0\u2013100)" },
  { name: "height", type: "number", required: false, defaultValue: "400", description: "Container height in pixels" },
  { name: "nodeWidth", type: "number", required: false, defaultValue: "180", description: "Base width for regular nodes in pixels" },
  { name: "wideNodeId", type: "string", required: false, description: "Node ID rendered wider (e.g. the central hub)" },
  { name: "wideNodeWidth", type: "number", required: false, defaultValue: "260", description: "Width for the wide node in pixels" },
  { name: "drawDuration", type: "number", required: false, defaultValue: "0.8", description: "Draw-on animation duration in seconds" },
  { name: "showGrid", type: "boolean", required: false, defaultValue: "true", description: "Show dot grid background" },
  { name: "showGlow", type: "boolean", required: false, defaultValue: "true", description: "Show radial glow effect" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { FlowDiagram } from "@/registry/new-york/flow-diagram/flow-diagram"

<FlowDiagram
  nodes={[
    { id: "client", label: "Client", description: "Browser" },
    { id: "api", label: "API", description: "REST endpoints", live: true },
    { id: "db", label: "Database", description: "PostgreSQL" },
  ]}
  edges={[
    { id: "c-a", from: "client", to: "api", fromSide: "right", toSide: "left", label: "requests" },
    { id: "a-d", from: "api", to: "db", fromSide: "right", toSide: "left", label: "queries" },
  ]}
  positions={{
    client: { x: 15, y: 35 },
    api: { x: 50, y: 35 },
    db: { x: 85, y: 35 },
  }}
/>`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Flow Diagram",
  description:
    "Animated architecture flow diagram with nodes connected by bezier-curved edges. Features draw-on animation, flowing particles, hover highlighting, dot grid background, and radial glow.",
  tags: ["architecture", "diagram", "flow", "animation", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <FlowDiagram {...fixture} />,
  propsMeta,
};
