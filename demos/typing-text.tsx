"use client";

import { TerminalChrome } from "@/registry/terminal-chrome";
import { TypingText } from "@/registry/typing-text";

export default function TypingTextDemo() {
  return (
    <TerminalChrome title="typing-text">
      <div className="space-y-2 text-zinc-300">
        <div className="flex items-start gap-1">
          <span className="text-green-400 shrink-0">$</span>
          <TypingText text="npx shadcn@latest add step-flow" delay={300} duration={1200} />
        </div>
        <div className="flex items-start gap-1">
          <span className="text-green-400 shrink-0">$</span>
          <TypingText text="pnpm dev" delay={2000} duration={400} />
        </div>
      </div>
    </TerminalChrome>
  );
}
