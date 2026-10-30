# Active projects

Keep each active project in a named subdirectory with a README describing purpose, scope, boundaries, evidence, and open questions. Add documents only when there is content and an owner. This repository currently tracks its own extraction project.

Decision records use one stable `decisions/<slug>.md` path within their project.
Use [decision authoring](../skills-hub/hb-skills/hb-add-decision/SKILL.md) for the
metadata and operation contract. An unresolved choice can be recorded without
becoming an operational rule. Current operational documents own executable rules;
Decisions preserve rationale and lineage. Do not create empty directories.

Use [project start](../skills-hub/hb-skills/hb-start-project/SKILL.md) for identity,
minimal context and repair. Semantic audit reads a complete active README within
100 lines and 10,000 characters and stops on larger inputs; supporting depth
belongs in owned documents rather than a superficial capsule. A source relation
ledger is optional compatibility input, not a required project registry.

## Identifier comparison

Run `node scripts/validate_project_overlap.mjs` when establishing project identity.
It compares explicit source identifiers in README metadata and exactly named
Sources/References sections with active and shipped context. Decisions and agent
instructions do not claim project identity. Dormant active projects are excluded;
widely shared channels are reported as ignored. No metadata field is mandatory.
Unrecognized identifiers and unreadable paths remain coverage limits.

Matches are warnings requiring semantic review, never automatic merges or failures.
The optional `project-relations.json` `not_same` array records owner-resolved groups
using `projects-in-progress/<slug>` or `production-features/<slug>` members; legacy
bare slugs mean active projects. Exact member groups are suppressed, not arbitrary
subsets. The semantic controller uses the same identities but still reviews partial
overlap, boundaries and drift. A malformed ledger is an error, not a clean result.
