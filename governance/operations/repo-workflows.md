# Agentic Brain Repo Workflows

This doc is the initial operating contract for Agentic Brain repo work. It
explains how agents and contributors should classify tasks, choose the owning
workflow, and route writes before touching repo artifacts.

Agentic Brain is a highly conventioned repo. Do not improvise workflow, paths,
artifact shape, validation, or source-of-truth rules.

Use this doc before starting Agentic Brain work, not only when path routing is
already unclear.

## Before Any Agentic Brain Work

For every Agentic Brain task:

1. Identify the task type: read, author, review, source discovery, decision,
   skill change, validation change, repo-governance
   change, or PR work.
2. Identify the owning flow or skill. If a source-repo skill exists for that
   task, use it instead of hand-rolling the workflow.
   Use [artifact-writer-map.md](../artifacts/artifact-writer-map.md) when the artifact
   owner is not obvious.
3. For artifact writes, resolve the
   [artifact write boundary](../artifacts/artifact-write-boundary.md) before file edits:
   artifact type, owning surface, target path, maturity state, owning workflow
   or skill, existing-artifact handling, and later gates.
4. Read the target surface contract before drafting or editing. Use the surface
   map and file-shape table below to validate the target.
5. Run the required quality-gate and evidence-policy flow before writing,
   reviewing, or opening a PR when the task is gated.
6. If no written convention exists for the intended path, file shape, section
   shape, validation rule, or source-of-truth boundary, stop and ask the user or
   run `/hb-change-impact`. Do not create a new convention by example.

Quick read-only questions may stop after task classification when they do not
create reusable guidance, source-grounded claims for later work, or repo
changes. If a simple task becomes artifact-producing or contract-shaping,
continue through the rest of this operating contract before writing or
finalizing.

## Operational Rule Ownership

Every durable operational rule has one maintained owner. The owner is the
surface that future agents and automation execute from: root `AGENTS.md` for
the canonical boot contract, a surface-local `AGENTS.md` for surface-internal
rules, a `governance/` contract organized by operating responsibility, a skill-local
contract for workflow-specific behavior, or a validator, schema, template,
config, or script for a mechanical contract.

Non-owner surfaces may keep only what their local consumer needs:

- a direct pointer or trigger that routes to the owner
- a local delta that does not restate the shared rule
- runtime enforcement that identifies the governing rule it enforces
- literal template content required in an output
- an explicitly labeled orientation summary where onboarding needs one

Do not maintain independent explanatory copies, enums, or tables that future
changes would have to synchronize. Update the operational owner first, then
update its pointers, local deltas, enforcement, or generated projections.

Navigation should normally be direct links from the consumer to the owner. Do
not introduce a universal rule index. Generate a projection only when a
complete structured owner already exists and the projection can be reproduced
without hand-maintained facts; otherwise keep one explicit document owner.

### Agent instruction files

`AGENTS.md` owns instructions for agent behavior and short, direct navigation
links. It must not store information owned by another Brain artifact: project
scope or requirements, research findings, technical design or API details,
implementation state, ownership assignments, delivery plans, estimates,
allocations, dates, rollout status, or the substance of decisions. Writing a
project fact as a command (such as “do not expand beyond these features”) does
not make it an agent instruction. Read and link to that fact's owner instead.

Keep genuine local operating rules in `AGENTS.md` when that file owns them.
For rules owned elsewhere, keep only a task trigger and a direct pointer.
Do not turn navigation into a second artifact inventory or add summaries that
must be synchronized with source documents. This boundary also applies to
generated project context maps in instruction files.

Brain-owned instruction files are named `AGENTS.md` only. Do not add
`CLAUDE.md` aliases or copies; supported harnesses load `AGENTS.md` directly.
Vendored upstream aliases follow the vendored-file rule below.

