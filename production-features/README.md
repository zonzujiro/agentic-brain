# Production Features

Released feature snapshots used as precedent, onboarding context, dependency
reference, and product-alignment grounding.

## Current Shape

Each released feature lives under:

```text
production-features/{feature}/
```

Bootstrap production-feature entries may contain:

```text
production-features/{feature}/README.md
```

The current bootstrap keeps one `README.md` per feature and folds domain context
into that same file.

When a richer Brain-owned shipped-feature doc is authored, it should live at:

```text
production-features/{feature}/feature-knowledge.md
```

That richer file is for shipped or live production knowledge only. Active work
stays in the `projects-in-progress/` flow until it is archived.

`feature-knowledge.md` may summarize stable shipped behavior, source links,
known gaps, and product/UX/BA context. It must not store current implementation
reports, API inventories, runtime-state dumps, coverage snapshots, or ownership
details copied from implementation code as durable Brain truth. Current
implementation evidence belongs to the selected implementation source and should be retrieved from
the implementation repository at a recorded revision on demand when a claim needs it.

Active `projects-in-progress/` material may inform discovery and preserve
lineage, but it is not a reliable source of truth for this stable surface. A
durable production-feature claim must be verified against shipped evidence, a
stable external artifact, a pinned implementation source, or explicit user
confirmation before it is written here.

`hb-archive-project` may move a shipped/live active project into the production
feature surface while preserving the project tree as historical archive
evidence.

For a first shipped feature, the project tree may be preserved directly in the
production feature root:

```text
production-features/{feature}/
  feature-knowledge.md
  README.md
  artifacts/
  engineering/
  quality/
  analytics/
  phases/
  decisions/
  ...other moved project files/folders when present
```

Those moved folders are not active delivery surfaces after archive. They are
retained as source context for future readers and agents.

For a later addition to an existing shipped feature, the moved project tree
lives under a change packet:

```text
production-features/{feature}/
  feature-knowledge.md
  changes/
    {change}/
      README.md
      artifacts/
      engineering/
      quality/
      analytics/
      phases/
      decisions/
      ...other moved project files/folders when present
```

The root `feature-knowledge.md` remains the synthesized shipped-feature view.
Moved engineering or phase files inside an archive packet are historical source
context. They do not make `production-features/` the owner of current
implementation truth.

## Semantic Audit Document

`feature-knowledge.md` is the shipped feature's primary semantic document for
`hb-semantic-project-audit`. Existing bootstrap folders without that document
use `README.md` as a fallback. A meaningful shipped-feature context change is
compared with every other shipped feature and every non-dormant active project;
Stage 2 may inspect other eligible evidence in a shortlisted shipped folder.
The cross-cutting runtime, attestation, and safety contract remains owned by
[`governance/operations/solution-and-impact.md`](../governance/operations/solution-and-impact.md#semantic-project-audit).

## Domain Consolidation

A tightly-coupled domain whose parts share behavior, ownership, and status with
low churn MAY be consolidated into a single domain doc instead of one folder per
member feature:

```text
production-features/{domain}/feature-knowledge.md
```

The consolidated doc states the shared model once and gives each part a stable
section . Rules:

- **Scope guard** — consolidation applies only to tightly-coupled,
  shared-ownership, low-churn domains. When in doubt, keep parts as separate
  feature-slug folders (still the default). Cross-domain shared surfaces stay
  standalone .
- **Pre-removal completeness guard** — a member folder may be removed only after
  its content, including unresolved "not found" gaps, is verified as fully
  carried into the consolidated doc.
- **Promotion-on-demand** — a part is split back into its own folder if it later
  diverges in ownership, lifecycle, or depth.
