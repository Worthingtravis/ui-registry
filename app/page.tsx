import { REGISTRY, installCommand } from "@/lib/registry";
import { ComponentCell } from "./component-card";

export default function HomePage() {
  return (
    <div className="py-10 space-y-10">
      <div className="px-6 lg:px-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Beautifully designed components built with Tailwind CSS. Installable via the shadcn CLI.
        </p>
      </div>

      {/* Tic-tac-toe grid — shared borders between cells */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-border/40">
        {REGISTRY.map((entry) => (
          <div
            key={entry.name}
            className="border-b border-r border-border/40 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
          >
            <ComponentCell name={entry.name} description={entry.description} />
          </div>
        ))}
      </div>

      <div className="px-6 lg:px-8 space-y-4 pt-4 border-t border-border/30">
        <h2 className="text-lg font-semibold">Installation</h2>
        <p className="text-sm text-muted-foreground">
          Install any component using the shadcn CLI:
        </p>
        <div className="relative rounded-lg border border-border/40 bg-code-bg overflow-hidden">
          <div className="flex items-center border-b border-border/30 px-4 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Command</span>
          </div>
          <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-code-text">
            <code>{installCommand("[component-name]")}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
