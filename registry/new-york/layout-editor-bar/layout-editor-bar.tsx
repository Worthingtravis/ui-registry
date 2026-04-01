"use client";

import { Settings2, Save, X, RotateCcw, Eye, LayoutGrid, Dices, Database } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LayoutEditorBarProps {
  editMode: boolean;
  previewing?: boolean;
  useRealData?: boolean;
  onToggleEdit: () => void;
  onTogglePreview?: () => void;
  onToggleRealData?: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  onRandomize?: () => void;
  isSaving?: boolean;
  /** Label for the customize tab button. Defaults to "Customize". */
  customizeLabel?: string;
}

// ---------------------------------------------------------------------------
// Shared button styles
// ---------------------------------------------------------------------------

const GHOST_BTN = cn(
  "flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors",
  "text-muted-foreground hover:text-foreground hover:bg-muted/50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
);

const PRIMARY_BTN = cn(
  "flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors",
  "bg-primary text-primary-foreground hover:bg-primary/90",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  "disabled:opacity-60 disabled:cursor-not-allowed",
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Floating sidebar toolbar for the page layout editor.
 *
 * In view mode: renders a subtle "Customize" tab anchored to the right edge.
 * In edit mode: expands to a vertical button panel with save, cancel, reset,
 * optional randomize, optional preview toggle, and optional real/mock data toggle.
 *
 * Position: fixed, right edge, below a top nav (top-[4.5rem]). Override via
 * `className` on a wrapper if you need different positioning.
 *
 * @example
 * ```tsx
 * <LayoutEditorBar
 *   editMode={editMode}
 *   previewing={previewing}
 *   onToggleEdit={enterEditMode}
 *   onTogglePreview={() => setPreviewing(p => !p)}
 *   onSave={handleSave}
 *   onCancel={exitEditMode}
 *   onReset={handleReset}
 *   onRandomize={handleRandomize}
 *   isSaving={isSaving}
 * />
 * ```
 */
export function LayoutEditorBar({
  editMode,
  previewing = false,
  useRealData = false,
  onToggleEdit,
  onTogglePreview,
  onToggleRealData,
  onSave,
  onCancel,
  onReset,
  onRandomize,
  isSaving = false,
  customizeLabel = "Customize",
}: LayoutEditorBarProps) {
  return (
    <div
      className={cn(
        "fixed right-0 top-[4.5rem] z-50",
        "animate-in fade-in slide-in-from-left-4 duration-300",
      )}
    >
      {editMode ? (
        /* Edit mode — horizontal bar on mobile, vertical sidebar on sm+ */
        <div
          className={cn(
            "flex items-center gap-1 p-1.5 rounded-l-xl",
            "sm:flex-col sm:items-stretch",
            "bg-card border border-r-0 border-border/80 shadow-lg shadow-black/10",
          )}
        >
          {/* Preview / Grid toggle */}
          {onTogglePreview && (
            <button
              type="button"
              onClick={onTogglePreview}
              className={cn(GHOST_BTN, "justify-start")}
              aria-label={previewing ? "Back to grid editor" : "Preview layout"}
            >
              {previewing ? (
                <>
                  <LayoutGrid className="size-3 shrink-0" />
                  <span className="hidden sm:inline">Edit</span>
                </>
              ) : (
                <>
                  <Eye className="size-3 shrink-0" />
                  <span className="hidden sm:inline">Preview</span>
                </>
              )}
            </button>
          )}

          {/* Real / mock data toggle (only in preview mode) */}
          {previewing && onToggleRealData && (
            <button
              type="button"
              onClick={onToggleRealData}
              className={cn(
                GHOST_BTN,
                "justify-start",
                useRealData ? "text-primary" : "text-muted-foreground",
              )}
              aria-label={useRealData ? "Use mock data" : "Use real data"}
            >
              <Database className="size-3 shrink-0" />
              <span className="hidden sm:inline">{useRealData ? "Real Data" : "Mock Data"}</span>
            </button>
          )}

          <div className="hidden sm:block w-full h-px bg-border/30 my-0.5" />

          {onRandomize && (
            <button
              type="button"
              onClick={onRandomize}
              className={cn(GHOST_BTN, "justify-start")}
              aria-label="Randomize layout"
            >
              <Dices className="size-3 shrink-0" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className={cn(GHOST_BTN, "justify-start")}
            aria-label="Reset to default layout"
          >
            <RotateCcw className="size-3 shrink-0" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className={cn(GHOST_BTN, "justify-start")}
            aria-label="Cancel editing"
          >
            <X className="size-3 shrink-0" />
            <span className="hidden sm:inline">Cancel</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className={PRIMARY_BTN}
            aria-label="Save layout"
          >
            <Save className="size-3 shrink-0" />
            <span className="hidden sm:inline">{isSaving ? "Saving…" : "Save"}</span>
          </button>
        </div>
      ) : (
        /* View mode — side tab */
        <button
          type="button"
          onClick={onToggleEdit}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-2 rounded-l-lg",
            "bg-card border border-r-0 border-border/80",
            "shadow-lg shadow-black/10",
            "text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50",
            "transition-all cursor-pointer",
          )}
          aria-label={`${customizeLabel} layout`}
        >
          <Settings2 className="size-3" />
          <span>{customizeLabel}</span>
        </button>
      )}
    </div>
  );
}
