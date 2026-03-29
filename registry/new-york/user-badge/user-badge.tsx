import React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Size variant for the badge. */
export type UserBadgeSize = "sm" | "md" | "lg";

export interface UserBadgeProps {
  /** Primary display name. */
  name: string;
  /** Username or handle shown in parentheses when different from name. */
  username?: string;
  /** Avatar image URL. Falls back to initial when empty. */
  avatarUrl?: string | null;
  /** Size of the avatar and text. */
  size?: UserBadgeSize;
  /** Additional class names for the root element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

const AVATAR_SIZES: Record<UserBadgeSize, string> = {
  sm: "size-5 text-[9px]",
  md: "size-6 text-[10px]",
  lg: "size-8 text-xs",
};

const TEXT_SIZES: Record<UserBadgeSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Compact user identity display with avatar (or initial fallback),
 * display name, and optional username handle.
 *
 * @example
 * ```tsx
 * <UserBadge name="Alice Smith" username="alice" avatarUrl="/avatar.png" />
 * <UserBadge name="Bob" size="sm" />
 * ```
 */
export function UserBadge({
  name,
  username,
  avatarUrl,
  size = "md",
  className,
}: UserBadgeProps) {
  const initial = name.charAt(0).toUpperCase();
  const showUsername = username && username !== name;

  return (
    <span className={cn("inline-flex items-center gap-1.5 min-w-0", className)}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className={cn(AVATAR_SIZES[size], "rounded-full object-cover shrink-0")}
        />
      ) : (
        <span
          className={cn(
            AVATAR_SIZES[size],
            "rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0",
          )}
        >
          {initial}
        </span>
      )}
      <span className={cn("truncate", TEXT_SIZES[size])}>{name}</span>
      {showUsername && (
        <span className="truncate text-muted-foreground text-xs">
          (@{username})
        </span>
      )}
    </span>
  );
}
