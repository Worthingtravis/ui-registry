"use client";

import { MiniTerminalDemo } from "@/registry/new-york/mini-terminal-demo/mini-terminal-demo";
import { ALL_FIXTURES, type MiniTerminalDemoFixture } from "@/fixtures/mini-terminal-demo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "scenario", type: "DemoScenario", required: true, description: "The scenario data to render" },
  { name: "play", type: "boolean", required: true, description: "Whether to start/restart the animation" },
  { name: "playDelay", type: "number", required: false, defaultValue: "0", description: "Delay in ms before animation starts" },
  { name: "isPinned", type: "boolean", required: false, defaultValue: "false", description: "Whether this card is pinned" },
  { name: "onTogglePin", type: "() => void", required: false, description: "Callback to toggle pin state" },
];

const USAGE = `import { MiniTerminalDemo, type DemoScenario } from "@/registry/new-york/mini-terminal-demo/mini-terminal-demo"

const scenario: DemoScenario = {
  id: "deploy",
  title: "Deploy",
  category: "ops",
  entries: [
    { kind: "input", text: "vercel --prod", prompt: ">", typingMs: 600, pauseAfter: 400 },
    { kind: "output", text: "Deployed!", color: "green", pauseAfter: 0 },
  ],
}

<MiniTerminalDemo scenario={scenario} play={true} />`;

export const config: PreviewLabConfig<MiniTerminalDemoFixture> = {
  title: "Mini Terminal Demo",
  description: "Compact animated terminal card with copy-to-clipboard, pin support, and stagger delay.",
  tags: ["terminal", "animation", "demo"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="max-w-lg">
      <MiniTerminalDemo
        scenario={fixture.scenario}
        play={fixture.play}
        playDelay={fixture.playDelay}
      />
    </div>
  ),
  propsMeta,
};