Before removing an existing copy, verify that its substantive information is
preserved at the owner. Route unique current information through that
artifact's writer; retain uncertainty and historical status instead of
promoting an old snapshot into current truth. Preserve vendored upstream
instruction files and apply Brain's boundary through Brain-owned extensions.

Project-local instruction files are optional. Create or retain one only when
it owns a necessary project-specific agent instruction that is not already
inherited or owned elsewhere. Omit the file when there is no such instruction;
do not create boilerplate, a navigation-only placeholder, or a reminder to
read the project README. An absent project-local instruction file is not an
incomplete project start and must not trigger repair.

## Decision Records And Governing Sources

Decision records are durable records of a choice: the problem, rationale,
alternatives considered, approval, and lineage. They are not governing sources
for future agent action.

When a decision changes repo behavior, the decision must be followed by the
consequential edits that make the behavior operational:

- workflow and surface rules -> `governance/`
- skill behavior -> `skills-hub/**/SKILL.md` or skill-local references/scripts
- validation behavior -> validators, tests, schemas, or fixture contracts
- runtime configuration -> explicit config or data files owned by the relevant
  surface
- artifact shape and ownership -> `governance/artifacts/artifact-write-boundary.md` and
  `governance/artifacts/artifact-writer-map.md`

After those consequential edits land, downstream agents and scripts must read
the governing docs, skills, validators, templates, or config. They must not take
operational action solely because a decision record says so.

Decision links are still useful for rationale, contradiction checks, lineage,
and historical audit. Read relevant Decision records to understand why a rule exists
or whether a new proposal conflicts with earlier choices. Do not treat a
decision body as the maintained copy of the rule.

Decision metadata such as `affected_docs` may identify consequential surfaces
that need review. It does not carry the operational rule; the reviewed surfaces
must still be updated directly when behavior changes.

Do not backpropagate new decisions into older decision records just to keep
historical rationale current. A new decision may name an earlier decision it
extends, supersedes, rejects, or deliberately leaves untouched. The maintained
behavior belongs in the consequential governing surfaces above.

## Operating Policies

Read the policy page that matches the decision or operation in front of you. They are the maintained continuation of this operating contract; do not load unrelated policies by default.

- [Working with users during repo operations](./working-with-users.md) — gates during WIP, checkpoints, user-supplied facts, and resolved open questions.
- [Solution framing and change impact](./solution-and-impact.md) — solution frames, evidence timing, impact assessment, and semantic project audit.
- [Interaction roles](./roles/agent-role-guidance.md) — Creator/Builder detail preferences, not permissions.
- [Brain checkout freshness](./flows/brain-checkout-freshness.md) — current-default-branch review and the implemented checker and host-activation boundary.

## File And Folder Shape Contract

Use only the documented shapes below unless a surface README, skill-local
contract, validator, or approved change-impact result explicitly allows another
shape.

Before creating, moving, or materially updating one of these shapes, resolve the
artifact write boundary. The table below tells you which shapes are allowed;
`artifact-write-boundary.md` tells you what must be recorded before the write.

| Work type | Canonical shape |
|---|---|
| Active project workspace | `projects-in-progress/{project}/README.md` |
| Classified relations between projects | `projects-in-progress/project-relations.json`; human-authored classifications and merge lineage, read by overlap detection and never written by it |
| Project brief | `projects-in-progress/{project}/artifacts/project-brief-{project}.md` |
| Project Decision | `projects-in-progress/{project}/decisions/{slug}.md`; one stable file with no lifecycle folder, `.working` suffix, or status metadata |
| Decision supporting material | Preserve decision-relevant evidence in the Decision itself. Route independently reusable material to an already-governed canonical surface; when none covers it, stop and run `hb-change-impact` instead of creating `reviews/` or another new folder. Every direct child of `decisions/` is a Decision Markdown file. |
| Repo-shaping governance workspace | `projects-in-progress/agentic-brain/README.md` |
| Shipped feature snapshot | `production-features/{feature}/README.md` |
| Rich shipped feature knowledge | `production-features/{feature}/feature-knowledge.md` |
| First-release project archive | `production-features/{feature}/` preserving the moved `projects-in-progress/{project}/` tree beside `feature-knowledge.md` |
| Existing-feature change archive | `production-features/{feature}/changes/{change}/` preserving the moved project tree for a shipped/live addition |
| Durable shared reference | `knowledge-hub/{document}.md`, or an existing governed subtree |
| Repo operating guidance | `governance/{operations,artifacts,quality,reference-architecture}/...` |
| Source-repo skill package | `skills-hub/hb-skills/{skill}/SKILL.md` |
| Installed host skill discovery | `.agents/skills/` and `.claude/skills/` symlinks over `skills-hub/` |
| Shared mechanics and tests | `scripts/` |

