"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A node in the flow diagram. */
export interface FlowNode {
  /** Unique identifier for the node. */
  id: string;
  /** Display label (rendered uppercase). */
  label: string;
  /** Description text below the label. */
  description?: string;
  /** Render as optional/dimmed with dashed border. */
  optional?: boolean;
  /** Show a pulsing "LIVE" indicator on this node. */
  live?: boolean;
}

/** Side of a node to attach an edge. */
export type FlowSide = "top" | "bottom" | "left" | "right";

/** An edge connecting two nodes. */
export interface FlowEdge {
  /** Unique identifier for the edge. */
  id: string;
  /** ID of the source node. */
  from: string;
  /** ID of the target node. */
  to: string;
  /** Side of the source node to attach. Inferred if omitted. */
  fromSide?: FlowSide;
  /** Side of the target node to attach. Inferred if omitted. */
  toSide?: FlowSide;
  /** Text label shown at the midpoint of the edge. */
  label?: string;
  /** Render as dashed/dimmed optional path. */
  optional?: boolean;
  /** Render particles flowing in both directions. */
  bidirectional?: boolean;
}

/** Node position as percentage coordinates (0–100). */
export interface FlowPosition {
  /** Horizontal position as percentage from left (node center). */
  x: number;
  /** Vertical position as percentage from top. */
  y: number;
}

export interface FlowDiagramProps {
  /** Array of nodes to display. */
  nodes: FlowNode[];
  /** Array of edges connecting nodes. */
  edges: FlowEdge[];
  /** Node positions keyed by node ID. When omitted, positions are auto-computed from graph structure. */
  positions?: Record<string, FlowPosition>;
  /** Height of the diagram container in pixels. */
  height?: number;
  /** Duration of the draw-on animation in seconds. */
  drawDuration?: number;
  /** Whether to show dot grid background. */
  showGrid?: boolean;
  /** Whether to show radial glow effect. */
  showGlow?: boolean;
  /** Additional class names for the root container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Auto-layout: layered graph layout (Sugiyama-style)
// ---------------------------------------------------------------------------

/**
 * Compute a layered layout from graph structure.
 * 1. Topological sort to assign layers (BFS from roots)
 * 2. Optional nodes are placed on a secondary row below their neighbors
 * 3. Nodes are spaced evenly within their layer
 */
function autoLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
): Record<string, FlowPosition> {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const incoming = new Map<string, Set<string>>();
  const outgoing = new Map<string, Set<string>>();
  for (const n of nodes) {
    incoming.set(n.id, new Set());
    outgoing.set(n.id, new Set());
  }
  for (const e of edges) {
    if (e.optional) continue;
    outgoing.get(e.from)?.add(e.to);
    incoming.get(e.to)?.add(e.from);
  }

  // Find roots (no non-optional incoming edges)
  const roots = nodes.filter((n) => !n.optional && (incoming.get(n.id)?.size ?? 0) === 0);
  if (roots.length === 0 && nodes.length > 0) roots.push(nodes[0]);

  // BFS to assign layers
  const layerOf = new Map<string, number>();
  const queue: string[] = [];
  for (const root of roots) {
    layerOf.set(root.id, 0);
    queue.push(root.id);
  }
  while (queue.length > 0) {
    const id = queue.shift()!;
    const layer = layerOf.get(id)!;
    for (const next of outgoing.get(id) ?? []) {
      if (!layerOf.has(next)) {
        layerOf.set(next, layer + 1);
        queue.push(next);
      }
    }
  }

  // Assign unvisited nodes (optional / disconnected)
  for (const n of nodes) {
    if (layerOf.has(n.id)) continue;
    // Place optional nodes near their connected non-optional neighbor
    let neighborLayer = 0;
    for (const e of edges) {
      if (e.from === n.id && layerOf.has(e.to)) {
        neighborLayer = layerOf.get(e.to)! - 0.5;
        break;
      }
      if (e.to === n.id && layerOf.has(e.from)) {
        neighborLayer = layerOf.get(e.from)! + 0.5;
        break;
      }
    }
    layerOf.set(n.id, neighborLayer);
  }

  // Group nodes by layer
  const layers = new Map<number, string[]>();
  for (const [id, layer] of layerOf) {
    if (!layers.has(layer)) layers.set(layer, []);
    layers.get(layer)!.push(id);
  }

  const sortedLayers = [...layers.keys()].sort((a, b) => a - b);
  const numLayers = sortedLayers.length;

  // Padding from edges
  const padX = 14;
  const padY = 18;
  const usableX = 100 - padX * 2;
  const usableY = 100 - padY * 2;

  const positions: Record<string, FlowPosition> = {};

  for (let li = 0; li < numLayers; li++) {
    const layerKey = sortedLayers[li];
    const nodesInLayer = layers.get(layerKey)!;
    const count = nodesInLayer.length;
    const x = numLayers === 1 ? 50 : padX + (li / (numLayers - 1)) * usableX;

    for (let ni = 0; ni < count; ni++) {
      const y = count === 1 ? 50 - padY / 2 : padY + (ni / (count - 1)) * usableY;

      // For fractional layers (optional nodes), offset vertically
      const isFractional = layerKey % 1 !== 0;
      positions[nodesInLayer[ni]] = {
        x,
        y: isFractional ? Math.min(y + 15, 80) : y,
      };
    }
  }

  return positions;
}

