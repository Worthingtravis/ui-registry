import Link from "next/link";
import { REGISTRY, installCommand } from "@/lib/registry";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">UI Registry</h1>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {REGISTRY.length} components
          </span>
        </div>
        <p className="text-muted-foreground text-sm max-w-lg">
          Installable components for shadcn/ui. Click any component to see a live preview
          with multiple examples, then copy the install command.
        </p>
      </div>

      {/* Component grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REGISTRY.map((entry) => (
          <Link
            key={entry.name}
            href={`/preview/${entry.name}`}
            className="group rounded-xl border border-border/40 bg-card/40 p-5 transition-all hover:border-border/80 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5"
          >
            <h2 className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">
              {entry.name.split("-").map(w => w[0]!.toUpperCase() + w.slice(1)).join(" ")}
            </h2>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Install info */}
      <div className="rounded-xl border border-border/40 bg-card/40 p-6 space-y-3">
        <h2 className="text-sm font-bold tracking-tight">Quick Install</h2>
        <p className="text-xs text-muted-foreground">
          Install any component by name:
        </p>
        <pre className="text-xs font-mono bg-muted/30 rounded-lg p-3 overflow-x-auto">
          {installCommand("[name]")}
        </pre>
      </div>
    </div>
  );
}
