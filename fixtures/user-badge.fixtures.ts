import type { UserBadgeProps } from "@/registry/new-york/user-badge/user-badge";

export type UserBadgeFixture = Omit<UserBadgeProps, "className">;
type Fixture = UserBadgeFixture;

const BASE: Fixture = {
  name: "Alice Smith",
  username: "alice",
  avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=alice",
  size: "md",
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "With Avatar": BASE,

  "Initial Fallback": fx({
    name: "Bob Creator",
    username: "bob",
    avatarUrl: null,
  }),

  "No Username": fx({
    name: "Charlie",
    username: undefined,
  }),

  "Small": fx({
    size: "sm",
  }),

  "Large": fx({
    size: "lg",
    name: "Travis Worthing",
    username: "laughingwhales",
    avatarUrl: "https://api.dicebear.com/9.x/pixel-art/svg?seed=travis",
  }),

  "Long Name": fx({
    name: "Alexander Bartholomew Constantine III",
    username: "abc3",
    avatarUrl: null,
  }),
};