/**
 * Infer the best attachment side based on relative node positions.
 */
function inferSide(
  fromPos: FlowPosition,
  toPos: FlowPosition,
): { fromSide: FlowSide; toSide: FlowSide } {
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Primarily horizontal
    return dx > 0
      ? { fromSide: "right", toSide: "left" }
      : { fromSide: "left", toSide: "right" };
  }
  // Primarily vertical
  return dy > 0
    ? { fromSide: "bottom", toSide: "top" }
    : { fromSide: "top", toSide: "bottom" };
}

// ---------------------------------------------------------------------------
// Edge path computation
// ---------------------------------------------------------------------------

interface NodeDims {
  w: number;
  h: number;
}

interface ResolvedEdge {
  id: string;
  from: string;
  to: string;
  fromSide: FlowSide;
  toSide: FlowSide;
  label?: string;
  optional?: boolean;
  bidirectional?: boolean;
}

interface EdgePathData {
  id: string;
  d: string;
  label?: string;
  labelPos?: { x: number; y: number };
  optional?: boolean;
  bidirectional?: boolean;
}

function r(n: number): number {
  return Math.round(n * 10) / 10;
}

function getAttachPoint(
  pos: FlowPosition,
  dims: NodeDims,
  side: FlowSide,
): { x: number; y: number } {
  const halfW = dims.w / 2;
  switch (side) {
    case "top":    return { x: pos.x, y: pos.y };
    case "bottom": return { x: pos.x, y: pos.y + dims.h };
    case "left":   return { x: pos.x - halfW, y: pos.y + dims.h / 2 };
    case "right":  return { x: pos.x + halfW, y: pos.y + dims.h / 2 };
  }
}

function sideDir(side: FlowSide): { dx: number; dy: number } {
  switch (side) {
    case "top":    return { dx: 0, dy: -1 };
    case "bottom": return { dx: 0, dy: 1 };
    case "left":   return { dx: -1, dy: 0 };
    case "right":  return { dx: 1, dy: 0 };
  }
}

function computeBezierPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  fromSide: FlowSide,
  toSide: FlowSide,
): string {
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  const dist = Math.sqrt(dx * dx + dy * dy);

  const fromDir = sideDir(fromSide);
  const toDir = sideDir(toSide);
  const sameSide = fromSide === toSide;

  let t1: number;
  let t2: number;

  if (sameSide) {
    const loopSpan = (fromDir.dx !== 0 ? dy : dx) * 0.5;
    t1 = Math.max(loopSpan, dist * 0.45, 8);
    t2 = t1;
  } else {
    const fromAxisSpan = fromDir.dx !== 0 ? dx : dy;
    const toAxisSpan = toDir.dx !== 0 ? dx : dy;
    t1 = Math.max(fromAxisSpan * 0.45, dist * 0.25, 5);
    t2 = Math.max(toAxisSpan * 0.45, dist * 0.25, 5);
  }

  const cp1 = { x: start.x + fromDir.dx * t1, y: start.y + fromDir.dy * t1 };
  const cp2 = { x: end.x + toDir.dx * t2, y: end.y + toDir.dy * t2 };

  return `M ${r(start.x)} ${r(start.y)} C ${r(cp1.x)} ${r(cp1.y)}, ${r(cp2.x)} ${r(cp2.y)}, ${r(end.x)} ${r(end.y)}`;
}

