# UI Registry — Ralph Loop Prompt

You are iterating on `/mnt/ssd/development/ui-registry`, a production-grade shadcn component registry. Each loop iteration: pick the next incomplete task, do the work, verify, commit, exit.

## Component Addition Process

**Use the `/add-component` skill** for the full step-by-step process, architecture reference, shadcn rules, fixture/demo patterns, and validation checklist. The skill at `.claude/skills/add-component/SKILL.md` is the single source of truth.

## Loop Iteration

Each iteration should pick ONE task and complete the full cycle:

1. **New component** — run `/add-component {name}` to follow the full process
2. **Improve existing** — add variants, fix JSDoc, improve demos, enhance accessibility
3. **Verify** — `npx tsc --noEmit` and `pnpm run build:registry` must both pass
4. **Commit** — one clean commit per component/change

## What To Work On

Look at what's incomplete or could be improved:
1. New components from sacred-v3 that would be useful (check `~/development/twitch-mcp/src/app/components/`)
2. Existing components missing variants
3. Demos that aren't interactive (static renders with no-op callbacks)
4. Component JSDoc quality — ensure every prop has a JSDoc comment
5. Accessibility audit — keyboard navigation, aria labels

Pick the highest-impact incomplete item, do the work, verify, commit.

Output `<promise>REGISTRY COMPLETE</promise>` when there is nothing left to improve.
