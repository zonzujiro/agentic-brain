---
name: hb-change-impact
description: |
  Assess a proposed or observed Agentic Brain content change before canonical
  writes. Use when changed evidence may make another project or document stale,
  when sources contradict each other, when the user asks what a change affects,
  or when a proposal may change durable Brain behavior such as a skill,
  workflow, validator, artifact shape, path, source of truth, ownership, or
  governance rule.
---


# Change Impact

Turn one concrete change signal into an evidence-backed impact result and an
approved route to the existing owning writers. This is the single flow for
both content drift and durable Brain behavior changes.

Do not create a second preflight or correct-course flow. The durable-behavior
question is one check inside this assessment.

## Input

`$ARGUMENTS` may provide a proposed change, an observed contradiction, changed
repo-relative files, an accepted answer that closes an open question in any
governed Brain artifact, or source evidence that may invalidate current Brain
content. If the concrete change is not known, ask for the missing delta or
evidence. Do not infer a change from a filename, link title, or vague concern.

## Quality Gates

Use the shared gates in `governance/quality/quality-gates.md` and the evidence policy in
`governance/quality/evidence-policies.md`.

Run gates before:

- recommending canonical edits
- approving a durable behavior change
- presenting a conflict as established fact
- preparing PR evidence for a meaning-changing update

Evidence focus:

- the concrete before/after delta or observed change signal
- the canonical owner of the changed claim
- deterministic candidates from relationships, Decision `affected_docs`,
  exact repo references, and shared source identifiers
- for durable behavior changes, the affected-population definition, the query
  or inventory method used to enumerate it, and the resulting count
- current content of each material candidate
- one disposition for every material consumer in the affected population
- migration, rollout, rollback, remaining consumers, and approval after those
  effects were presented
- governing sources when the durable-behavior check is positive

Report target:

- chat
- the PR description when the assessment supports a PR

Waiver rule:

- a source conflict, unresolved ownership boundary, or required evidence gap
  stays visible and cannot be silently waived by the agent
- only the user may approve a durable behavior change or waive a waivable gate

## Deterministic Candidate Discovery

For repo files, run the bundled detector once with every changed path:

```sh
node skills-hub/hb-skills/hb-change-impact/scripts/discover-change-impact.mjs \
  --changed projects-in-progress/example/prd.md
```

Run the detector in its own tool call, separate from file-reading loops and
other shell commands. Its completed command and output are the observable
record that candidate discovery ran.

Add `--json` when another script needs structured output. The detector returns
candidates, not semantic conclusions. It batches one repository scan and uses
only explicit signals:

- Decision `affected_docs`
- exact repo-path references
- source URLs and ticket-style source identifiers shared with the changed file
- paths that may change durable Brain behavior

The scan covers current Brain surfaces, shared scripts, and root contracts.
Hidden directories and symlinks are not traversed; external sources and host
configuration need explicit inspection when relevant. The output reports the
scan count, not complete impact coverage. Baseline content uses Git HEAD by
default; pass `--baseline` for another revision. A missing baseline is visible
in each changed-path result and limits removed-source discovery.

Never label a candidate as stale or contradictory until its claims have been
read and compared.

## Producer Conflict Review

Use this review for skills used in Brain, including refreshed vendored skills,
and Brain-owned machinery that may create, update, export, or publish durable or
externally consumed artifacts. Internal temporary packets and logs do not
count as outputs for this review.
It applies across disciplines. Run it while a producer is proposed or
meaningfully changed, before approving that machinery. Describe the output
contract it proposes: purpose, intended readers, mutable facts, owner,
expected local path or pattern, and any external destination.

Do not edit a vendored skill to resolve a finding. Route the correction to a
Brain-owned extension or adoption choice, or to its upstream owner.

Use the bundled controller with an explicit comparison base:

```sh
node skills-hub/hb-skills/hb-change-impact/scripts/producer-conflict-audit.mjs prepare --base=origin/main --no-working-tree
```

For a local proposed skill, omit `--no-working-tree` and select `--target=<path>`.
Supply `--output-path=<path>` or `--output-label=<external output>` when the intended
output is not explicit in the source. External outputs require actual source-linked
read evidence, not a fabricated snapshot; absent evidence remains a coverage gap.
The optional `--external-evidence-file` accepts an array of objects with `id`,
`for_output`, `source` and bounded `text` fields, in temporary storage.

Read the returned prompt, packet and schema. Write only the declared result file,
then run `advance --session=<path>`. If Stage 2 is requested, compare only the
supplied pairs and run `finalize --session=<path>` after writing its result.
Continue every batch until the aggregate result is returned. Use `cancel` when
abandoning a session. The controller validates coverage, citations and unchanged
inputs; the agent judges meaning. Its compatibility field `writer_map` carries
the current write-boundary contract, not a historical Decision.

