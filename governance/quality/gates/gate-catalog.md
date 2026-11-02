# Quality Gate Catalog

Use [named profiles](gate-profiles.md) for required and blocking gate sets.
Use [source lanes](../evidence/source-lanes.md) for evidence, not as a substitute
for gate selection. Installed writers retain their local transition and waiver
rules. These are agent-applied review contracts, not automatic profile validation.

| Workflow family | Profile | Evidence focus |
|---|---|---|
| Project, product, shipped and shared knowledge authoring | `standard-authoring` | Current project meaning, actual source contents, applicable stable/shipped evidence and consumer needs |
| Decision review and durable governance | `governed-change` | Current operational owners, exact relevant Decisions, affected population and approval |
| Skill review and adoption | `skill-change` | Package source, dependencies, competing producers, ownership and host assumptions |
| Artifact write resolution | `boundary-resolution` | Actual target, surface contract, existing content and writer |
| Change impact | `change-impact` | Before/after claims, explicit candidates plus full affected population |

A reusable source-grounded answer still needs source readiness, grounding,
cross-reference, freshness and ownership review appropriate to its claims.
Add artifact/consumer review when it is intended for a concrete document.

## Decision Workflow Checks

A Decision has no lifecycle transition. Gates protect what the author is doing
to the stable file and whether anyone is about to act on its answer.

| Operation | Required check posture | Blocking result |
|---|---|---|
| Discussion and shaping | Normal reasoning; read obvious prior Decisions when needed. | None. Continue shaping. |
| Create the stable file | Resolve `decisions/{slug}.md`, validate required metadata and one plain-English `## Decision`, and run a scaled `hb-review-decision` contradiction pass. | Do not save at an ambiguous/colliding path or hide an unresolved contradiction as fact. |
| Clarify evidence, options, or questions | Run only checks relevant to the changed claims and keep `summary` aligned with `## Decision`. | Block the unsafe claim or boundary change, not honest unresolved content. |
| Record or change the answer, rejection, or supersession | Run the full Decision profile and `hb-review-decision`; validate lineage and actual affected paths. | Do not treat the answer as operational while direction-changing questions, contradictions, grounding failures, or boundary gaps remain. |
| Review a linked Decision set | Review the highest-risk Decision deeply; tightly scoped linked Decisions may reuse its evidence, but still check lineage, contradictions, boundary, and their own answer. | Any linked Decision with a new rule or unresolved contradiction needs its own full review. |
| Implement a concrete choice | Run the gate profile for every affected document, skill, validator, template, config, or PR surface. | Stop the affected implementation until its surface-specific gates pass or a permitted waiver is recorded. |

A Decision may preserve open questions, weak assumptions, blocked sources,
candidate directions, and unresolved options. When `## Decision` says no choice
has been made, the file is historical context rather than accepted rationale and
must not activate `affected_docs`.

Decision records are not governing sources for future action. When an answer
changes behavior, `write-readiness` requires the consequential updates to the
owning docs, skills, validators, templates, or config before the behavior is
treated as operational.
