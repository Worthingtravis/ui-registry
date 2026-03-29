"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  RefreshCw,
  Type,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// DiceBear types & helpers (self-contained, no external lib needed)
// ---------------------------------------------------------------------------

/** Supported DiceBear v9.x avatar styles. */
export type AvatarStyle =
  | "bottts-neutral"
  | "adventurer"
  | "fun-emoji"
  | "pixel-art"
  | "thumbs"
  | "shapes"
  | "rings"
  | "identicon";

/** Style option for the style picker pills. */
export interface AvatarStyleOption {
  /** DiceBear style ID. */
  id: AvatarStyle;
  /** Human-readable label. */
  label: string;
}

/** All available avatar styles. */
export const AVATAR_STYLES: AvatarStyleOption[] = [
  { id: "pixel-art", label: "Pixel Art" },
  { id: "bottts-neutral", label: "Robots" },
  { id: "fun-emoji", label: "Emoji" },
  { id: "adventurer", label: "Adventurer" },
  { id: "thumbs", label: "Thumbs" },
  { id: "shapes", label: "Shapes" },
  { id: "rings", label: "Rings" },
  { id: "identicon", label: "Identicon" },
];

const DEFAULT_STYLE: AvatarStyle = "pixel-art";

/** Parse "style:seed" → { style, seed }. Plain seeds default to pixel-art. */
export function parseSeedWithStyle(raw: string): {
  style: AvatarStyle;
  seed: string;
} {
  const idx = raw.indexOf(":");
  if (idx === -1) return { style: DEFAULT_STYLE, seed: raw };
  const maybeStyle = raw.slice(0, idx);
  if (AVATAR_STYLES.some((s) => s.id === maybeStyle)) {
    return { style: maybeStyle as AvatarStyle, seed: raw.slice(idx + 1) };
  }
  return { style: DEFAULT_STYLE, seed: raw };
}

/** Encode style + seed as "style:seed" for storage. */
export function encodeSeedWithStyle(
  style: AvatarStyle,
  seed: string,
): string {
  return `${style}:${seed}`;
}

/** Build a DiceBear v9.x SVG URL. */
export function buildAvatarUrl(seed: string, style?: AvatarStyle): string {
  if (style) {
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  }
  const parsed = parseSeedWithStyle(seed);
  return `https://api.dicebear.com/9.x/${parsed.style}/svg?seed=${encodeURIComponent(parsed.seed)}`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AvatarPickerProps {
  /** The currently selected encoded seed (e.g. "pixel-art:my-seed"). */
  currentSeed: string;
  /** URL of a custom-uploaded avatar, or null. */
  currentAvatarUrl?: string | null;
  /** Base subject string used for generating seed batches (e.g. username). */
  subject?: string;
  /** Number of avatars per batch in the grid. */
  gridCount?: number;
  /** Number of grid columns. */
  columns?: number;
  /** Whether to show the upload tab. */
  allowUpload?: boolean;
  /** Called immediately when an avatar is clicked. Receives the encoded seed. */
  onSelect?: (encodedSeed: string) => void;
  /** Called when a file is selected for upload. */
  onUpload?: (file: File) => void;
  /** Called when the uploaded avatar is removed. */
  onRemoveUpload?: () => void;
  /** Additional class names for the root container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AvatarCell({
  src,
  selected,
  onClick,
}: {
  src: string;
  selected: boolean;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-xl p-1.5 transition-all hover:bg-muted/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        selected && "ring-2 ring-primary bg-primary/10",
      )}
    >
      {!loaded && (
        <div className="size-full aspect-square rounded-lg bg-muted animate-pulse" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={cn(
          "size-full aspect-square rounded-lg transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0 absolute inset-1.5",
        )}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </button>
  );
}

function GeneratedTab({
  subject,
  currentSeed,
  onSelect,
  gridCount,
  columns,
}: {
  subject: string;
  currentSeed: string;
  onSelect: (encodedSeed: string) => void;
  gridCount: number;
  columns: number;
}) {
  const parsed = parseSeedWithStyle(currentSeed);
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(parsed.style);
  const [batch, setBatch] = useState(0);
  const [customSeed, setCustomSeed] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [debouncing, setDebouncing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const seeds = useMemo(() => {
    const result: string[] = [];
    for (let i = 0; i < gridCount; i++) {
      result.push(`${subject}-b${batch}-${i}`);
    }
    return result;
  }, [subject, batch, gridCount]);

  // Debounced custom seed — fires onSelect after 800ms of inactivity
  useEffect(() => {
    if (!showCustom) return;
    const trimmed = customSeed.trim();
    if (!trimmed) {
      setDebouncing(false);
      return;
    }

    setDebouncing(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSelect(encodeSeedWithStyle(selectedStyle, trimmed));
      setDebouncing(false);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [customSeed, selectedStyle, showCustom, onSelect]);

  return (
    <div className="space-y-3">
      {/* Style pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap"
        style={{ scrollbarWidth: "none" }}
      >
        {AVATAR_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => setSelectedStyle(style.id)}
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all",
              "border border-border/50 hover:border-primary/50",
              selectedStyle === style.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/30 text-muted-foreground",
            )}
          >
            {style.label}
          </button>
        ))}
      </div>

      {/* Custom seed input */}
      {showCustom && (
        <div className="relative animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            value={customSeed}
            onChange={(e) => setCustomSeed(e.target.value)}
            placeholder="Type any word or phrase..."
            autoFocus
            className="flex h-10 w-full rounded-xl border border-border/50 bg-muted/20 px-3 pr-9 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-foreground transition-colors"
          />
          {debouncing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="size-4 animate-spin text-primary" />
            </div>
          )}
        </div>
      )}

      {/* Avatar grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {seeds.map((seed) => {
          const encoded = encodeSeedWithStyle(selectedStyle, seed);
          const url = buildAvatarUrl(seed, selectedStyle);
          return (
            <AvatarCell
              key={`${selectedStyle}-${seed}`}
              src={url}
              selected={currentSeed === encoded}
              onClick={() => onSelect(encoded)}
            />
          );
        })}
      </div>

      {/* More + Custom toggles */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setBatch((b) => b + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RefreshCw className="size-3.5" />
          More
        </button>
        <span className="text-border">|</span>
        <button
          type="button"
          onClick={() => setShowCustom((s) => !s)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            showCustom && "text-primary",
          )}
        >
          <Type className="size-3.5" />
          Custom Seed
        </button>
      </div>
    </div>
  );
}

