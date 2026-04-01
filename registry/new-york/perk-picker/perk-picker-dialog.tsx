"use client";

import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { PerkPicker, type SelectedPerk } from "@/registry/new-york/perk-picker/perk-picker";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PerkPickerDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the dialog should close */
  onClose: () => void;
  /** Called with the final selection on confirm */
  onConfirm: (perks: SelectedPerk[]) => void;
  /** Initial perk selection (pre-populated slots) */
  initialValue?: SelectedPerk[];
  /** Lock to killer or survivor perks */
  role?: "killer" | "survivor";
  /** Maximum perk slots (default 4) */
  maxSlots?: number;
  /** Dialog title */
  title?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Modal dialog wrapping the PerkPicker. Opens with initial perks pre-filled,
 * allows editing, then confirms or cancels.
 *
 * Uses a native `<dialog>` element for accessibility (Escape to close,
 * focus trapping, backdrop click to cancel).
 *
 * @example
 * ```tsx
 * <PerkPickerDialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={(perks) => { updateBuild(perks); setIsOpen(false); }}
 *   initialValue={currentPerks}
 *   role="killer"
 *   title="Edit Killer Build"
 * />
 * ```
 */
export function PerkPickerDialog({
  open,
  onClose,
  onConfirm,
  initialValue = [],
  role,
  maxSlots = 4,
  title,
}: PerkPickerDialogProps) {
  const [draft, setDraft] = useState<SelectedPerk[]>(initialValue);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  // Sync draft when dialog opens with new initial value
  useEffect(() => {
    if (open) {
      setDraft(initialValue);
    }
  }, [open, initialValue]);

  // Open/close the native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Handle native close (Escape key, etc.)
  const handleDialogClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Backdrop click — close on click outside the content
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  const handleConfirm = useCallback(() => {
    onConfirm(draft);
  }, [draft, onConfirm]);

  const roleLabel = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
      className={cn(
        // Reset native dialog styles + responsive sizing
        "m-0 w-[calc(100vw-2rem)] max-w-3xl rounded-2xl border border-border bg-background p-0 shadow-2xl shadow-black/40",
        // Height: use most of the viewport, flexbox inside handles scroll
        "h-[calc(100dvh-4rem)] max-h-[800px]",
        // Center via fixed positioning
        "fixed inset-0 mx-auto my-auto",
        // Backdrop
        "backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        // Animation
        "open:animate-in open:fade-in-0 open:zoom-in-95",
      )}
    >
      <div className="flex h-full flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {title ?? "Select Perks"}
            </h2>
            {roleLabel && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {roleLabel} perks only
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Picker body — single scroll container */}
        <div className="@container min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <PerkPicker
            value={draft}
            onChange={setDraft}
            role={role}
            maxSlots={maxSlots}
          />
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {draft.length}/{maxSlots} perks selected
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground",
                "transition-colors hover:bg-muted hover:text-foreground",
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={cn(
                "rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background",
                "transition-colors hover:bg-foreground/90",
              )}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
