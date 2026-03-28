"use client";

import { TerminalChrome } from "@/registry/terminal-chrome";
import { CopyableRow } from "@/registry/copyable-row";

export default function CopyableRowDemo() {
  return (
    <TerminalChrome title="copyable-row">
      <div className="space-y-1 text-zinc-300">
        <CopyableRow text="npx shadcn@latest add step-flow">
          <span className="text-green-400">$</span>{" "}
          <span>npx shadcn@latest add step-flow</span>
        </CopyableRow>
        <CopyableRow text="pnpm add lucide-react">
          <span className="text-green-400">$</span>{" "}
          <span>pnpm add lucide-react</span>
        </CopyableRow>
        <CopyableRow text="npm run dev">
          <span className="text-green-400">$</span>{" "}
          <span>npm run dev</span>
        </CopyableRow>
      </div>
    </TerminalChrome>
  );
}
