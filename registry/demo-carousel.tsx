import { useEffect, useRef, useState, useCallback } from "react";
import { MiniTerminalDemo } from "./mini-terminal-demo";
import type { DemoScenario } from "./mini-terminal-demo";

// ---------------------------------------------------------------------------
// Shuffle helper — deterministic per page load, random across visits
// ---------------------------------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------------------------------------------------------------------------
// DemoCarousel
// ---------------------------------------------------------------------------
// Desktop breakpoint in px — matches Tailwind's `lg`
const LG = 1024;

export function DemoCarousel({
  scenarios,
}: {
  scenarios: DemoScenario[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [shuffled] = useState(() => shuffle(scenarios));
  const [isDesktop, setIsDesktop] = useState(false);

  const allCategories = Array.from(
    new Set(scenarios.map((s) => s.category))
  ).sort();

  const filtered = activeFilter
    ? shuffled.filter((s) => s.category === activeFilter)
    : shuffled;

  // Track viewport size for animation style
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG}px)`);
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Intersection observer — trigger when section scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  // Staggered reveal — faster on desktop where many cards are visible
  useEffect(() => {
    if (!isVisible) return;
    if (revealedCount >= filtered.length) return;

    const staggerMs = isDesktop ? 40 : 150;
    const timer = setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, staggerMs);

    return () => clearTimeout(timer);
  }, [isVisible, revealedCount, filtered.length, isDesktop]);

  // Reset reveal count when filter changes
  useEffect(() => {
    if (isVisible) {
      setRevealedCount(0);
    }
  }, [activeFilter, isVisible]);

  // Scroll buttons (mobile only)
  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 340 + 16;
    const visibleCards = Math.max(1, Math.floor(el.clientWidth / cardWidth));
    const amount = visibleCards * cardWidth;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {filtered.length} Tools in Action
        </h2>
        {/* Scroll buttons — mobile only */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-200 dark:border-zinc-700"
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-200 dark:border-zinc-700"
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-1">
        <FilterPill
          label="All"
          active={activeFilter === null}
          onClick={() => setActiveFilter(null)}
        />
        {allCategories.map((cat) => (
          <FilterPill
            key={cat}
            label={cat}
            active={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
          />
        ))}
      </div>

      {/* Mobile: horizontal scroll | Desktop: masonry grid */}
      <div
        ref={scrollRef}
        className="scrollbar-none flex min-h-[300px] items-start gap-4 overflow-x-auto overflow-y-clip pb-4 lg:block lg:columns-3 lg:gap-4 lg:space-y-4 lg:overflow-x-visible lg:overflow-y-visible xl:columns-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {filtered.map((scenario, i) => {
          const revealed = i < revealedCount;
          // Desktop: quick scale-up + fade | Mobile: slide-up + fade
          const style = isDesktop
            ? {
                opacity: revealed ? 1 : 0,
                transform: revealed ? "scale(1)" : "scale(0.92)",
                transition: "opacity 400ms ease-out, transform 400ms ease-out",
              }
            : {
                scrollSnapAlign: "start" as const,
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
              };

          return (
            <div
              key={scenario.id}
              className="shrink-0 lg:break-inside-avoid"
              style={style}
            >
              <MiniTerminalDemo scenario={scenario} play={revealed} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition ${
        active
          ? "bg-[#9147ff] text-white"
          : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      }`}
    >
      {label}
    </button>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
