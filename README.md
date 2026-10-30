# Agentic Brain

A foundation for building your own version-controlled context system for people
and AI agents. Start small: one project, its evidence, and the decisions that
matter. Add workflows when there is a real need.

## Current state

Private extraction in progress. This is the first working foundation, not a
complete release or a drop-in replacement for its source, Harmony Brain.
No open-source license or publication clearance has been established yet.

Available now: evidence and communication guidance, source-link and footnote
validation, a dependency-free test suite, passing hosted foundation checks, and
seven explicitly readable [workflows](skills-hub/README.md).
The full skill catalog, host hooks, connector adapters, and model evaluations
are not installed or implemented here yet.

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
structure, and optional workflows. The initializer and complete worked example
are tracked in the task list; do not treat this checkout as a finished template.
