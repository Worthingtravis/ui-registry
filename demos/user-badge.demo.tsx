"use client";

import { UserBadge } from "@/registry/new-york/user-badge/user-badge";
import { ALL_FIXTURES, type UserBadgeFixture } from "@/fixtures/user-badge.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = UserBadgeFixture;

const propsMeta: PropMeta[] = [
  { name: "name", type: "string", required: true, description: "Primary display name" },
  { name: "username", type: "string", required: false, description: "Username/handle shown in parentheses" },
  { name: "avatarUrl", type: "string | null", required: false, description: "Avatar image URL (falls back to initial)" },
  { name: "size", type: '"sm" | "md" | "lg"', required: false, defaultValue: '"md"', description: "Size variant" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { UserBadge } from "@/registry/new-york/user-badge/user-badge"

<UserBadge name="Alice Smith" username="alice" avatarUrl="/avatar.png" />
<UserBadge name="Bob" size="sm" />

{/* In a list */}
{users.map(u => (
  <UserBadge key={u.id} name={u.name} username={u.handle} avatarUrl={u.avatar} />
))}`;

export const config: PreviewLabConfig<Fixture> = {
  title: "User Badge",
  description:
    "Compact user identity display with avatar (or initial fallback), display name, and optional username handle.",
  tags: ["user", "avatar", "badge", "identity"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-3 py-4">
      <UserBadge {...fixture} />
      <div className="flex flex-col gap-2 border-t border-border/40 pt-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">All sizes</span>
        <UserBadge {...fixture} size="sm" />
        <UserBadge {...fixture} size="md" />
        <UserBadge {...fixture} size="lg" />
      </div>
    </div>
  ),
  propsMeta,
};
