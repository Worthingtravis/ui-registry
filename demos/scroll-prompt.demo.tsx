"use client";

import { ScrollPrompt, type ScrollPromptProps } from "@/registry/scroll-prompt";
import { ALL_FIXTURES } from "@/fixtures/scroll-prompt.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "targetId", type: "string", required: true, description: "DOM id of the element to observe" },
  { name: "label", type: "string", required: true, description: "Label text shown above the arrow" },
];

export const config: PreviewLabConfig<ScrollPromptProps> = {
  title: "Scroll Prompt",
  description: "Animated scroll-down prompt that appears when a target section is out of view.",
  tags: ["animation", "scroll", "navigation"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-700/40 bg-zinc-900/40 p-6 text-center">
        <p className="text-sm text-zinc-400">
          The scroll prompt tracks whether a target element is in view.
          In a real page it appears when the target scrolls out of the viewport.
        </p>
      </div>
      <div className="flex justify-center">
        <ScrollPrompt {...fixture} />
      </div>
      <div id={fixture.targetId} className="rounded-lg border border-zinc-700/40 bg-zinc-800/50 p-4 text-center">
        <p className="text-xs text-zinc-500">Target section</p>
      </div>
    </div>
  ),
  propsMeta,
  sourceCode: `export interface ScrollPromptProps {
  targetId: string; // DOM id of the element to observe
  label: string;    // Label text shown above the arrow
}

export function ScrollPrompt({ targetId, label }: ScrollPromptProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  if (!visible) return null;
  return (
    <a href={\`#\${targetId}\`} className="flex flex-col items-center gap-1 py-2">
      <span className="text-xs font-medium">{label}</span>
      <ChevronDown className="animate-bounce" />
    </a>
  );
}`,
};
