# 🧠 Agentic Brain

A foundation for building your own version-controlled context system for people
and AI agents. Use one project or many while preserving the operating model: evidence,
decisions, roles, flows, reusable workflows and explicit ownership.

Follow the presentation for more details, if you want.

https://zonzujiro.github.io/agentic-brain-deck

## Current state

Private extraction in progress. This is the first working foundation, not a
complete release or a drop-in replacement for its source, Harmony Brain.
No open-source license or publication clearance has been established yet.

Available now: evidence and communication guidance, fifteen adapted workflows,
Codex and Claude discovery, document-standard, source-link, Decision, skill and root checks, identifier-overlap reporting, bounded
semantic/producer controllers, reviewed adoption and optional local Git checks. Deterministic tests
and hosted CI support the mechanics; agent review still owns meaning.

Local agent hooks and delivery guards are implemented and configured; SessionStart has been observed in this chat; other event activation
remains unverified pending host trust and trials. Access recording and portable model trials are implemented with explicit coverage
limits; current model trials are blocked by CLI compatibility and Claude login. The [T2 inventory](projects-in-progress/agentic-brain/t2-mechanics.md)
separates retained mechanics, tested host behavior and remaining migration work.

## 🚀 Start here

- [How Brain works](governance/reference-architecture/how-brain-works.md)
- [Architecture and authority](ARCHITECTURE.md)
- [Operating rules and flows](governance/operations/repo-workflows.md)
- [Creator/Builder roles](governance/operations/roles/agent-role-guidance.md)
- [Documentation standards to use and extend](governance/artifacts/documentation-standards.md)
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

## 🗂️ What's here

- **Current work** — [active projects](projects-in-progress/README.md) hold scope, boundaries and decisions.
- **Shared knowledge** — [Knowledge Hub](knowledge-hub/README.md) keeps reusable context.
- **Shipped features** — [production features](production-features/README.md) preserve released behavior and precedent.
- **How the Brain works** — [governance](governance/README.md) and [skills](skills-hub/README.md) maintain the operating model.

## 🌱 Build your own Brain

The intended experience is to choose your purpose, sources of truth, project
structure, and optional workflows. The project starter and a sandbox onboarding exercise are available. A worked fictional lifecycle is available in onboarding. A complete
Brain initializer remains tracked in the task list; do
not treat this checkout as a finished template.
