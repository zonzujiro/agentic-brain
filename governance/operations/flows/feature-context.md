# Feature And Knowledge Flows

### 1. Active feature or project work

Use `projects-in-progress/{project}/`.

Typical flow:

1. Start or resolve the project workspace.
2. Ground the problem, product intent, design, and solution choice in the relevant
   sources. Use [solution framing](../solution-and-impact.md#solution-frame-checkpoint)
   before treating an implementation mechanism as an accepted requirement.
3. Resolve downstream inputs from canonical evidence. A handoff is a navigation
   aid, not a prerequisite or a second source of truth. Read the underlying
   sources and preserve unresolved inputs as gaps.
4. Keep project-local Decisions inside the same project tree.
5. Keep cross-project meaning in existing canonical product, Decision,
   technical, or shipped-feature evidence. Do not copy mutable status, summaries,
   source links, or delivery facts between projects. Relationship classifications
   require explicit review; detection does not write them.

Canonical references:

- [README.md](../../../README.md)
- [Artifact writer map](../../artifacts/artifact-writer-map.md)

### 2. Shipped feature knowledge

Use `production-features/{feature}/`.

This surface is for released or live feature knowledge that should remain
available for precedent lookup, onboarding, and cross-checking after delivery.

Completed active projects leave `projects-in-progress/` through
`hb-archive-project` after explicit shipped/live confirmation. A first-release
archive may preserve the moved project tree directly under
`production-features/{feature}/`; a later addition to an existing shipped
feature uses `production-features/{feature}/changes/{change}/`. In both cases,
`feature-knowledge.md` remains the synthesized shipped-feature view and is
created or updated through `hb-create-feature-doc`.

Canonical references:

- [production-features/README.md](../../../production-features/README.md)

### 3. Durable shared reference context

Use `knowledge-hub/`.

This surface is for reusable shared reference material that is useful
across time and features, such as:

- product overviews
- UX guidance
- measurement definitions and KPI references

Canonical references:

- [knowledge-hub/README.md](../../../knowledge-hub/README.md)
