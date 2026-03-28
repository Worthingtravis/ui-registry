import type { TypingTextProps } from "@/registry/new-york/typing-text/typing-text";

export type TypingTextFixture = Omit<TypingTextProps, "className">;
type Fixture = TypingTextFixture;

const BASE: Fixture = {
  text: "npx shadcn@latest add step-flow",
  delay: 300,
  duration: 1200,
};

const fx = (overrides: Partial<Fixture>): Fixture => ({ ...BASE, ...overrides });

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Install command": BASE,
  "Short text": fx({ text: "pnpm dev", delay: 200, duration: 400 }),
  "Hello world": fx({ text: "Hello, World!", delay: 200, duration: 600 }),
  "Long command": fx({
    text: "curl -sL https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/install.sh | bash",
    delay: 100,
    duration: 2000,
  }),
  "Fast typing": fx({ text: "npm run build", delay: 0, duration: 200 }),
};
