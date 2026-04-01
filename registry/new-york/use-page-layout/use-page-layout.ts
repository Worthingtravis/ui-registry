"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import type { PageLayout } from "@/registry/new-york/page-builder-lib/types";
import { migrateLayout } from "@/registry/new-york/page-builder-lib/layout-operations";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UsePageLayoutResult {
  layout: PageLayout;
  isLoading: boolean;
  isSaving: boolean;
  save: (draft: PageLayout) => Promise<boolean>;
  reset: () => Promise<void>;
}

export interface UsePageLayoutOptions {
  /**
   * Server-resolved layout — when provided, the hook uses this immediately
   * instead of calling `onLoad`. Eliminates the flash where the default
   * layout renders before the saved layout arrives.
   * Pass `null` to indicate the server confirmed no saved layout exists.
   */
  initialLayout?: PageLayout | null;
  /**
   * Called to load a saved layout. Return `null` if no saved layout exists.
   * If omitted, no load request is made (use `initialLayout` instead).
   */
  onLoad?: () => Promise<PageLayout | null>;
  /**
   * Called to persist a layout. Pass `null` to reset to default.
   * Should throw or return `false` on failure.
   */
  onSave?: (layout: PageLayout | null) => Promise<boolean | void>;
  /**
   * Called when a save/reset fails. Default: console.error.
   */
  onError?: (message: string) => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Fetch and persist a user's custom page layout.
 *
 * Persistence is fully abstract — pass `onLoad` and `onSave` callbacks.
 * This hook does not import or call any specific API route.
 *
 * - On mount, calls `onLoad()` to fetch the saved layout (unless `initialLayout` is provided).
 * - Falls back to `defaultLayout` if `onLoad` returns null or is not provided.
 * - `save(draft)` persists a new layout optimistically — local state updates
 *   immediately, then the server write confirms in the background. Reverts on error.
 * - `reset()` resets to `defaultLayout` by calling `onSave(null)`. Reverts on error.
 * - `isSaving` is true while a save/reset is in-flight. Both are no-ops while in-flight.
 *
 * @example
 * ```tsx
 * const { layout, save, reset, isSaving } = usePageLayout(
 *   "dashboard",
 *   DEFAULT_DASHBOARD_LAYOUT,
 *   {
 *     onLoad: async () => {
 *       const res = await fetch("/api/layout?page=dashboard");
 *       const data = await res.json();
 *       return data.layout ?? null;
 *     },
 *     onSave: async (layout) => {
 *       await fetch("/api/layout", {
 *         method: "POST",
 *         body: JSON.stringify({ pageKey: "dashboard", layout }),
 *       });
 *     },
 *     onError: (msg) => toast.error(msg),
 *   }
 * );
 * ```
 */
export function usePageLayout(
  pageKey: string,
  defaultLayout: PageLayout,
  options?: UsePageLayoutOptions,
): UsePageLayoutResult {
  // Distinguish "not provided" (undefined) from "server confirmed no saved layout" (null).
  const serverResolved = options?.initialLayout !== undefined;
  const resolvedInitial = options?.initialLayout
    ? migrateLayout(options.initialLayout, defaultLayout)
    : defaultLayout;

  const [layout, setLayoutState] = useState<PageLayout>(resolvedInitial);
  const [isLoading, setIsLoading] = useState(!serverResolved && !!options?.onLoad);
  const [isSaving, setIsSaving] = useState(false);

  // layoutRef always holds the current layout so async callbacks can read the
  // pre-mutation value without going stale across re-renders.
  const layoutRef = useRef<PageLayout>(resolvedInitial);
  // isSavingRef provides a synchronous guard against double-submit.
  const isSavingRef = useRef(false);

  const onError = options?.onError ?? ((msg: string) => console.error("[usePageLayout]", msg));

  // Wrapper that keeps ref and state in sync atomically.
  const setLayout = useCallback((value: PageLayout) => {
    layoutRef.current = value;
    setLayoutState(value);
  }, []);

  useEffect(() => {
    // Skip fetch when server already resolved the layout or no onLoad provided
    if (serverResolved || !options?.onLoad) return;

    let cancelled = false;
    setIsLoading(true);

    options.onLoad().then((result) => {
      if (cancelled) return;
      if (result !== null && result !== undefined) {
        setLayout(migrateLayout(result, defaultLayout));
      }
      setIsLoading(false);
    }).catch(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const save = useCallback(
    async (draft: PageLayout): Promise<boolean> => {
      if (isSavingRef.current) return false;
      isSavingRef.current = true;
      const prev = layoutRef.current;
      setLayout(draft);
      setIsSaving(true);
      try {
        if (options?.onSave) {
          const result = await options.onSave(draft);
          if (result === false) {
            setLayout(prev);
            onError("Failed to save layout");
            return false;
          }
        }
        return true;
      } catch {
        setLayout(prev);
        onError("Failed to save layout");
        return false;
      } finally {
        isSavingRef.current = false;
        setIsSaving(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageKey, setLayout],
  );

  const reset = useCallback(async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    const prev = layoutRef.current;
    setLayout(defaultLayout);
    setIsSaving(true);
    try {
      if (options?.onSave) {
        const result = await options.onSave(null);
        if (result === false) {
          setLayout(prev);
          onError("Failed to reset layout");
        }
      }
    } catch {
      setLayout(prev);
      onError("Failed to reset layout");
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, defaultLayout]);

  return { layout, isLoading, isSaving, save, reset };
}
