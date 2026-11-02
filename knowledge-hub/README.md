# Knowledge Hub

Shared Harmony reference context for humans and agents.

## Purpose

Use `knowledge-hub/` for durable cross-feature reference material that remains
useful beyond one active project workspace.

This is the general project reference layer. It complements:

- `projects-in-progress/` for in-flight project work
- `production-features/` for shipped feature snapshots
- scoped decision trees under `projects-in-progress/` for project decisions and
  Agentic Brain governance
- `skills-hub/` for reusable agent skills

It does not own shipped feature catalog content.

## Optional First-Level Families

- `product/` - reusable product context
- `ux/` - reusable UX context
- `ba/` - reusable BA context

These are optional organizational examples, not required directories. Small
Brains may keep references directly in the hub. Each family can grow
gradually and get a narrower contract later if needed.

## Authoring Rules

- Keep `knowledge-hub/` for durable shared shared reference context.
- Put repo workflow and Brain operating-model instructions under the matching
  responsibility in `governance/`, not here.
- Keep active project work under `projects-in-progress/`.
- Keep shipped or live feature snapshots under `production-features/`.
- Preserve local subtree conventions instead of forcing one global schema
  across `product/`, `ux/`, and `ba/`.
- When a doc makes factual claims where ownership, source, or freshness
  matters, ground those claims explicitly or surface the gap instead of filling
  it with guesses.

## Reading Rules

- Read selectively.
- Prefer the directly relevant subtree and entry file.
- Do not bulk-read the whole hub by default.
