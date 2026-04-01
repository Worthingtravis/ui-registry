"use client";

import { useState, useCallback, type Dispatch, type SetStateAction } from "react";

import type { PageLayout } from "@/registry/new-york/page-builder-lib/types";
import { buildAutoFixtures } from "@/registry/new-york/page-builder-lib/layout-operations";

// ---------------------------------------------------------------------------
// Stable empty references — shared across all callers
// ---------------------------------------------------------------------------

const EMPTY_FIXTURES: Record<string, string> = Object.freeze({});
const EMPTY_LOCKED: ReadonlySet<string> = Object.freeze(new Set<string>());

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Map: sectionKey → { fixtureLabel → { propKey → value } } */
export type PreviewFixtureMap = Record<string, Record<string, Record<string, unknown>>>;

export interface LayoutEditorConfig {
  /**
   * Lazy loader for the page's preview fixture data.
   * Called once on first edit mode entry.
   * If fixtures are already bundled, wrap them: `() => Promise.resolve(fixtures)`
   */
  loadFixtures: () => Promise<PreviewFixtureMap>;
}

export interface LayoutEditorState {
  editMode: boolean;
  previewing: boolean;
  useRealData: boolean;
  draftLayout: PageLayout | null;
  lockedKeys: ReadonlySet<string>;
  activeFixtures: Record<string, string>;
  previewFixtures: PreviewFixtureMap | undefined;
}

export interface LayoutEditorActions {
  setDraftLayout: (layout: PageLayout | null) => void;
  setPreviewing: Dispatch<SetStateAction<boolean>>;
  setUseRealData: Dispatch<SetStateAction<boolean>>;
  handleToggleLock: (key: string) => void;
  handleFixtureChange: (sectionKey: string, fixture: string) => void;
  exitEditMode: () => void;
  enterEditMode: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Edit mode state machine for the page builder.
 *
 * Manages: edit/preview mode toggle, draft layout, locked section keys,
 * preview fixture selection, and real vs. mock data toggle.
 *
 * Accepts a `loadFixtures` callback so this hook is independent of any
 * specific fixture file or data source.
 *
 * @example
 * ```tsx
 * const editor = useLayoutEditor({
 *   loadFixtures: () => import("./my-page.fixtures").then(m => m.FIXTURES),
 * });
 *
 * // Enter edit mode
 * editor.enterEditMode();
 *
 * // Apply draft changes
 * editor.setDraftLayout(newLayout);
 *
 * // Save and exit
 * await save(editor.draftLayout!);
 * editor.exitEditMode();
 * ```
 */
export function useLayoutEditor(
  config: LayoutEditorConfig,
): LayoutEditorState & LayoutEditorActions {
  const { loadFixtures } = config;

  // Core edit state
  const [editMode, setEditMode] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [draftLayout, setDraftLayout] = useState<PageLayout | null>(null);
  const [lockedKeys, setLockedKeys] = useState<ReadonlySet<string>>(new Set());

  // Preview fixture state
  const [activeFixtures, setActiveFixtures] = useState<Record<string, string>>({});
  const [previewFixtures, setPreviewFixtures] = useState<PreviewFixtureMap | undefined>(
    undefined,
  );

  const handleToggleLock = useCallback((key: string) => {
    setLockedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleFixtureChange = useCallback((sectionKey: string, fixture: string) => {
    setActiveFixtures((prev) => {
      if (!fixture) {
        const next = { ...prev };
        delete next[sectionKey];
        return next;
      }
      return { ...prev, [sectionKey]: fixture };
    });
  }, []);

  const exitEditMode = useCallback(() => {
    setDraftLayout(null);
    setActiveFixtures(EMPTY_FIXTURES);
    setLockedKeys(EMPTY_LOCKED);
    setPreviewing(false);
    setUseRealData(false);
    setEditMode(false);
  }, []);

  const enterEditMode = useCallback(() => {
    if (!previewFixtures) {
      loadFixtures()
        .then((fixtures) => {
          setPreviewFixtures(fixtures);
          setActiveFixtures(buildAutoFixtures(fixtures));
        })
        .catch(() => {
          // Fixture load failed — enter edit mode without fixtures (uses live data)
        });
    } else {
      setActiveFixtures(buildAutoFixtures(previewFixtures));
    }
    setEditMode(true);
  }, [previewFixtures, loadFixtures]);

  return {
    // State
    editMode,
    previewing,
    useRealData,
    draftLayout,
    lockedKeys,
    activeFixtures,
    previewFixtures,
    // Actions
    setDraftLayout,
    setPreviewing,
    setUseRealData,
    handleToggleLock,
    handleFixtureChange,
    exitEditMode,
    enterEditMode,
  };
}
