# Agentic Brain

A foundation for building your own version-controlled context system for people
and AI agents. Start small: one project, its evidence, and the decisions that
matter. Add workflows when there is a real need.

## Current state

Private extraction in progress. This is the first working foundation, not a
complete release or a drop-in replacement for its source, Harmony Brain.
No open-source license or publication clearance has been established yet.

Available now: evidence and communication guidance, fifteen adapted workflows,
Codex repository discovery, source-link and Decision checks, bounded semantic and
producer audit controllers, and optional local Git checks. Deterministic tests
and hosted CI support the mechanics; agent review still owns meaning.

Agent tool hooks, automatic audit enforcement, connector adapters and model
evaluations are not installed. The [T2 inventory](projects-in-progress/agentic-brain/t2-mechanics.md)
separates retained mechanics, tested host behavior and remaining migration work.

## Start here

- [How Brain works](governance/reference-architecture/how-brain-works.md)
- [Architecture and authority](ARCHITECTURE.md)
- [Operating rules](governance/operations/repo-workflows.md)
- [Extraction scope](projects-in-progress/agentic-brain/scope.md)
- [Tasks and acceptance criteria](projects-in-progress/agentic-brain/tasks.md)

## Check the checkout

Use Node.js 24 or newer. There are no npm dependencies to install for this slice.

```sh
npm test
npm run check
```

The checks inspect files; they do not verify the truth of their contents or
observe external connector calls. The check command does not rewrite files.

## Build your own Brain

The intended experience is to choose your purpose, sources of truth, project
structure, and optional workflows. The project starter and a sandbox onboarding exercise are available. A complete
Brain initializer and worked lifecycle are still tracked in the task list; do
not treat this checkout as a finished template.
