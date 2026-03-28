"use client";

import { ScrollPrompt } from "@/registry/scroll-prompt";

export default function ScrollPromptDemo() {
  return (
    <div className="relative min-h-[300px] flex flex-col items-center justify-center rounded-2xl border border-zinc-700/40 bg-zinc-900/40 p-8">
      <p className="text-sm text-zinc-400 mb-8">Scroll prompt appears when the target section is out of view.</p>
      <div id="scroll-target" className="p-4 rounded-lg border border-zinc-700/40 bg-zinc-800/50">
        <p className="text-xs text-zinc-500">Target section</p>
      </div>
      <div className="mt-8">
        <ScrollPrompt targetId="scroll-target" label="See more" />
      </div>
    </div>
  );
}
