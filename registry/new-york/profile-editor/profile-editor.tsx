"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Camera, Pencil, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Current online status for the profile. */
export type ProfileStatus = "online" | "away" | "busy" | "offline";

/** Save/submit state for the editor. */
export type ProfileSaveState = "idle" | "saving" | "saved" | "error";

/** Validation errors keyed by field name. */
export interface ProfileValidationErrors {
  /** Error message for the display name field, or null when valid. */
  displayName?: string | null;
  /** Error message for the bio field, or null when valid. */
  bio?: string | null;
}

export interface ProfileEditorProps {
  /** URL of the avatar image. Falls back to initials when empty. */
  avatarUrl?: string | null;
  /** Display name shown prominently. */
  displayName: string;
  /** Username or handle (e.g. "@laughingwhales"). */
  username?: string;
  /** Short bio or tagline. */
  bio?: string;
  /** Current online status indicator. */
  status?: ProfileStatus;
  /** Whether the editor is in compact layout (settings) vs full layout (onboarding). */
  compact?: boolean;
  /** Whether the profile fields are editable. */
  editing?: boolean;
  /** Current save state of the profile. */
  saveState?: ProfileSaveState;
  /** Error message when saveState is "error". */
  saveError?: string | null;
  /** Whether any field has unsaved changes. */
  isDirty?: boolean;
  /** Field validation errors to display inline. */
  validationErrors?: ProfileValidationErrors;
  /** Called when the display name value changes. */
  onDisplayNameChange?: (value: string) => void;
  /** Called when the bio value changes. */
  onBioChange?: (value: string) => void;
  /** Called when the avatar image is clicked (e.g. to open a picker). */
  onAvatarClick?: () => void;
  /** Called when a file is selected for avatar upload. */
  onAvatarUpload?: (file: File) => void;
  /** Called when the save button is clicked. */
  onSave?: () => void;
  /** Called when the cancel button is clicked. */
  onCancel?: () => void;
  /** Additional class names for the root container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<ProfileStatus, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-400",
  busy: "bg-red-500",
  offline: "bg-zinc-400",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AvatarDisplay({
  avatarUrl,
  displayName,
  status,
  editing,
  size,
  onAvatarClick,
  onFileSelect,
}: {
  avatarUrl?: string | null;
  displayName: string;
  status: ProfileStatus;
  editing: boolean;
  size: "lg" | "xl";
  onAvatarClick?: () => void;
  onFileSelect: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const resolvedAvatar = previewUrl ?? avatarUrl;
  const sizeClass = size === "xl" ? "size-24" : "size-16";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleClick = () => {
    if (onAvatarClick) {
      onAvatarClick();
    } else if (editing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden rounded-full bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          sizeClass,
          editing && "cursor-pointer",
        )}
      >
        {resolvedAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedAvatar}
            alt={displayName}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xl font-semibold text-muted-foreground">
            {getInitials(displayName || "?")}
          </div>
        )}
      </button>

      {/* Edit badge */}
      {editing && (
        <div
          className={cn(
            "absolute bottom-0 right-0 translate-x-[10%] translate-y-[10%] z-20",
            "flex items-center justify-center",
            "size-7 rounded-full bg-primary text-primary-foreground shadow-md",
            "ring-2 ring-background",
            "group-hover:scale-110 transition-transform duration-200",
          )}
        >
          {onAvatarClick ? (
            <Pencil className="size-3.5" />
          ) : (
            <Camera className="size-3.5" />
          )}
        </div>
      )}

      {/* Status dot */}
      <span
        className={cn(
          "absolute top-0 right-0.5 size-3 rounded-full ring-2 ring-background",
          STATUS_COLORS[status],
        )}
      />

      {/* Clear preview */}
      {editing && previewUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="absolute -right-1 -top-1 z-30 rounded-full bg-destructive p-0.5 text-destructive-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="size-3" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Profile editor card with avatar, status indicator, display name, bio,
 * and action buttons. Supports compact (settings) and full (onboarding)
 * layouts, with view and edit modes.
 *
 * Extracted from a production profile editor — pure presentation, zero
 * data fetching, zero side effects.
 *
 * @example
 * ```tsx
 * <ProfileEditor
 *   displayName="Travis Worthing"
 *   username="@laughingwhales"
 *   bio="Building cool things"
 *   status="online"
 *   avatarUrl="/avatar.png"
 *   editing
 *   onDisplayNameChange={(v) => setName(v)}
 *   onSave={() => save()}
 * />
 * ```
 */
export function ProfileEditor({
  avatarUrl,
  displayName,
  username,
  bio,
  status = "offline",
  compact = false,
  editing = false,
  saveState = "idle",
  saveError,
  isDirty = false,
  validationErrors = {},
  onDisplayNameChange,
  onBioChange,
  onAvatarClick,
  onAvatarUpload,
  onSave,
  onCancel,
  className,
}: ProfileEditorProps) {
  const nameError = validationErrors.displayName;
  const bioError = validationErrors.bio;

  const avatar = (
    <AvatarDisplay
      avatarUrl={avatarUrl}
      displayName={displayName}
      status={status}
      editing={editing}
      size={compact ? "lg" : "xl"}
      onAvatarClick={onAvatarClick}
      onFileSelect={(file) => onAvatarUpload?.(file)}
    />
  );

  // ---- Compact layout (settings page) ----
  if (compact) {
    return (
      <div className={cn("w-full max-w-md space-y-5", className)}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          <div className="shrink-0">{avatar}</div>

          <div className="flex-1 w-full space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="pe-display-name"
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
              >
                Name
              </label>
              {editing ? (
                <input
                  id="pe-display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => onDisplayNameChange?.(e.target.value)}
                  aria-invalid={!!nameError}
                  className={cn(
                    "flex h-11 w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none",
                    "transition-colors focus:ring-2 focus:ring-primary/20",
                    nameError
                      ? "border-destructive"
                      : "border-border/50 focus:border-foreground",
                  )}
                />
              ) : (
                <p className="text-sm font-medium">{displayName || "—"}</p>
              )}
              {nameError && (
                <p className="text-xs text-destructive">{nameError}</p>
              )}
            </div>

            {/* Username */}
            {username && (
              <p className="text-sm text-muted-foreground">{username}</p>
            )}

            {/* Bio */}
            {(bio !== undefined || editing) && (
              <div className="space-y-1.5">
                <label
                  htmlFor="pe-bio"
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                >
                  Bio
                </label>
                {editing ? (
                  <textarea
                    id="pe-bio"
                    value={bio ?? ""}
                    onChange={(e) => onBioChange?.(e.target.value)}
                    placeholder="Write a short bio..."
                    rows={2}
                    aria-invalid={!!bioError}
                    className={cn(
                      "flex w-full resize-none rounded-xl border bg-transparent px-3 py-2 text-sm outline-none",
                      "transition-colors focus:ring-2 focus:ring-primary/20",
                      bioError
                        ? "border-destructive"
                        : "border-border/50 focus:border-foreground",
                    )}
                  />
                ) : (
                  bio && <p className="text-sm text-muted-foreground">{bio}</p>
                )}
                {bioError && (
                  <p className="text-xs text-destructive">{bioError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {editing && (onSave || onCancel) && (
          <div className="flex items-center justify-end gap-2">
            {saveError && (
              <p className="flex-1 text-xs text-destructive">{saveError}</p>
            )}
            {saveState === "saved" && (
              <p className="flex-1 text-xs text-emerald-500 font-medium">
                Saved
              </p>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={saveState === "saving"}
                className="rounded-lg border border-border/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={!isDirty || saveState === "saving"}
                className="rounded-lg bg-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {saveState === "saving" ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ---- Full layout (onboarding / standalone) ----
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6",
        className,
      )}
    >
      {/* Avatar centered */}
      <div className="flex flex-col items-center gap-3">
        {avatar}
        {editing && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            Tap to change
          </span>
        )}
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="pe-display-name-full"
          className="text-sm font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Name
        </label>
        {editing ? (
          <input
            id="pe-display-name-full"
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChange?.(e.target.value)}
            placeholder="e.g. Alice Smith"
            aria-invalid={!!nameError}
            className={cn(
              "flex h-12 w-full rounded-xl border-2 bg-transparent px-3 py-2 text-lg outline-none",
              "transition-colors focus:ring-2 focus:ring-primary/20",
              nameError
                ? "border-destructive"
                : "border-border/50 focus:border-foreground",
            )}
          />
        ) : (
          <h3 className="text-lg font-semibold">{displayName}</h3>
        )}
        {nameError ? (
          <p className="text-xs text-destructive">{nameError}</p>
        ) : (
          editing && (
            <p className="text-xs text-muted-foreground/50">
              Shown on your profile
            </p>
          )
        )}
      </div>

      {/* Username */}
      {username && (
        <p className="text-sm text-muted-foreground">{username}</p>
      )}

      {/* Bio */}
      {(bio !== undefined || editing) && (
        <div className="space-y-1.5">
          {editing ? (
            <textarea
              value={bio ?? ""}
              onChange={(e) => onBioChange?.(e.target.value)}
              placeholder="Write a short bio..."
              rows={3}
              aria-invalid={!!bioError}
              className={cn(
                "flex w-full resize-none rounded-xl border-2 bg-transparent px-3 py-2 text-sm outline-none",
                "transition-colors focus:ring-2 focus:ring-primary/20",
                bioError
                  ? "border-destructive"
                  : "border-border/50 focus:border-foreground",
              )}
            />
          ) : (
            bio && (
              <p className="text-center text-sm text-muted-foreground">
                {bio}
              </p>
            )
          )}
          {bioError && (
            <p className="text-xs text-destructive">{bioError}</p>
          )}
        </div>
      )}

      {/* Actions */}
      {editing && (onSave || onCancel) && (
        <div className="flex flex-col items-center gap-2">
          {saveError && (
            <p className="text-xs text-destructive">{saveError}</p>
          )}
          {saveState === "saved" && (
            <p className="text-xs text-emerald-500 font-medium">
              Profile saved
            </p>
          )}
          <div className="flex gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={saveState === "saving"}
                className="rounded-lg border border-border/50 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={!isDirty || saveState === "saving"}
                className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {saveState === "saving" ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
