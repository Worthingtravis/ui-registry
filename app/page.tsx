import { REGISTRY, installCommand } from "@/lib/registry";
import { ComponentCell } from "./component-card";

export default function HomePage() {
  return (
    <div className="py-10 divide-y divide-border/40 sm:divide-y-0 sm:space-y-10">
      <div className="px-6 lg:px-8 py-6 sm:py-0 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Beautifully designed components built with Tailwind CSS. Installable via the shadcn CLI.
        </p>
      </div>

      {/* Tic-tac-toe grid — shared borders between cells */}
      <div className="grid grid-cols-1 divide-y divide-border/40 sm:divide-y-0 sm:grid-cols-2 lg:grid-cols-3 sm:border-t sm:border-border/40">
        {REGISTRY.map((entry) => (
          <div
            key={entry.name}
            className="sm:border-b sm:border-r sm:border-border/40 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
          >
            <ComponentCell name={entry.name} description={entry.description} />
          </div>
        ))}
      </div>

      <div className="px-6 lg:px-8 py-6 sm:py-0 sm:pt-4 space-y-4 sm:border-t sm:border-border/30">
        <h2 className="text-lg font-semibold">Installation</h2>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Install everything:</p>
          <div className="relative rounded-lg border border-border/40 bg-code-bg overflow-hidden">
            <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-code-text">
              <code>{REGISTRY.map((e) => installCommand(e.name)).join("\n")}</code>
            </pre>
          </div>
          <p className="text-sm text-muted-foreground">Or pick one:</p>
          <div className="relative rounded-lg border border-border/40 bg-code-bg overflow-hidden">
            <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-code-text">
              <code>{installCommand("terminal-demo")}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
