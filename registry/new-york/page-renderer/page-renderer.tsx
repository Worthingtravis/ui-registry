"use client";

import React, { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  SortableSection,
  type EditorActions,
} from "@/registry/new-york/sortable-section/sortable-section";
import type { PageLayout, SectionConfig, SectionRegistry } from "@/registry/new-york/page-builder-lib/types";
import {
  dedup as dedupSections,
  buildRows,
  moveSection,
  changeColumn,
  changeVariant,
  changeVisibility,
  SPLIT_GRID_TEMPLATES,
} from "@/registry/new-york/page-builder-lib/layout-operations";

// ---------------------------------------------------------------------------
// Error boundary for individual sections
// ---------------------------------------------------------------------------

class SectionErrorBoundary extends React.Component<
  { label: string; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={cn(
            "rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive",
          )}
        >
          <p className="mb-2">Failed to load &ldquo;{this.props.label}&rdquo;</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className={cn(
              "text-xs underline underline-offset-2 hover:no-underline transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 rounded",
            )}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Section headers
// ---------------------------------------------------------------------------

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const ALL_COLUMNS: ("left" | "right" | "full")[] = ["full", "left", "right"];

export interface PageRendererProps {
  layout: PageLayout;
  registry: SectionRegistry;
  /**
   * Data context keyed by section key. Each section receives
   * `dataContext[sectionKey]` spread as props (or nothing if absent).
   */
  dataContext: Record<string, unknown>;
  /**
   * Dynamic visibility overrides — when `false`, a section is treated as
   * data-hidden (collapsed in edit mode, skipped in view mode).
   */
  dynamicVisibility?: Record<string, boolean>;
  editMode?: boolean;
  /** Preview mode — shows variant switcher on hover, no full editor controls */
  previewMode?: boolean;
  onLayoutChange?: (layout: PageLayout) => void;
  /** Preview fixture registry — maps section key → labeled fixture states */
  previewFixtures?: Record<string, Record<string, Record<string, unknown>>>;
  /** Currently active preview fixtures per section (key = sectionKey, value = fixture label) */
  activeFixtures?: Record<string, string>;
  /** Called when a preview fixture is selected/cleared */
  onFixtureChange?: (sectionKey: string, fixture: string) => void;
  /** Section keys locked from shuffle */
  lockedKeys?: ReadonlySet<string>;
  onToggleLock?: (sectionKey: string) => void;
}

// ---------------------------------------------------------------------------
// ColumnSections
// ---------------------------------------------------------------------------

interface ColumnSectionsProps {
  configs: SectionConfig[];
  registry: SectionRegistry;
  dataContext: Record<string, unknown>;
  dynamicVisibility: Record<string, boolean> | undefined;
  editMode: boolean;
  previewMode: boolean;
  column: "left" | "right" | "full";
  editorActions: EditorActions;
  globalSectionCount?: number;
  globalIndexMap?: Map<string, number>;
  previewFixtures?: Record<string, Record<string, Record<string, unknown>>>;
  activeFixtures?: Record<string, string>;
  onFixtureChange?: (sectionKey: string, fixture: string) => void;
  lockedKeys?: ReadonlySet<string>;
}

const ColumnSections = React.memo(function ColumnSections({
  configs,
  registry,
  dataContext,
  dynamicVisibility,
  editMode,
  previewMode,
  column,
  editorActions,
  globalSectionCount = 0,
  globalIndexMap,
  previewFixtures,
  activeFixtures,
  onFixtureChange,
  lockedKeys,
}: ColumnSectionsProps) {
  return (
    <div className="space-y-8">
      {configs.map((config, index) => {
        const definition = registry[config.sectionKey];
        if (!definition) return null;

        let VariantComponent = definition.variants[config.variant];
        if (!VariantComponent) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[PageRenderer] Variant "${config.variant}" not found for section "${config.sectionKey}", using default`,
            );
          }
          VariantComponent = definition.variants[definition.defaultVariant];
        }
        if (!VariantComponent) return null;

        // Resolve fixture override — when a preview fixture is active, use fixture data
        const activeFixtureLabel = activeFixtures?.[config.sectionKey] ?? "";
        const sectionFixtures = previewFixtures?.[config.sectionKey];
        const fixtureData =
          activeFixtureLabel && sectionFixtures
            ? sectionFixtures[activeFixtureLabel]
            : undefined;

        const dataHidden = !fixtureData && dynamicVisibility?.[config.sectionKey] === false;
        const effectiveVisible = config.visible && !dataHidden;

        // In edit/preview mode, show collapsed placeholder for hidden sections.
        // In view mode, skip hidden sections entirely.
        if (!effectiveVisible && !editMode && !previewMode) return null;

        // Fixture data overrides live data when active
        const sectionData = (fixtureData ?? dataContext[config.sectionKey]) as
          | Record<string, unknown>
          | undefined;

        const sectionContent = (
          <section id={config.sectionKey} className="@container space-y-8">
            {/* Section header — skipped when component renders its own */}
            {!definition.hideHeader && (effectiveVisible || editMode) && (
              <SectionHeader label={definition.label} />
            )}
            {/* Render component with data from dataContext */}
            {effectiveVisible && (
              <SectionErrorBoundary label={definition.label}>
                {sectionData ? (
                  <VariantComponent {...sectionData} />
                ) : (
                  <VariantComponent />
                )}
              </SectionErrorBoundary>
            )}
          </section>
        );

        return (
          <div
            key={config.sectionKey}
            className={`animate-in fade-in slide-in-from-bottom-${Math.min(6 + index, 10)} duration-700`}
            style={{
              animationDelay: `${100 + index * 75}ms`,
              animationFillMode: "backwards",
            }}
          >
            <SortableSection
              id={config.sectionKey}
              editMode={editMode}
              previewMode={previewMode}
              label={definition.label}
              variant={config.variant}
              variantOptions={Object.keys(definition.variants)}
              variantLabels={
                definition.variantMeta
                  ? Object.fromEntries(
                      Object.entries(definition.variantMeta).map(([k, m]) => [k, m.label]),
                    )
                  : undefined
              }
              column={config.column}
              columnOptions={definition.allowedColumns ?? ALL_COLUMNS}
              visible={config.visible}
              disabled={dataHidden && !editMode}
              editorActions={editorActions}
              isFirst={
                globalIndexMap ? globalIndexMap.get(config.sectionKey) === 0 : false
              }
              isLast={
                globalIndexMap
                  ? globalIndexMap.get(config.sectionKey) === globalSectionCount - 1
                  : false
              }
              fixtureOptions={sectionFixtures ? Object.keys(sectionFixtures) : undefined}
              activeFixture={activeFixtureLabel}
              onFixtureChange={onFixtureChange}
              isLocked={lockedKeys?.has(config.sectionKey) ?? false}
            >
              {sectionContent}
            </SortableSection>
          </div>
        );
      })}
    </div>
  );
});

ColumnSections.displayName = "ColumnSections";

// ---------------------------------------------------------------------------
// PageRenderer
// ---------------------------------------------------------------------------

/**
 * Live page renderer that applies a PageLayout to a SectionRegistry.
 *
 * Handles full-width and two-column layouts. In edit mode, each section
 * gets an editor toolbar via SortableSection (up/down reordering, variant
 * picker, column picker, visibility toggle, fixture picker).
 *
 * No @dnd-kit dependency — reordering is done via the up/down arrow buttons.
 *
 * @example
 * ```tsx
 * <PageRenderer
 *   layout={layout}
 *   registry={MY_SECTION_REGISTRY}
 *   dataContext={{ "my-section": { title: "Hello" } }}
 *   editMode={editMode}
 *   onLayoutChange={setLayout}
 * />
 * ```
 */
export function PageRenderer({
  layout,
  registry,
  dataContext,
  dynamicVisibility,
  editMode = false,
  previewMode = false,
  onLayoutChange,
  previewFixtures,
  activeFixtures,
  onFixtureChange,
  lockedKeys,
  onToggleLock,
}: PageRendererProps) {
  const deduped = useMemo(() => dedupSections(layout.sections), [layout.sections]);
  const rows = useMemo(() => buildRows(deduped, registry), [deduped, registry]);

  const handleVariantChange = useCallback(
    (sectionKey: string, variant: string) => {
      onLayoutChange?.({
        ...layout,
        sections: changeVariant(layout.sections, sectionKey, variant),
      });
    },
    [layout, onLayoutChange],
  );

  const handleColumnChange = useCallback(
    (sectionKey: string, column: "left" | "right" | "full") => {
      onLayoutChange?.({
        ...layout,
        sections: changeColumn(layout.sections, sectionKey, column),
      });
    },
    [layout, onLayoutChange],
  );

  const handleVisibilityChange = useCallback(
    (sectionKey: string, visible: boolean) => {
      onLayoutChange?.({
        ...layout,
        sections: changeVisibility(layout.sections, sectionKey, visible),
      });
    },
    [layout, onLayoutChange],
  );

  const handleMoveUp = useCallback(
    (sectionKey: string) => {
      const result = moveSection(layout.sections, sectionKey, "up");
      if (result !== layout.sections) onLayoutChange?.({ ...layout, sections: result });
    },
    [layout, onLayoutChange],
  );

  const handleMoveDown = useCallback(
    (sectionKey: string) => {
      const result = moveSection(layout.sections, sectionKey, "down");
      if (result !== layout.sections) onLayoutChange?.({ ...layout, sections: result });
    },
    [layout, onLayoutChange],
  );

  // Map sectionKey → global index for first/last detection
  const globalIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    deduped.forEach((s, i) => map.set(s.sectionKey, i));
    return map;
  }, [deduped]);

  const editorActions: EditorActions = useMemo(
    () => ({
      onVariantChange: handleVariantChange,
      onColumnChange: handleColumnChange,
      onVisibilityChange: handleVisibilityChange,
      onMoveUp: handleMoveUp,
      onMoveDown: handleMoveDown,
      onToggleLock,
    }),
    [
      handleVariantChange,
      handleColumnChange,
      handleVisibilityChange,
      handleMoveUp,
      handleMoveDown,
      onToggleLock,
    ],
  );

  const sharedColumnProps = useMemo(
    () => ({
      registry,
      dataContext,
      dynamicVisibility,
      editMode,
      previewMode,
      editorActions,
      globalSectionCount: deduped.length,
      globalIndexMap,
      previewFixtures,
      activeFixtures,
      onFixtureChange,
      lockedKeys,
    }),
    [
      registry,
      dataContext,
      dynamicVisibility,
      editMode,
      previewMode,
      editorActions,
      deduped.length,
      globalIndexMap,
      previewFixtures,
      activeFixtures,
      onFixtureChange,
      lockedKeys,
    ],
  );

  return (
    <div className="space-y-8">
      {rows.map((row, rowIndex) => {
        if (row.type === "full") {
          return (
            <div key={`row-${rowIndex}`}>
              <ColumnSections configs={row.sections} column="full" {...sharedColumnProps} />
            </div>
          );
        }

        // Two-column row — only render if at least one side has content
        if (row.left.length === 0 && row.right.length === 0) return null;

        const splitTemplate = SPLIT_GRID_TEMPLATES[row.split];

        return (
          <div
            key={`row-${rowIndex}`}
            className="grid grid-cols-1 gap-8 items-start lg:[grid-template-columns:var(--split)]"
            style={{ "--split": splitTemplate } as React.CSSProperties}
          >
            {/* Left column */}
            <div className="@container/col-left min-w-0">
              <ColumnSections configs={row.left} column="left" {...sharedColumnProps} />
            </div>

            {/* Right column */}
            <div className="@container/col-right min-w-0">
              <ColumnSections configs={row.right} column="right" {...sharedColumnProps} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
