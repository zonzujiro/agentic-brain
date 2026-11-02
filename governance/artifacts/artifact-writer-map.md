# Artifact Writer Map

This map answers which workflow is authoritative for each canonical Agentic
Brain artifact. It complements `governance/artifacts/artifact-write-boundary.md`: the boundary
resolves whether a write is allowed, while this map identifies the canonical
writer or finalizer for the artifact.

Skills improve authoring quality, but the artifact contract belongs to the
artifact. Direct edits are allowed only when the artifact's governing docs,
validators, gates, and PR-readiness rules are still satisfied.

## Why This Map Exists

This map prevents two failure modes after an agent understands the user's
intent: asking a redundant permission question for a safe, unambiguous update,
or selecting a nearby skill by intuition. It identifies the existing route only
after the artifact boundary is resolved: the canonical writer, read-only
helpers, required validation, and the narrow cases where a governed direct edit
is allowed.

Skill discovery answers which workflows are available. This map answers whether
a known artifact has one safe owner and write path. If the artifact or route is
not covered here, do not infer one from a skill name or summary; stop and run
`hb-change-impact`.

## Active Artifact Writers

| Artifact | Canonical path | Writer / finalizer | Review and checks | Direct edits |
|---|---|---|---|---|
| Active project | `projects-in-progress/{project}/README.md` | `hb-start-project` | Project contract, identifier comparison, applicable semantic audit | Grounded corrections under the same contract |
| Project brief | `projects-in-progress/{project}/artifacts/project-brief-{project}.md` | `hb-start-project`, then governed updates | Evidence, solution framing and project scope | Yes within authorized scope |
| Decision | `projects-in-progress/{project}/decisions/{slug}.md` | `hb-add-decision` | Decision validator, `hb-review-decision`; impact resolution through `hb-resolve-decision-impact` | Small edits under the Decision contract; meaning changes need review |
| Shipped feature knowledge | `production-features/{feature}/feature-knowledge.md` | `hb-create-feature-doc` | Shipped evidence, surface contract and applicable semantic audit | Yes under the same contract |
| Project archive | `production-features/{feature}/` or `changes/{change}/` | `hb-archive-project` | Shipped confirmation, exact inventory preservation, links, feature writer | Use archive workflow; no ad hoc lossy move |
| Shared reference | `knowledge-hub/{document}.md` or existing governed subtree | `hb-add-knowledge-hub-doc` | Durable evidence, applicability, local contract | Yes under the same contract |
| Product overview | Existing Knowledge Hub target | `hb-create-product-context` | Product template and source coverage | Yes under the specialized contract |
| Skill package | `skills-hub/hb-skills/{skill}/` | `hb-adopt-skill` or governed edit | `hb-review-skill`, package checks and change impact | Yes with package ownership and review preserved |
| Host discovery | `.agents/skills/` and `.claude/skills/` | Reviewed installation / adoption helper's explicit `--link` | Discovery validation | Links only; never independent authored instructions |
| Governance and root guides | `governance/`, `AGENTS.md`, `README.md`, `ARCHITECTURE.md` | Governed repo work | Change impact, relevant evidence and repository checks | Yes within approved change scope |
| Shared mechanics | `scripts/` | Governed repo work | Relevant tests, repository checks and producer review when applicable | Yes within approved change scope |
| Extraction scope and provenance | `projects-in-progress/agentic-brain/` | Governed migration work | Pinned source, per-file adaptations, scope and acceptance checks | Yes; do not edit source Harmony Brain |

## Intake Routing For User-Supplied Facts

Use the table above after resolving the artifact owner. The behavioral rule lives
in [user fact intake](../operations/working-with-users.md#user-supplied-fact-intake).
Project identity and scope go to the project owner; accepted choices go through
the Decision writer; shipped claims go through the feature writer; reusable
lessons go through the shared-knowledge writer. Workflow changes require impact
review and consequential edits to their actual operational owners.

Dedicated delivery-plan, QA/BA, source-sync, notification and site writers are not
installed. Technical RFC authoring is excluded for now; source-PR reconciliation and
dedicated PR follow-through are excluded. Documents written by external tools
still use their applicable standards, evidence/statement/precedent review,
semantic audit and other relevant validation. An unavailable writer is not permission to invent its
contract or claim its checks passed.

## Writer Categories

- **Canonical writer / finalizer**: the preferred workflow for creating or
  finalizing the artifact. If direct edits are made, they must satisfy the same
  contract.
- **Companion workflow**: helps gather evidence, shape content, review, export,
  or sync, but does not own the final canonical artifact.
- **Validator/helper**: deterministic or review workflow that checks or derives
  artifacts without owning the source truth.
- **Legacy**: retained only for migration or history. Do not use for new active
  work unless a new decision reactivates it.

## Direct Edit Rule

Direct edits are not a bypass. They are acceptable only when all of the
following hold:

1. the artifact type and target path are already covered by this map and
   `governance/artifacts/artifact-write-boundary.md`
2. the edit preserves the artifact's governing contract
3. deterministic validators pass when available
4. required gates, preflight, and review rules still run before finalization or
   PR readiness
5. any partial data is represented as a working artifact or local waiver, not
   as fake-complete content

When these conditions do not hold, use the canonical writer or stop for
preflight.
