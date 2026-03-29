"use client";

import { CopyableRow } from "@/registry/new-york/copyable-row/copyable-row";
import { TerminalChrome } from "@/registry/new-york/terminal-chrome/terminal-chrome";
import { REGISTRY, installCommand } from "@/lib/registry";

export function InstallSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Installation</h2>

      <p className="text-sm text-muted-foreground">Install everything:</p>
      <TerminalChrome title="terminal">
        <div className="space-y-0.5">
          {REGISTRY.map((e) => (
            <CopyableRow key={e.name} text={installCommand(e.name)}>
              <span className="text-term-success shrink-0">$</span>{" "}
              <span className="text-term-text-bright">{installCommand(e.name)}</span>
            </CopyableRow>
          ))}
        </div>
      </TerminalChrome>

      <p className="text-sm text-muted-foreground">Or pick one:</p>
      <TerminalChrome title="terminal">
        <CopyableRow text={installCommand("terminal-demo")}>
          <span className="text-term-success shrink-0">$</span>{" "}
          <span className="text-term-text-bright">{installCommand("terminal-demo")}</span>
        </CopyableRow>
      </TerminalChrome>
    </div>
  );
}
