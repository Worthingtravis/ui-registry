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
  { name: "edges", type: "FlowEdge[]", required: true, description: "Array of edges connecting nodes. Sides are inferred if omitted" },
  { name: "positions", type: "Record<string, FlowPosition>", required: false, description: "Node positions as percentage coordinates. Auto-computed when omitted" },
  { name: "height", type: "number", required: false, defaultValue: "400", description: "Container height in pixels" },
  { name: "drawDuration", type: "number", required: false, defaultValue: "0.8", description: "Draw-on animation duration in seconds" },
  { name: "showGrid", type: "boolean", required: false, defaultValue: "true", description: "Show dot grid background" },
  { name: "showGlow", type: "boolean", required: false, defaultValue: "true", description: "Show radial glow effect" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { FlowDiagram } from "@/registry/new-york/flow-diagram/flow-diagram"

{/* Auto-layout — just define nodes and edges */}
<FlowDiagram
  nodes={[
    { id: "client", label: "Client", description: "Browser" },
    { id: "api", label: "API", description: "REST endpoints", live: true },
    { id: "db", label: "Database", description: "PostgreSQL" },
  ]}
  edges={[
    { id: "c-a", from: "client", to: "api", label: "requests" },
    { id: "a-d", from: "api", to: "db", label: "queries" },
  ]}
/>

{/* Manual positions + explicit edge sides */}
<FlowDiagram
  nodes={nodes}
  edges={edges}
  positions={{ client: { x: 15, y: 35 }, api: { x: 50, y: 35 } }}
/>`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Flow Diagram",
  description:
    "Animated architecture flow diagram with auto-layout, bezier-curved edges, flowing particles, and hover highlighting. Nodes auto-size and edge sides are inferred from positions.",
  tags: ["architecture", "diagram", "flow", "animation", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <FlowDiagram {...fixture} />,
  propsMeta,
};
