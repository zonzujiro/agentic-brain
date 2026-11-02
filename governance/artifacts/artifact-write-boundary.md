# Artifact Write Boundary

This doc defines the pre-write boundary for Agentic Brain artifacts.

Use it before creating, moving, or materially updating any Brain artifact. It is
an agent-applied repository safety check before file edits. It does not
replace quality gates, source grounding, review, or PR readiness.

## Purpose

Agentic Brain does not yet have a deterministic artifact API. Until it does,
agents must resolve the write boundary explicitly so repo mechanics do not
depend on memory.

The write boundary answers:

- what kind of artifact is being written
- which surface owns that artifact
- which exact path is allowed
- whether the artifact is working, provisional, or canonical
- which workflow or skill owns the write
- what existing artifact or duplicate handling is required
- which gates still apply before finalization or PR readiness

If the boundary cannot be resolved from the operating rules, surface README,
or an implemented workflow contract, stop the dependent write and follow the
change proposal process in [operating rules](../operations/repo-workflows.md).
Use [change-impact review](../../skills-hub/hb-skills/hb-change-impact/SKILL.md).
Use the [writer map](artifact-writer-map.md) for installed routes and explicit
unavailable writers.

## When It Runs

Run write-boundary resolution before:

- creating a new repo artifact
- moving an artifact
- renaming a canonical or working artifact
- materially updating an artifact's canonical path, maturity state, or owner
- writing generated or helper files into a Brain surface

It is usually not needed for:

- quick read-only answers
- formatting-only edits that do not change artifact shape, path, maturity,
  owner, or contract
- updating prose inside an already-resolved target when the owning workflow has
  not changed

## Required Resolution

Record these fields in chat, the owning workflow's evidence record, the
working artifact, or the PR body depending on the workflow:

| Field | Meaning |
|---|---|
| Artifact type | The kind of thing being written, such as shipped-feature knowledge, Knowledge Hub reference, skill helper script, decision, or gate guidance. |
| Owning surface | The repo surface that owns this artifact type. |
| Target path | The exact path to create, move, or update. |
| Maturity state | `working`, `provisional`, or `canonical`. |
| Owning workflow or skill | The workflow or skill responsible for the write and later finalization. |
| Existing-artifact handling | Whether the target exists, whether the write updates it, creates a sibling, supersedes it, or needs user choice. |
| Later gates | Gates still required before source-grounded drafting, canonical write, finalization, or PR readiness. |

Use the smallest visible record that is useful for the workflow. A short chat
line is enough for simple writes; durable or gated workflows should preserve the
resolution in the gate report, working artifact, or PR summary.

## Surface rules

[Architecture](../../ARCHITECTURE.md) defines surface responsibilities. Read the
target surface README for its current admitted contents; do not copy the source
repository's broader path exceptions. Current routes are:

| Artifact | Owner |
|---|---|
| Developing project context | `projects-in-progress/{project}/` |
| This extraction's scope, tasks and provenance | `projects-in-progress/agentic-brain/` |
| Reusable knowledge | `knowledge-hub/` |
| Knowledge about confirmed delivered work | `production-features/` |
| Operating rules, evidence and checks | `governance/` |
| Reusable workflow instructions and their local helpers | `skills-hub/hb-skills/{skill}/` |
| Shared deterministic mechanics and tests | `scripts/` |

Resolve exact document names through the surface or owning workflow; a broad
surface route does not approve every nested artifact shape. Root-path validation admits the current surfaces and repository configuration
files listed in `scripts/lib/hooks/surfaces.mjs`. Restricted executable, binary and data formats require an explicit owning path
in that shared module. Scripts, host configuration, test/evaluation fixtures and
existing machine data contracts are admitted; arbitrary code or data files in
knowledge and project prose surfaces are rejected. The writer map is agent
guidance, not a deterministic write API. The configured structured-write hook uses the
same root rules; actual host activation remains unverified. Repository checks cover only
the checks documented in [quality gates](../quality/quality-gates.md).

Same-repository application implementation is an unresolved setup choice. Do not
infer either permission or a permanent prohibition from this extraction layout.

## Maturity States

Use these states for write-boundary resolution:

| State | Meaning | Write-boundary behavior |
|---|---|---|
| `working` | Document-like non-canonical work that may resume later. | Must use the `*.working.md` suffix and live next to the valid canonical target. |
| `provisional` | Temporary non-document artifact used to learn, such as a helper script or concept file. | Must live in a surface that already owns that artifact type. |
| `canonical` | Source-of-truth Brain artifact ready for downstream use after required gates. | Must use the canonical path and pass the applicable checks before finalization or PR readiness. |

`*.working.md` is only for document-like artifacts. Code, package manifests,
binaries, scripts, and helper files do not become valid inside documentation
surfaces by adding working metadata.

Decisions use the [stable Decision contract](../../skills-hub/hb-skills/hb-add-decision/SKILL.md),
with no working suffix or lifecycle folders. Do not infer approval from a canonical
filename or an unresolved choice.

## Existing-Artifact Handling

Before writing:

1. Check whether the exact target path already exists.
2. If it exists, classify the write as update, replacement, rename, or
   conflict.
3. Run duplicate or overlap checks required by the current surface contract
   and its validator; consult Decisions only for rationale and lineage.
4. If the current contract has no duplicate rule, do not invent a fuzzy duplicate scan as
   a hard gate. Record exact-target handling and any obvious ambiguity.
5. When the choice changes accepted truth, canonical structure, or user-facing
   scope, ask the user instead of choosing silently. Recording a user-supplied
   fact into its owning artifact is not a silent change of accepted truth; ask
   only when the write would be lossy, exceed the stated fact, or the owner is
   ambiguous. See the user-supplied fact intake rule in
   [repo-workflows.md](../operations/repo-workflows.md).

## Relationship to checks

Path resolution precedes content review. Apply the current
[quality gates](../quality/quality-gates.md) to evidence, source authority,
contradictions, downstream effects, and the requested maturity transition.
A valid path is not evidence that content is true, approved, delivered, or ready
for publication. Preserve unavailable checks as explicit gaps.

## User Visibility

Agent-repairable placement mistakes should usually be repaired before the user
sees them.

Show the user only when:

- the intended artifact type is ambiguous
- more than one valid target exists
- the write changes canonical truth or accepted scope
- a required source, permission, or user decision is blocked
- the user must choose between update, rename, split, defer, or proceed

Do not turn every repaired routing mistake into user homework.

## Examples

- A helper for this workflow belongs beside its skill under `scripts/`.
- A cross-project evidence rule belongs in governance, not shared product knowledge.
- A delivery claim without confirmation remains unresolved even if its proposed
  path is under `production-features/`.
- A new application package needs the unresolved setup choice addressed first;
  calling it a prototype does not establish an owner.