No automatic push interception or CI attestation guard is installed. Optional
`--push` is permitted only after all batches and actual delivery authorization;
never invent `--approved-by` or a resolution to pass a gate. The semantic audit
and this producer review have separate results.

For each proposed output, establish its purpose, reader, mutable facts,
canonical owner, and update lifecycle. Compare possible matches in existing
skill instructions, current surface contracts, and existing artifacts. Raise any
material conflict, including competing writers, contradictory facts or rules, duplicated mutable
information, unclear authority, or a reader unable to tell which output to
trust. An inaccessible external output is an evidence gap. Do not call similar
names a conflict without comparing their responsibilities.

If the result says `needs-user`, show each conflict and gap with the concrete
evidence and a recommended resolution. Ask why the new output is needed and
whether the existing artifact can be reused or become the single editable
source. Do not approve the proposed producer until the user resolves material
findings within their scope; route other ownership decisions to the owner. A
clear result can proceed through the normal gates.
Preserve concrete findings, the actual resolution and approving owner in the
existing review record. Recheck after material changes. A review does not itself
authorize a commit, push, PR, or external write.

## Affected Population For Durable Changes

The detector is a fast explicit-signal shortlist. It is never the complete
scope of a durable behavior review by itself.

When the durable-behavior check is positive, define the affected population
from what changes, not only from which files mention the changed path. Run a
bounded repo query or inventory for the applicable classes below and record the
method and count:

| Changed behavior | Population to inventory |
|---|---|
| Artifact shape, schema, template, or required content | Existing artifact instances; canonical writers and finalizers; templates and generators; validators; readers, renderers, and published views |
| Validator, gate, or CI rule | Every accepted input and invoking workflow; positive and negative fixtures; bypass or waiver paths; current in-flight PRs or artifacts that may be revalidated |
| Skill or workflow | Natural-language triggers and direct callers; produced artifacts; downstream handoffs; sibling trigger conflicts; current in-flight uses when discoverable |
| Source-of-truth or ownership boundary | Current writers; duplicated or derived copies; consumers; history/migration owners; cross-project and cross-discipline authority boundaries |
| Storage path, generated output, or index | Existing instances; incoming links; generators; indexes; publication and retrieval consumers; rename/archive behavior |
| Decision or governance policy | `affected_docs`; operational owners; rules and artifacts that enforce the old answer; current work approved under the prior contract |

Add every materially connected instance as a manual candidate even when it
does not link back to the governing file. Do not read every enumerated file in
full when a bounded query proves it unaffected, but preserve that query and
count as evidence. Read every material instance deeply enough to compare the
changed claim.

Classify each material consumer as exactly one of:

- `update now`
- `unaffected` with evidence
- `intentionally retained` with reason and owner
- `migrate separately` with destination and owner
- `route to owner` because the current scope does not authorize the write
- `blocked` by evidence, conflict, ownership, or user decision

An unclassified material consumer blocks approval and implementation. A
partial rollout is allowed only when the retained or deferred population is
explicit, owned, and included in rollout and rollback reasoning.

## Decision Tree

1. Confirm the change.
   - If no concrete delta or evidence exists, stop and ask the user for it.
   - If the edit is meaning-neutral (formatting, spelling, generated output),
     route it to the owning writer and mechanical validator. Stop the semantic
     assessment.
   - If the input is an accepted answer that has not yet been recorded, keep
     the source artifact unchanged until this flow classifies the answer and
     any required pre-write gates pass.
2. Resolve the canonical owner, target path, and claims whose meaning changed.
3. Discover explicit candidate consumers once using the bundled detector.
4. Ask: **Would this change durable Brain behavior?** Durable behavior includes
   workflow or skill behavior, validation or gate rules, artifact shape or
   storage path, source-of-truth or ownership boundaries, and durable
   governance policy.
   - If yes, read the full governance chain required by root `AGENTS.md`, state
     the current operational rule and intended end state, use Decisions for rationale and contradiction review,
     define and enumerate the affected population above, and wait for user
     approval after presenting the population, dispositions, migration,
     rollout, and rollback.
   - If no, use the evidence lanes and writer contract of the affected artifact.
5. Add manual candidates from the affected-population inventory. Compare each
   changed claim with the current claims in every material candidate and give
   every material consumer exactly one disposition. Then classify the overall
   result as no material impact, one stale document, multiple stale documents,
   source contradiction, blocked evidence, or a durable
   rule/ownership/boundary change.
