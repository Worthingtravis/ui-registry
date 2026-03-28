"use client";

import { MiniTerminalDemo, type DemoScenario } from "@/registry/mini-terminal-demo";

const scenario: DemoScenario = {
  title: "Install component",
  entries: [
    { type: "command", text: "npx shadcn@latest add step-flow" },
    { type: "output", text: "Installing step-flow..." },
    { type: "output", text: "Created registry/step-flow.tsx" },
    { type: "command", text: "pnpm dev" },
    { type: "output", text: "Ready on http://localhost:3000" },
  ],
};

export default function MiniTerminalDemoDemo() {
  return (
    <div className="max-w-lg">
      <MiniTerminalDemo scenario={scenario} />
    </div>
  );
}