function computeEdgePaths(
  edges: ResolvedEdge[],
  positions: Record<string, FlowPosition>,
  getNodeDims: (nodeId: string) => NodeDims,
): EdgePathData[] {
  return edges.map((edge) => {
    const fromPos = positions[edge.from];
    const toPos = positions[edge.to];
    if (!fromPos || !toPos) return { id: edge.id, d: "" };

    const fromDims = getNodeDims(edge.from);
    const toDims = getNodeDims(edge.to);

    const start = getAttachPoint(fromPos, fromDims, edge.fromSide);
    const end = getAttachPoint(toPos, toDims, edge.toSide);
    const d = computeBezierPath(start, end, edge.fromSide, edge.toSide);

    const dParts = d.match(/[\d.-]+/g)?.map(Number) ?? [];
    let labelPos: { x: number; y: number } | undefined;
    if (edge.label && dParts.length >= 8) {
      const [sx, sy, c1x, c1y, c2x, c2y, ex, ey] = dParts;
      labelPos = {
        x: r(0.125 * sx + 0.375 * c1x + 0.375 * c2x + 0.125 * ex),
        y: r(0.125 * sy + 0.375 * c1y + 0.375 * c2y + 0.125 * ey),
      };
    }

    return {
      id: edge.id,
      d,
      label: edge.label,
      labelPos,
      optional: edge.optional,
      bidirectional: edge.bidirectional,
    };
  });
}

function getConnectedSides(edges: ResolvedEdge[], nodeId: string): Set<FlowSide> {
  const sides = new Set<FlowSide>();
  for (const e of edges) {
    if (e.from === nodeId) sides.add(e.fromSide);
    if (e.to === nodeId) sides.add(e.toSide);
  }
  return sides;
}

