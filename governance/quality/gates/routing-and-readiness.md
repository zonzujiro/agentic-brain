# Routing And Write-Readiness Gates

## Gate: surface-routing - Surface Routing

**Question:** Has the artifact write boundary resolved the right surface and
target path?

**Why this gate exists:** Wrong surface choices create duplicate sources of
truth. Agents must not guess where durable context belongs or choose artifact
paths ad hoc.

Agent steps:

1. Resolve the artifact write boundary from
   [artifact-write-boundary.md](../../artifacts/artifact-write-boundary.md).
2. Write down the artifact type, target path, maturity state, and owning
   workflow or skill before drafting.
3. Classify the content type against the canonical Surface map in
   [repo-workflows.md](../../operations/repo-workflows.md). Do not maintain or consult a
   second copy of that table.
4. If the target path does not match the content type, stop and repair the
   target before writing.
5. If the artifact type or target path is not covered by an existing rule, stop
   and run `hb-change-impact` instead of inventing a new shape.

Pass when:

- The target path matches exactly one required surface.
- The write-boundary resolution names artifact type, target path, maturity
  state, owning workflow or skill, and existing-artifact handling.
- The output says why that surface was selected when the choice is not obvious.

Fail when:

- The target path is missing.
- The artifact type or maturity state is unresolved.
- The output mixes two canonical surfaces without a stated reason.
- Active project state is being written to `knowledge-hub/`.
- Workflow guidance is being written to `knowledge-hub/`.
- A POC or provisional label is used to place an artifact type in a surface that
  does not normally own it.

Record:

- `artifact_type`
- `target_path`
- `content_type`
- `maturity_state`
- `selected_surface`
- `owning_workflow_or_skill`
- `existing_artifact_handling`
- `routing_result`

## Gate: consumer-contract - Consumer Contract

**Question:** Does the output give downstream consumers what they need?

**Why this gate exists:** A document can look complete while still failing the
next discipline.

Agent steps:

1. Identify the document type.
2. Open the relevant standard or template for that document type.
3. List required sections or required mappings.
4. For each required section, check whether the content answers the section, not
   only whether the heading exists.
5. If a required section is missing, add it, mark it as a gap, or request a
   waiver.

Pass when:

- Required sections exist.
- Required sections contain useful content or explicit gaps.
- Required IDs/mappings are present where required.

Fail when:

- Required headings exist but are empty or generic.
- An output lacks a mapping required by its actual consumer contract.
- BI requirements list events without trigger points.
- Tech design has a risk section with no risks and no "no known risks" note.

Record:

- document type
- standard/template checked
- missing sections
- missing mappings
- waivers or gaps

## Gate: boundary - Boundary

**Question:** Does the output respect repo and discipline ownership boundaries?

**Why this gate exists:** Brain should aggregate and validate context without
silently taking ownership from external sources, implementation repos, or
discipline-specific workflows. Mechanical path checks belong to the artifact
write boundary and `surface-routing`; `boundary` covers ownership and
source-of-truth boundaries that cannot be reduced to path mechanics.

Agent steps:

1. Identify every repo/surface the output reads from.
2. Identify every repo/surface the output writes to.
3. Verify Brain writes only to Agentic Brain hot storage.
4. Verify external implementation sources is read-only.
5. Verify externally owned artifacts are not mutated by Brain extraction logic.
6. Verify PM, UX, R&D, QA, and BA ownership is preserved.
7. Verify the write boundary did not hide a source-of-truth, discipline, or
   repository ownership change behind a valid-looking path.
8. Verify `production-features/` writes do not claim ownership of current
   implementation truth that belongs to external implementation sources code, tests, or package
   docs.
9. If the boundary is unclear, stop and turn it into a decision question.

Pass when:

- Reads and writes stay within allowed boundaries.
- Any boundary-sensitive choice is explained.

Fail when:

- Brain writes to external implementation sources.
- Brain puts derived extraction files into externally owned artifact folders.
- PM/UX/QA/BA/R&D ownership is reassigned without decision.
- Implementation tooling is moved into Brain because it is convenient.
- A mechanically valid path is used to change the canonical owner of content
  without a decision.
- A current implementation report, API inventory, coverage snapshot, or runtime
  state dump is stored as durable `production-features/` truth instead of
  remaining external implementation sources evidence.

Record:

- read surfaces
- write surfaces
- owner of the final artifact
- source-of-truth owner
- boundary concerns or decision questions

## Gate: write-readiness - Write Readiness

**Question:** Is the resolved target ready for the requested maturity
transition?

**Why this gate exists:** A polished but weak output should not become a Brain
artifact. `write-readiness` uses the write-boundary resolution as input; it
does not repeat path approval.

Agent steps:

1. Confirm the artifact write boundary has a target path, maturity state,
   owning workflow or skill, and existing-artifact handling.
2. Name the requested transition: working save, provisional save, canonical
   write, finalization, or PR readiness.
3. Review all gate statuses for that transition.
4. If any required gate is `fail`, do not write/finalize.
5. If any required gate is `blocked`, do not write/finalize unless the user
   explicitly waives the blocked lane and accepts a partial output.
6. If the user waives a gate, record the waived gate, reason, and risk.
7. For PR-bound work, inspect the actual diff and run the deterministic checks
   that match the changed surface.
8. For batch work, verify each target has its own boundary resolution and
   readiness state.
9. Choose one final readiness state.

Allowed final readiness states:

| State | Use when |
|---|---|
| `ready` | All required gates pass. |
| `ready with explicit gaps` | Non-blocking gaps remain and are visible in the output; no required gate is failed or blocked. |
| `blocked` | Required evidence or decision input is missing. |
| `waived by user` | The user explicitly accepts a permitted gate failure. |

Pass when:

- Boundary resolution is complete for the requested transition.
- Final readiness state is recorded.
- Gaps and waivers are visible in the output.

Fail when:

- Boundary resolution is missing or contradicts the target write.
- The output is written after a failed required gate.
- The output is written after a blocked required gate without an explicit user
  waiver.
- A PR-ready state is claimed while required source access or cross-reference is
  still blocked.
- A PR-ready state is claimed from a batch summary without per-target gate
  records.
- Blocked evidence is hidden in private reasoning.
- Waiver risk is not preserved in the output.
- A working or provisional artifact is treated as canonical.

Record:

- write-boundary resolution reference
- requested transition
- final readiness state
- failed/blocked gates
- gaps preserved in output
- user waivers, if any