Do not add new top-level folders, new project-local artifact families, new
document types, new Decision lifecycle metadata/folders, or new generated-index content unless the
change has been approved through the relevant contract or preflight path.

The table is the reference for *proposing* a path, not a validator: a project
file that matches no row is not thereby wrong. `projects-in-progress/agentic-brain`
is the repo-shaping governance workspace and carries repo-governance working
documents (scope, tasks, provenance and working design drafts) that no feature
project should copy. Optional project-local instruction files follow the
[Agent instruction files](#agent-instruction-files) boundary. Treat an unmatched path as unclassified rather
than as drift, and only propose a move when the target row is unambiguous.

## Surface map

This is the canonical surface-routing table. Other documents (root
`AGENTS.md`, the `surface-routing` gate in `quality-gates.md`) point here
instead of carrying copies; `README.md` and `ARCHITECTURE.md` may keep labeled
non-canonical orientation summaries. Surface-internal rules live in each
surface's own `AGENTS.md`.

| Surface | Use it for | Do not use it for |
|---|---|---|
| `projects-in-progress/` | active project work, project briefs, decisions, and repo-shaping Agentic Brain governance work | shipped feature snapshots, broad reusable reference context |
| `production-features/` | shipped feature knowledge and precedent lookup | active delivery work, cross-feature reusable guidance |
| `knowledge-hub/` | durable shared shared reference context | repo workflow docs, active project work, shipped feature snapshots |
| `skills-hub/` | canonical shared skill definitions | end-user feature docs or product context |
| `governance/` | cross-cutting operating, artifact, quality, skill, onboarding, and reference-architecture guidance | feature content, shared product/UX/BA reference knowledge |

## Common Flows

Open only the flow matching the task.

- [Feature and knowledge flows](./flows/feature-context.md)
- [Governance and skill flows](./flows/governance-and-skills.md)
- [Pull request flows](./flows/pr-operations.md)

## Quick routing rules

Routing is not write approval. Resolve the artifact type, maturity, owning
workflow, exact target, existing-artifact handling and later gates through the
write-boundary contract. Keep current implementation and external-system truth
at their owners; read them when a claim requires them.

## Date format

This section owns the repo-authored date policy. Templates may retain required
date literals and the write-time advisor may enforce this policy; other prose
surfaces should point here instead of maintaining field or exception lists.

Use `DD.MM.YYYY` for human-facing dates, including Decision creation, impact
resolution, reviews and gate reports. Machine timestamps and external contracts
retain their specified formats. An edit date is not a source-reverification date.
Do not rewrite historical evidence solely for formatting.

## Related high-level repo docs

- [README.md](../../README.md) — orientation, setup, structure, and skill entrypoints
- [ARCHITECTURE.md](../../ARCHITECTURE.md) — high-level repo and cross-repo storage
  model
- [artifact-write-boundary.md](../artifacts/artifact-write-boundary.md) — pre-write
  artifact boundary resolution
- [artifact-writer-map.md](../artifacts/artifact-writer-map.md) — canonical writer,
  companion workflow, validator, and direct-edit map for Brain artifacts
