# Governance And Skill Flows

### 1. Repo-shaping governance work

Use `projects-in-progress/agentic-brain/`.

This surface owns:

- repo-shaping decisions
- repo-wide governance changes
- extraction scope, task acceptance criteria, provenance, and supporting design context

Canonical references:

- [projects-in-progress/agentic-brain/README.md](../../../projects-in-progress/agentic-brain/README.md)

### 2. Shared skill behavior

Use `skills-hub/` for canonical authored skill definitions.

Use `.agents/skills/` as the installed Codex discovery index over `skills-hub/`.
It is a symlink surface, not an authored source. Other host indexes need their
own installation and verification.

Canonical references:

- [skills-hub/README.md](../../../skills-hub/README.md)

### 3. Governing instructions

Use `governance/`, then select the folder that owns the responsibility:
`operations/`, `artifacts/`, `quality/`, `skills/`, `onboarding/`, or the
explanatory `reference-architecture/` layer.

This surface contains the instructions that make the repo operate as one
system. Each responsibility has an explicit folder so unrelated guidance does
not accumulate in one flat collection.

Examples:

- operating flow -> `governance/operations/`
- document or artifact boundary -> `governance/artifacts/`
- evidence or validation rule -> `governance/quality/`
- reusable-architecture explanation -> `governance/reference-architecture/`
