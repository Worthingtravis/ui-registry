"use client";

import React, { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { PreviewLabConfig } from "@/lib/types";
import type { PageLayout } from "@/registry/new-york/page-builder-lib/types";
import {
  randomizeLayout,
  migrateLayout,
} from "@/registry/new-york/page-builder-lib/layout-operations";
import { useLayoutEditor } from "@/registry/new-york/use-layout-editor/use-layout-editor";
import { LayoutEditorBar } from "@/registry/new-york/layout-editor-bar/layout-editor-bar";
import { LayoutGridEditor } from "@/registry/new-york/layout-grid-editor/layout-grid-editor";
import { PageRenderer } from "@/registry/new-york/page-renderer/page-renderer";
import {
  DEFAULT_DEMO_LAYOUT,
  DEFAULT_DATA_CONTEXT,
  DEMO_PREVIEW_FIXTURES,
  buildDemoRegistry,
} from "@/fixtures/page-builder.fixtures";

// ---------------------------------------------------------------------------
// Placeholder card component — used as the section renderer in the demo
// ---------------------------------------------------------------------------

function PlaceholderCard({
  label,
  color,
  description,
}: {
  label: string;
  color: string;
  description?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6 min-h-[80px] flex flex-col gap-1",
        color,
      )}
    >
      <p className="text-sm font-semibold">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo component
// ---------------------------------------------------------------------------

type DemoFixture = {
  showEditorByDefault: boolean;
};

function PageBuilderDemo({ fixture }: { fixture: DemoFixture }) {
  const registry = useMemo(() => buildDemoRegistry(PlaceholderCard), []);

  const [savedLayout, setSavedLayout] = useState<PageLayout>(DEFAULT_DEMO_LAYOUT);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useLayoutEditor({
    loadFixtures: () => Promise.resolve(DEMO_PREVIEW_FIXTURES),
  });

  // The active layout: draft while editing, saved otherwise
  const activeLayout = editor.editMode
    ? (editor.draftLayout ?? savedLayout)
    : savedLayout;

  // Enter edit mode — initialize draft from current saved layout
  const handleToggleEdit = useCallback(() => {
    if (editor.editMode) {
      editor.exitEditMode();
    } else {
      editor.setDraftLayout(savedLayout);
      editor.enterEditMode();
    }
  }, [editor, savedLayout]);

  // Save draft
  const handleSave = useCallback(async () => {
    if (!editor.draftLayout) return;
    setIsSaving(true);
    // Simulate async save
    await new Promise((r) => setTimeout(r, 600));
    setSavedLayout(editor.draftLayout);
    setIsSaving(false);
    editor.exitEditMode();
  }, [editor]);

  // Cancel — discard draft
  const handleCancel = useCallback(() => {
    editor.exitEditMode();
  }, [editor]);

  // Reset to default layout
  const handleReset = useCallback(async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSavedLayout(DEFAULT_DEMO_LAYOUT);
    editor.setDraftLayout(DEFAULT_DEMO_LAYOUT);
    setIsSaving(false);
  }, [editor]);

  // Randomize layout
  const handleRandomize = useCallback(() => {
    const draft = editor.draftLayout ?? savedLayout;
    const randomized = randomizeLayout(registry, draft.sections, editor.lockedKeys);
    editor.setDraftLayout({ ...draft, sections: randomized });
  }, [editor, savedLayout, registry]);

  // Persist layout changes from the grid editor or page renderer
  const handleLayoutChange = useCallback(
    (layout: PageLayout) => {
      editor.setDraftLayout(migrateLayout(layout, DEFAULT_DEMO_LAYOUT));
    },
    [editor],
  );

  // Auto-enter edit mode if fixture says so
  React.useEffect(() => {
    if (fixture.showEditorByDefault && !editor.editMode) {
      editor.setDraftLayout(savedLayout);
      editor.enterEditMode();
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-[500px] w-full">
      {/* Floating editor bar */}
      <LayoutEditorBar
        editMode={editor.editMode}
        previewing={editor.previewing}
        useRealData={editor.useRealData}
        onToggleEdit={handleToggleEdit}
        onTogglePreview={() => editor.setPreviewing((p) => !p)}
        onToggleRealData={() => editor.setUseRealData((r) => !r)}
        onSave={handleSave}
        onCancel={handleCancel}
        onReset={handleReset}
        onRandomize={handleRandomize}
        isSaving={isSaving}
        customizeLabel="Customize"
      />

      <div className={cn("space-y-6", editor.editMode && "pr-16")}>
        {/* Grid editor panel (edit mode, not previewing) */}
        {editor.editMode && !editor.previewing && (
          <LayoutGridEditor
            layout={activeLayout}
            registry={registry}
            lockedKeys={editor.lockedKeys}
            onLayoutChange={handleLayoutChange}
            onToggleLock={editor.handleToggleLock}
          />
        )}

        {/* Page renderer */}
        <PageRenderer
          layout={activeLayout}
          registry={registry}
          dataContext={DEFAULT_DATA_CONTEXT}
          editMode={editor.editMode && !editor.previewing}
          previewMode={editor.editMode && editor.previewing}
          onLayoutChange={handleLayoutChange}
          previewFixtures={editor.previewFixtures}
          activeFixtures={
            editor.useRealData ? {} : editor.activeFixtures
          }
          onFixtureChange={editor.handleFixtureChange}
          lockedKeys={editor.lockedKeys}
          onToggleLock={editor.handleToggleLock}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Registry config
// ---------------------------------------------------------------------------

const ALL_FIXTURES: Record<string, DemoFixture> = {
  "View Mode": { showEditorByDefault: false },
  "Edit Mode (Grid)": { showEditorByDefault: true },
};

const USAGE = `// 1. Define your section registry
const MY_REGISTRY: SectionRegistry = {
  "hero": {
    key: "hero",
    label: "Hero",
    column: "full",
    allowedColumns: ["full"],
    alwaysVisible: true,
    variants: { default: HeroSection, compact: HeroCompact },
    defaultVariant: "default",
    variantMeta: {
      default: { label: "Default", sizeHint: "md" },
      compact: { label: "Compact", sizeHint: "sm" },
    },
  },
  // ... more sections
};

// 2. Set up layout state
const { layout, save, reset, isSaving } = usePageLayout(
  "dashboard",
  DEFAULT_LAYOUT,
  {
    onLoad: async () => fetchLayoutFromAPI(),
    onSave: async (layout) => saveLayoutToAPI(layout),
    onError: (msg) => toast.error(msg),
  }
);

// 3. Set up editor state
const editor = useLayoutEditor({
  loadFixtures: () => import("./my-page.fixtures").then(m => m.FIXTURES),
});

// 4. Render the full editor UI
<LayoutEditorBar
  editMode={editor.editMode}
  onToggleEdit={() => {
    if (editor.editMode) editor.exitEditMode();
    else { editor.setDraftLayout(layout); editor.enterEditMode(); }
  }}
  onSave={async () => {
    if (editor.draftLayout) await save(editor.draftLayout);
    editor.exitEditMode();
  }}
  onCancel={() => editor.exitEditMode()}
  onReset={reset}
  onRandomize={() => {
    const randomized = randomizeLayout(MY_REGISTRY, editor.draftLayout?.sections, editor.lockedKeys);
    editor.setDraftLayout({ ...editor.draftLayout!, sections: randomized });
  }}
  isSaving={isSaving}
/>

{editor.editMode && !editor.previewing && (
  <LayoutGridEditor
    layout={editor.draftLayout ?? layout}
    registry={MY_REGISTRY}
    lockedKeys={editor.lockedKeys}
    onLayoutChange={(l) => editor.setDraftLayout(l)}
    onToggleLock={editor.handleToggleLock}
  />
)}

<PageRenderer
  layout={editor.editMode ? (editor.draftLayout ?? layout) : layout}
  registry={MY_REGISTRY}
  dataContext={myDataContext}
  editMode={editor.editMode && !editor.previewing}
  previewMode={editor.editMode && editor.previewing}
  onLayoutChange={(l) => editor.setDraftLayout(l)}
/>`;

export const config: PreviewLabConfig<DemoFixture> = {
  title: "Page Builder",
  description:
    "Full dashboard customization system — section reordering, variant switching, visibility toggles, column layout, preview with fixtures, shuffle, save/cancel/reset.",
  tags: ["layout", "editor", "dashboard", "customization", "drag-and-drop"],
  fixtures: ALL_FIXTURES,
  usageCode: USAGE,
  render: (fixture) => <PageBuilderDemo fixture={fixture} />,
};
