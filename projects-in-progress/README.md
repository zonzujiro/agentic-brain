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

## Semantic capsule contract

Every active README contains exactly one H1, a non-empty
lead that states the problem or intended outcome, and these sections:

```md
## Scope and responsibilities

## Boundaries and dependencies
```

The required sections state what the project owns, what it does not own, and
which adjacent capabilities or external owners it relies on. The only optional
H2 sections are `Current state`, `Sources`, `Experiments`, and `Open gaps`.
Keep the complete README within 100 lines and 10,000 characters so Stage 1 can
consume it whole rather than relying on excerpts.

Update the capsule when evidence changes the project's problem or outcome,
owned scope or responsibility, boundary or dependency, relationship to another
project, or a mutable project-level fact intentionally kept in the README. A
new internal document, test, task, implementation detail, or ordinary delivery
update does not by itself require a README edit. Before cross-project comparison,
`hb-semantic-project-audit` checks changed project evidence against the capsule
and reports whether the README is aligned, stale, or not assessable from the
available change. It then compares the changed active project against every
other non-dormant active project and shipped production feature in the combined
semantic corpus.

Do not list project-local files merely so readers can discover the folder.
Internal links are allowed only when the linked artifact substantiates a
semantic claim or identifies the canonical source or ownership boundary for a
mutable fact. This avoids an index that silently becomes incomplete whenever a
new document is added.

## Experiments

When experiments, flags or rollout gates affect active project meaning, keep a
concise registry in the project README. Record the experiment's canonical link
or identifier, flag/spec key if known, status, dates, behavior/audience scope,
measurement readiness, report and material caveats. Do not invent missing values.
Keep detailed runtime gating and measurement definitions in their owning sources.
After release, durable experiment history belongs in shipped-feature knowledge.

## Authoring rules

Keep active meaning in its project, shared lessons in the Knowledge Hub, shipped
knowledge in production features and reusable operating rules in governance.
Preserve cross-project boundaries without copying mutable truth. New artifact
families need a resolved owner and contract; do not create empty directories.
The [writer map](../governance/artifacts/artifact-writer-map.md) and
[documentation standards](../governance/artifacts/documentation-standards.md)
provide the authoring routes and shared evidence/consumer requirements.
