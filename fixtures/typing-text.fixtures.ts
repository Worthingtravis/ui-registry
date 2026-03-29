import type { TypingTextProps } from "@/registry/new-york/typing-text/typing-text";

export type TypingTextFixture = Omit<TypingTextProps, "className">;
type Fixture = TypingTextFixture;

const BASE: Fixture = {
  text: "git commit -m 'initial commit'",
  delay: 300,
  duration: 1200,
};

const fx = (overrides: Partial<Fixture>): Fixture => ({ ...BASE, ...overrides });

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Standard": BASE,
  "Short + fast": fx({ text: "pnpm dev", delay: 0, duration: 300 }),
  "Long command": fx({
    text: "curl -sL https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/install.sh | bash",
    delay: 100,
    duration: 2000,
  }),
};