function UploadTab({
  currentAvatarUrl,
  onUpload,
  onRemoveUpload,
}: {
  currentAvatarUrl: string | null;
  onUpload: (file: File) => void;
  onRemoveUpload: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayUrl = preview ?? currentAvatarUrl;

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("File too large (max 5 MB)");
        return;
      }
      setError(null);
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setError(null);
    onRemoveUpload();
  }, [onRemoveUpload]);

  return (
    <div className="space-y-4">
      {displayUrl ? (
        <div className="flex flex-col items-center gap-4 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt="Avatar preview"
            className="size-32 rounded-2xl object-cover ring-2 ring-border/50"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <Upload className="size-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-destructive transition-colors hover:border-destructive/30"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-3 py-12",
            "border-2 border-dashed border-border/60 rounded-2xl",
            "cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all",
          )}
        >
          <Upload className="size-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Drop image or click to browse
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-widest">
              PNG, JPEG, WebP, GIF &middot; Max 5 MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-sm text-destructive text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Avatar picker with generated (DiceBear) avatars and optional file upload.
 *
 * Clicking an avatar immediately fires `onSelect` with the encoded seed.
 * The consumer controls confirmation — wrap this in a dialog, sheet, or
 * use it inline. Includes style pills, paginated grid, custom seed input,
 * and a drag-and-drop upload area.
 *
 * Self-contained — bundles its own DiceBear URL builder and seed encoding.
 *
 * @example
 * ```tsx
 * <AvatarPicker
 *   currentSeed="pixel-art:my-seed"
 *   subject="username"
 *   onSelect={(seed) => setSeed(seed)}
 *   onUpload={(file) => uploadAvatar(file)}
 *   onRemoveUpload={() => removeAvatar()}
 * />
 * ```
 */
export function AvatarPicker({
  currentSeed,
  currentAvatarUrl = null,
  subject = "avatar",
  gridCount = 20,
  columns = 5,
  allowUpload = true,
  onSelect,
  onUpload,
  onRemoveUpload,
  className,
}: AvatarPickerProps) {
  const [activeTab, setActiveTab] = useState<"generated" | "upload">(
    "generated",
  );

  const previewUrl = currentAvatarUrl ?? buildAvatarUrl(currentSeed);

  return (
    <div className={cn("w-full max-w-lg space-y-4", className)}>
      {/* Current avatar preview */}
      <div className="flex items-center gap-3 py-2">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Selected avatar"
            className="size-16 rounded-2xl ring-2 ring-border/30 bg-muted/30"
          />
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          {currentAvatarUrl ? "Uploaded photo" : "Current avatar"}
        </p>
      </div>

      {/* Tabs */}
      {allowUpload && (
        <div className="flex border-b border-border/50">
          <button
            type="button"
            onClick={() => setActiveTab("generated")}
            className={cn(
              "flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors border-b-2",
              activeTab === "generated"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            Generated
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={cn(
              "flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors border-b-2",
              activeTab === "upload"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            Upload
          </button>
        </div>
      )}

      {/* Tab content */}
      {activeTab === "generated" ? (
        <GeneratedTab
          subject={subject}
          currentSeed={currentSeed}
          onSelect={(seed) => onSelect?.(seed)}
          gridCount={gridCount}
          columns={columns}
        />
      ) : (
        <UploadTab
          currentAvatarUrl={currentAvatarUrl ?? null}
          onUpload={(file) => onUpload?.(file)}
          onRemoveUpload={() => onRemoveUpload?.()}
        />
      )}
    </div>
  );
}