function getNodeEdgeIds(edges: ResolvedEdge[], nodeId: string): Set<string> {
  const ids = new Set<string>();
  for (const e of edges) {
    if (e.from === nodeId || e.to === nodeId) ids.add(e.id);
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Pin dot
// ---------------------------------------------------------------------------

const PIN_POSITIONS = {
  top: "absolute -top-1.5 left-1/2 -translate-x-1/2",
  bottom: "absolute -bottom-1.5 left-1/2 -translate-x-1/2",
  left: "absolute top-1/2 -left-1.5 -translate-y-1/2",
  right: "absolute top-1/2 -right-1.5 -translate-y-1/2",
} as const;

function PinDot({ side, isOptional }: { side: FlowSide; isOptional?: boolean }) {
  return (
    <div
      className={cn(
        PIN_POSITIONS[side],
        "h-3 w-3 rounded-full border-2",
        isOptional
          ? "border-primary/20 bg-primary/30"
          : "border-primary/40 bg-primary/60",
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Node card
// ---------------------------------------------------------------------------

function NodeCard({
  node,
  delay,
  connectedSides,
  dimmed,
  onPointerEnter,
  onPointerLeave,
  isHub,
}: {
  node: FlowNode;
  delay: number;
  connectedSides: Set<FlowSide>;
  dimmed: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  isHub: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={cn(
        "relative rounded-xl border bg-card px-4 py-3 text-center cursor-default transition-opacity duration-200 whitespace-nowrap",
        isHub ? "border-primary/40" : node.optional ? "border-dashed border-border/60 opacity-70" : "border-border",
        dimmed && "!opacity-30",
      )}
    >
      {(["top", "bottom", "left", "right"] as const).map(
        (side) =>
          connectedSides.has(side) && (
            <PinDot key={side} side={side} isOptional={node.optional} />
          ),
      )}

      <div className="text-[10px] uppercase tracking-widest font-bold text-primary">
        {node.label}
      </div>
      {node.description && (
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {node.description}
        </div>
      )}

      {node.live && (
        <div className="mt-1.5 flex items-center justify-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[9px] text-red-400 uppercase tracking-wider font-semibold">
            live
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// SVG edges
// ---------------------------------------------------------------------------

function Edges({
  paths,
  drawDuration,
  highlightedEdges,
  containerWidth,
  containerHeight,
}: {
  paths: EdgePathData[];
  drawDuration: number;
  highlightedEdges?: Set<string>;
  containerWidth: number;
  containerHeight: number;
}) {
  const hasHighlight = highlightedEdges && highlightedEdges.size > 0;
  const aspectRatio = containerWidth / (containerHeight || 1);
  const particleRx = 0.5;
  const particleRy = particleRx * aspectRatio;
  const smallRx = 0.35;
  const smallRy = smallRx * aspectRatio;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {paths.map((edge, i) => {
        const isOpt = edge.optional;
        const isLit = hasHighlight && highlightedEdges!.has(edge.id);
        const isDimmed = hasHighlight && !isLit;
        const dash = isOpt ? "1.2 1" : undefined;

        const traceOpacity = isDimmed ? 0.06 : isLit ? 0.25 : isOpt ? 0.2 : 0.12;
        const drawOpacity = isDimmed ? 0.12 : isLit ? 0.8 : isOpt ? 0.3 : 0.45;
        const drawWidth = isLit ? (isOpt ? "0.5" : "0.6") : isOpt ? "0.35" : "0.4";

        return (
          <g key={edge.id} style={{ transition: "opacity 0.2s ease" }}>
            {!isOpt && (
              <motion.path
                d={edge.d}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth={isLit ? "3" : "2"}
                strokeLinecap="round"
                opacity={isDimmed ? 0.02 : isLit ? 0.12 : 0.05}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: drawDuration, delay: i * 0.25, ease: "easeInOut" }}
              />
            )}
            <path
              d={edge.d}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={isOpt ? "0.35" : "0.3"}
              strokeLinecap="round"
              strokeDasharray={dash}
              opacity={traceOpacity}
            />
            <motion.path
              d={edge.d}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={drawWidth}
              strokeLinecap="round"
              strokeDasharray={dash}
              opacity={drawOpacity}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: drawDuration, delay: i * 0.25, ease: "easeInOut" }}
            />
            <ellipse rx={isOpt ? smallRx : particleRx} ry={isOpt ? smallRy : particleRy} fill="var(--color-primary)" opacity="0">
              <animateMotion dur={isOpt ? "4s" : "3s"} begin={`${i * 0.6}s`} repeatCount="indefinite" path={edge.d} />
              <animate attributeName="opacity" values={isOpt ? "0;0.25;0.25;0" : "0;0.6;0.6;0"} keyTimes="0;0.1;0.85;1" dur={isOpt ? "4s" : "3s"} begin={`${i * 0.6}s`} repeatCount="indefinite" />
            </ellipse>
            {!isOpt && !edge.bidirectional && (
              <ellipse rx={smallRx} ry={smallRy} fill="var(--color-primary)" opacity="0">
                <animateMotion dur="4s" begin={`${i * 0.6 + 1.5}s`} repeatCount="indefinite" path={edge.d} />
                <animate attributeName="opacity" values="0;0.4;0.4;0" keyTimes="0;0.1;0.85;1" dur="4s" begin={`${i * 0.6 + 1.5}s`} repeatCount="indefinite" />
              </ellipse>
            )}
            {edge.bidirectional && (
              <ellipse rx={particleRx} ry={particleRy} fill="var(--color-primary)" opacity="0">
                <animateMotion dur="3.5s" begin={`${i * 0.6 + 1.5}s`} repeatCount="indefinite" path={edge.d} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
                <animate attributeName="opacity" values="0;0.6;0.6;0" keyTimes="0;0.1;0.85;1" dur="3.5s" begin={`${i * 0.6 + 1.5}s`} repeatCount="indefinite" />
              </ellipse>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Animated architecture flow diagram with nodes connected by bezier-curved
 * edges. Nodes highlight on hover with connected edges emphasized. Edges
 * animate with draw-on and flowing particle effects.
 *
 * Positions can be specified manually or auto-computed from graph structure.
 * Edge attachment sides are inferred when not specified. Nodes auto-size
 * based on their content.
 *
 * @example
 * ```tsx
 * <FlowDiagram
 *   nodes={[
 *     { id: "client", label: "Client", description: "Browser" },
 *     { id: "api", label: "API", description: "REST endpoints", live: true },
 *     { id: "db", label: "Database", description: "PostgreSQL" },
 *   ]}
 *   edges={[
 *     { id: "c-a", from: "client", to: "api", label: "requests" },
 *     { id: "a-d", from: "api", to: "db", label: "queries" },
 *   ]}
 * />
 * ```
 */
export function FlowDiagram({
  nodes,
  edges,
  positions: userPositions,
  height = 400,
  drawDuration = 0.8,
  showGrid = true,
  showGlow = true,
  className,
}: FlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [containerSize, setContainerSize] = useState({ w: 1100, h: height });
  const [nodeSizes, setNodeSizes] = useState<Record<string, { w: number; h: number }>>({});
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Auto-layout when no positions provided
  const positions = useMemo(
    () => userPositions ?? autoLayout(nodes, edges),
    [userPositions, nodes, edges],
  );

  // Resolve edge sides: use explicit sides or infer from positions
  const resolvedEdges: ResolvedEdge[] = useMemo(() => {
    return edges.map((e) => {
      const fromPos = positions[e.from];
      const toPos = positions[e.to];
      if (!fromPos || !toPos) {
        return { ...e, fromSide: e.fromSide ?? "right", toSide: e.toSide ?? "left" };
      }
      const inferred = inferSide(fromPos, toPos);
      return {
        ...e,
        fromSide: e.fromSide ?? inferred.fromSide,
        toSide: e.toSide ?? inferred.toSide,
      };
    });
  }, [edges, positions]);

  // Detect the "hub" node — the one with the most connections
  const hubNodeId = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of edges) {
      counts.set(e.from, (counts.get(e.from) ?? 0) + 1);
      counts.set(e.to, (counts.get(e.to) ?? 0) + 1);
    }
    let maxId = "";
    let maxCount = 0;
    for (const [id, count] of counts) {
      if (count > maxCount) { maxId = id; maxCount = count; }
    }
    return maxCount >= 3 ? maxId : undefined;
  }, [edges]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const sizes: Record<string, { w: number; h: number }> = {};
    for (const [id, el] of Object.entries(nodeRefs.current)) {
      if (el) sizes[id] = { w: el.offsetWidth, h: el.offsetHeight };
    }
    if (Object.keys(sizes).length > 0) setNodeSizes(sizes);
  }, [containerSize, nodes]);

  const getNodeDims = useCallback(
    (nodeId: string): NodeDims => {
      const measured = nodeSizes[nodeId];
      if (measured && containerSize.w > 0 && containerSize.h > 0) {
        return {
          w: (measured.w / containerSize.w) * 100,
          h: (measured.h / containerSize.h) * 100,
        };
      }
      // Fallback before measurement
      return { w: (160 / containerSize.w) * 100, h: (60 / containerSize.h) * 100 };
    },
    [containerSize, nodeSizes],
  );

  const edgePaths = useMemo(
    () => computeEdgePaths(resolvedEdges, positions, getNodeDims),
    [resolvedEdges, positions, getNodeDims],
  );

  const connectedSidesMap = useMemo(() => {
    const map: Record<string, Set<FlowSide>> = {};
    for (const node of nodes) map[node.id] = getConnectedSides(resolvedEdges, node.id);
    return map;
  }, [nodes, resolvedEdges]);

  const highlightedEdges = useMemo(() => {
    if (!hoveredNode) return undefined;
    return getNodeEdgeIds(resolvedEdges, hoveredNode);
  }, [hoveredNode, resolvedEdges]);

  const highlightedNodes = useMemo(() => {
    if (!hoveredNode) return undefined;
    const set = new Set<string>([hoveredNode]);
    for (const e of resolvedEdges) {
      if (e.from === hoveredNode) set.add(e.to);
      if (e.to === hoveredNode) set.add(e.from);
    }
    return set;
  }, [hoveredNode, resolvedEdges]);

  const setNodeRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      nodeRefs.current[id] = el;
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border",
        className,
      )}
      style={{ height }}
      onPointerLeave={() => setHoveredNode(null)}
    >
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      {showGlow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 40% 60% at 50% 45%, var(--color-primary), transparent)",
            opacity: 0.03,
          }}
        />
      )}

      <Edges
        paths={edgePaths}
        drawDuration={drawDuration}
        highlightedEdges={highlightedEdges}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
      />

      {edgePaths.map((edge, i) =>
        edge.label && edge.labelPos ? (
          <motion.div
            key={`label-${edge.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${edge.labelPos.x}%`,
              top: `${edge.labelPos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.25 + 0.4 }}
          >
            <span
              className={cn(
                "px-1.5 py-0.5 text-[9px] font-mono tracking-wider border rounded bg-background/80 backdrop-blur-sm whitespace-nowrap transition-all duration-200",
                highlightedEdges?.has(edge.id)
                  ? "text-primary/90 border-primary/40 bg-primary/10"
                  : highlightedEdges
                    ? "text-muted-foreground/20 border-border/10"
                    : edge.optional
                      ? "text-muted-foreground/70 border-dashed border-border/25"
                      : "text-muted-foreground/70 border-border/40",
              )}
            >
              {edge.label}
            </span>
          </motion.div>
        ) : null,
      )}

      {nodes.map((node, i) => {
        const pos = positions[node.id];
        if (!pos) return null;
        const isDimmed = highlightedNodes ? !highlightedNodes.has(node.id) : false;
        return (
          <div
            key={node.id}
            ref={setNodeRef(node.id)}
            className="absolute transition-opacity duration-300 w-auto"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, 0)",
            }}
          >
            <NodeCard
              node={node}
              delay={i * 0.15}
              connectedSides={connectedSidesMap[node.id] ?? new Set()}
              dimmed={isDimmed}
              onPointerEnter={() => setHoveredNode(node.id)}
              onPointerLeave={() => setHoveredNode(null)}
              isHub={node.id === hubNodeId}
            />
          </div>
        );
      })}
    </div>
  );
}
