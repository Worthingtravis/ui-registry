import Link from "next/link";
import { REGISTRY, installCommand } from "@/lib/registry";
import { kebabToTitle } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="max-w-3xl px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Beautifully designed components built with Tailwind CSS. Installable via the shadcn CLI.
        </p>
      </div>

      {/* Component list — shadcn style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REGISTRY.map((entry) => (
          <Link
            key={entry.name}
            href={`/preview/${entry.name}`}
            className="group relative rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-border hover:shadow-md hover:shadow-primary/5"
          >
            {/* Preview placeholder */}
            <div className="mb-3 rounded-md border border-border/30 bg-muted/20 p-6 flex items-center justify-center min-h-[80px]">
              <span className="text-xs text-muted-foreground/50 font-mono">{`<${kebabToTitle(entry.name).replace(/ /g, "")} />`}</span>
            </div>
            <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
              {kebabToTitle(entry.name)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {entry.tags.join(" / ")}
            </p>
          </Link>
        ))}
      </div>

      {/* Install section */}
      <div className="space-y-4 pt-4 border-t border-border/30">
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
