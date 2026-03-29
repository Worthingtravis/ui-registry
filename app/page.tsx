import { REGISTRY } from "@/lib/registry";
import { ComponentCell } from "./component-card";
import { InstallSection } from "./install-section";

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

      <div className="px-6 lg:px-8 py-6 sm:py-0 sm:pt-4 sm:border-t sm:border-border/30">
        <InstallSection />
      </div>
    </div>
  );
}