6. For each material effect, resolve the affected project, artifact owner,
   response discipline, and the current user's explicitly grounded scope. Do
   not infer authority from an agent role, repository access, a filename,
   a project team alone, or an unresolved owner label. Coordinated cross-role
   work is allowed when the current conversation makes that coordination
   explicit. Scope is established when the conversation states that the named
   response is coordinated with the relevant owner, delegated to the current
   user by that owner, or owned by the current user. A bare request to change
   another discipline or project, participation, team membership, or asking
   about an effect does not establish that scope.
7. When sources contradict each other, show the conflicting claims. Ask the
   current user which source should govern only when their grounded scope covers
   that choice. Otherwise route an owner review or handoff and keep the conflict
   blocked. Do not choose silently and do not invent an "owning human."
8. Present only evidence-backed actions and their expected effects before
   canonical writes. A valid result may recommend one action, several real
   alternatives, or no further action. When another discipline's or project's
   response is outside the confirmed scope, route it as an owner review or
   handoff instead of asking the current user to decide or commit for that
   owner, and leave a cross-project target unchanged. When explicit coordination
   puts the response inside the confirmed scope, use the existing owning writer
   after the current request or a later answer approves that action within the
   confirmed scope, instead of forcing a redundant handoff. Use `hb-resolve-decision-impact` only for confirmed Decision affected-document
   entries; it does not rediscover impact or turn Decisions into operational owners.
9. Validate the changed artifacts and rerun both explicit candidate discovery
   and the affected-population inventory.
10. Run a distinct read-only final review from the resulting diff and the
    original before/after claim. The same agent may perform this pass when
    delegation is unavailable, but it must rebuild the population and challenge
    the dispositions instead of reusing the author's conclusion. Do not report
    completion while any material consumer is unclassified, any required owner
    route is missing, or rollout/rollback does not cover retained work.
11. Report updated, unaffected, intentionally retained, separately migrated,
    owner-routed, and blocked consumers. Preserve the inventory method, count,
    and remaining population in PR evidence.

Read [`references/review-checklist.md`](references/review-checklist.md) before
performing the semantic comparison.

## User-Facing Output

In chat, lead with what was resolved or changed. Then explain the material
effect, recommendation, and ownership limitation in plain language. Separate
paragraphs with blank lines and use a short bullet list only when several
effects or next steps are easier to scan.

Do not expose an internal authority table, gate report, or artifact-routing
schema by default. Translate it into language such as:

```md
I recorded that autosave failures use an inline Retry state.

This also affects retry behavior and QA coverage. You do not need to make those
calls: R&D should confirm feasibility, and QA should review the failure cases.

Another project may be affected. I left it unchanged because its owner is not
part of the confirmed scope. I can prepare a short handoff explaining the
impact.

My recommendation is to update the UX definition now and keep the technical
dependency visible until its owner confirms it.
```

For a local or informational answer, say that no further action is needed and
why. Do not invent alternatives or downstream work merely to make the response
look complete.

## PR Output

Use the smallest shape that preserves the decision:

```md
## Change Impact: Pass | Approval Needed | Blocked

Change: {concrete before/after meaning-changing delta}
Affected population: {change class, inventory method, count, and material consumers}
Disposition: {counts or concise list for update, unaffected, retained, migrated, owner-routed, and blocked}
Durable behavior: No | Yes — {rule and operational owner}
Rollout and rollback: {migration order, in-flight compatibility, rollback, or why none applies}
Remaining consumers: {none, or every retained, deferred, owner-routed, or blocked consumer}
Approval: {who approved which disclosed effects and when, or the exact approval still needed}
```

For a meaning-neutral edit, a one-line `Change Impact: not required` reason is
enough. For a PR, preserve the approved result or the not-required reason in
the `## Change Impact` section.

## Guardrails

- Treat source repositories as read-only unless the user separately authorizes edits.
- Do not create a global registry, shared queue, backlink, or durable change
  proposal by default.
- Do not duplicate mutable source truth into a consumer project.
- Do not infer ownership, recipients, or missing paths.
- Do not turn project or discipline impact into an assignment for a user who
  does not own that response.
- Do not treat project-team membership, repository access, or an agent role as proof that the current user may decide for another discipline or
  project.
- Do not let hooks or scripts judge semantic truth. They discover candidates;
  the agent compares claims and the user resolves genuine source conflicts.
- Do not decide the scope first and use the detector or passing validators to
  justify it afterward. Mechanical success never proves that the affected
  population or dispositions are complete.
- Do not claim approval when the user has not yet seen the material population,
  migration, rollout, rollback, and remaining-consumer consequences.
- Do not create, comment on, or otherwise mutate a PR without the user's
  explicit approval for that exact action.
