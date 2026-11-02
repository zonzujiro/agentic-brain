# Quality Gates

## Review before delivery

For a material change, establish the owning surface, relevant sources, supported
claims, unresolved contradictions, downstream consumers, and validation scope.
Inspect source contents before treating them as evidence. Preserve missing checks
as gaps. Stop when a required decision or essential source is unresolved; do not
convert a waiver into evidence.

For code or extraction changes, run `npm test` and `npm run check`. Inspect the
diff and describe what the tests establish. This initial checker validates local
Markdown targets, source footnotes and Decision structure/lineage, skill metadata/discovery and root-path ownership, and rejects selected private integration
markers. It does not validate heading anchors, every Markdown syntax, remote URLs,
secret absence, provenance rights, source truth, or connector behavior.

The semantic and producer controllers support bounded agent review, separately
from these structural checks. The shared file engine and bounded delivery guards are implemented;
[agent-host activation](../operations/agent-hooks.md) remains unverified. Local
Git checks do not satisfy that acceptance requirement.

## User-feedback exemption

Record attributed user feedback without demanding independent verification of
the report. Implementing a proposed fix or reusing the report as verified truth
requires the appropriate source review. Recording feedback does not approve its
proposed remedy.

## Publication boundary

Before a public release, verify the selected license and permission to distribute
retained material, inspect content for private information, run the complete
release acceptance checks, and obtain explicit publication approval. The current
private extraction has not completed that review.

## Decision and impact checks

`npm run check` includes stable Decision paths, required metadata, valid dot dates,
impact-entry shape, lineage targets and supersession cycles. It cannot determine
whether an answer was approved, evidence is sufficient, a summary matches the
answer, or every affected file has been identified. Apply the Decision review
workflow for those questions. The shared parser supports the documented block
metadata subset, not arbitrary YAML.

The change-impact scanner returns candidates from explicit references and shared
source identifiers. Review the full affected population separately. Missing
baselines, external sources, hidden host configuration and semantic relationships
limit automatic discovery; no result is a proof that nothing else is affected.

## Authoring advisories and delivery

The shared engine reports possible empty sections, vague evidence wording, cited
source gaps and relevant uncited peers as advisories. They invite semantic review;
they do not fail structural CI or require backlinks to unrelated documents.
`node scripts/hooks/run-engine.mjs --file <path>` shows both errors and advisories.

PR audit checks regenerate plans for the event's actual base/head commits and
compare the body attestations. They validate binding and format, not that an owner
actually approved a finding. See the [delivery contract](../operations/agent-hooks.md#delivery-binding).


## Transition scope

Apply blocking results to the requested transition. Honest working/provisional
saves may preserve unresolved material; they do not promote it to accepted truth.
The [WIP gate policy](../operations/working-with-users.md#gate-behavior) governs
that distinction. Existing user authorization remains valid; do not ask again for
routine repair or the same approved change.

## How To Run Gates

Before writing or finalizing a non-trivial output:

1. Identify the workflow type, target file/path, and output type.
2. Open [evidence-policies.md](./evidence-policies.md).
3. Build or update the evidence inventory.
4. Run every gate required by the workflow's gate profile.
5. Stop before write/finalization if any required gate is `fail` or `blocked`,
   unless the user explicitly waives that gate.

For source-heavy, PR-bound, or batch workflows, do not run gates as one final
narrative check. Run them as artifact-backed checkpoints:

1. **Source-readiness** - before discovery or drafting, prove required source
   lanes and connectors are accessible, blocked, or not relevant.
2. **Pre-draft** - before writing content, record source inventory, extracted
   facts/gaps, and section coverage.
3. **Pre-write** - before editing files, validate material claims, source depth,
   cross-reference, and the consumer contract.
4. **PR-readiness** - before opening either a ready or draft PR, verify the
   actual diff, actual PR description, gate report, batch integrity, and
   deterministic checks that match the changed surface. Draft status does not waive applicable checks.

A gate report that only says a lane was handled is not enough. The report must
point to the evidence artifact, source package, draft table, or diff check that
proves what was done.

Evidence stays human-readable: claim ledgers, evidence inventories, and gate
summaries live inside the artifact, chat, or PR body. No automatic source-access receipt system is installed in this extraction.
Do not manufacture machine evidence or infer observation from a narrative log.

For artifact writes, run the
[artifact write boundary](../artifacts/artifact-write-boundary.md) before file edits. The
write boundary resolves repo mechanics: artifact type, owning surface, target
path, maturity state, owning workflow or skill, existing-artifact handling, and
later gates. Quality gates then validate whether the content is grounded,
trustworthy, and ready for the requested transition.

## When Gates Are Required

Run gates when the work is non-trivial, subject to the user-feedback exemption below.

Work is non-trivial when it does any of these:

- writes or updates a Brain document
- changes a workflow, skill behavior, validation rule, storage path, artifact
  shape, source-of-truth boundary, or ownership boundary
- creates or updates a decision
- makes source-grounded product, UX, BA, QA, implementation, or governance
  claims
- summarizes or extracts from designs, tickets, documents, messages, analytics, implementation evidence,
  `knowledge-hub/`, or `production-features/` for reuse by later work
- opens a PR that depends on semantic validation

Gates are usually not required for quick read-only answers. If the answer is
quick and unvalidated, say that plainly.



## Task Risk Classifier

Classify the task before selecting gates.

| Risk class | Use when | Required behavior |
|---|---|---|
| `quick-read` | The answer is read-only, low-risk, and will not become decision substance, source-of-truth guidance, or document content. | Gates are optional. If gates are not run, say the answer is quick and unvalidated. |
| `standard-gated` | The work writes or updates a Brain artifact, reviews an artifact, or makes source-grounded claims for reuse. | Run the relevant skill-local or workflow-family gate profile. |
| `deep-research` | The task asks for thorough research, source discovery, source recovery, production-feature backfill, source reconciliation, or claims that depend on multiple lanes. | Run the relevant profile plus explicit source-depth tracking, cross-reference checks, and a visible claim ledger for material claims. |
| `governance-changing` | The `hb-change-impact` durable-behavior check is positive under [solution-and-impact.md](../operations/solution-and-impact.md#change-impact-as-a-conditional-step). | Run `/hb-change-impact`, use the Decision / Preflight / Repo Governance evidence profile, and do not implement until the approach is approved. |

If two classes fit, use the stricter class. Stricter does not mean read
everything; it means use the required evidence policy deeply enough for the
claim type.

When a workflow needs a gate report, use this report shape:

| Gate | Status | Evidence checked | Result | Next action |
|---|---|---|---|---|
| Gate name | `pass`, `partial`, `fail`, `blocked`, `waived`, or `not applicable` | Paths/URLs actually read | Short finding | Write, preserve gap, ask user, or stop |

User-facing display is owned by [repo-workflows.md](../operations/repo-workflows.md).
Show the full report only when it is decision-useful, requested, or required
for a gated transition such as finalization or PR readiness.

Do not use vague validation wording such as "looks fine", "seems grounded", or
"probably enough". Use clear facts: what was read, what it supports, what is
missing, and what must happen next.

If the work opens a PR, include the report or a concise gate summary in the PR
description. When active-project or shipped-feature context changed, include
the exact three-line attestation returned by `hb-semantic-project-audit` under
`## Quality Gates`.
PR CI recomputes its deterministic input digest; missing, malformed, or stale
attestation blocks readiness, while semantic findings remain advisory.
When producer machinery changed, also include the current producer conflict
review lines returned by `hb-change-impact`. The delivery
CI checks verifies that attestation; material conflicts and evidence gaps need
a recorded user decision before readiness.



## Gate Result Ownership And User Messages

Gate results must separate what the agent should repair from what the user
actually needs to decide.

Do not turn agent-fixable mistakes into user homework. If the agent can safely
repair the issue, repair it and continue. Mention the repair only when it
materially changes the artifact, scope, or review risk.

Use this ownership split:

| Situation | First owner | User-facing behavior |
|---|---|---|
| Agent mistake that can be repaired safely | Agent | Repair and continue; no user action unless the repair changes accepted scope or truth. |
| Missing source, access, or external evidence | Shared | Preserve the blocker or gap, stop using it as evidence, and ask only for input the user can provide. |
| Waiver, scope reduction, partial continuation, or product/governance choice | User | Present concise options and a recommendation; do not silently choose. |
| Safe continuation with visible gaps | User approval when it affects canonical output or accepted truth | Ask before treating the partial result as acceptable downstream context. |

For user-facing output, use human-readable V1 templates. Do not add mandatory
machine-readable fields until rollout evidence proves which fields are stable.

### Passing Gate Summary

Use this when the required checks pass and no user decision is needed:

```md
Gate check passed for this step.

What I checked:
- {short list of inspected sources or contracts}

Result:
- {what can happen next}
```

Keep it short. Avoid listing internal mechanics that do not change the user's
decision.

### Failed Or Blocked Gate Message

Use this when the workflow cannot safely continue:

```md
I cannot safely continue this step yet.

What blocked it:
- {plain-language blocker}

What I did:
- {agent repair already completed, if any}
- {gap preserved or unsupported claim removed, if any}

What needs your decision:
- {only user-owned choice, access fix, waiver, or scope change}
```

If the agent repaired the issue completely, do not show it as a user task.

### User Decision Prompt

Use this when more than one valid continuation exists:

```md
I need your choice before this becomes accepted Brain context.

Recommended path:
- {recommended option and why}

Other valid option:
- {alternative and tradeoff}
```

Ask for user input only when the choice changes scope, accepted truth,
canonical structure, waiver state, or ownership.

## Artifact-Backed Evidence Records

High-risk outputs and source-recovery work must keep evidence records that are
specific enough for another reviewer to audit. A compact table is fine, but it
must include the actual evidence trail rather than only URLs.

Each material source record should include:

- lane
- source path or URL
- query, tool route, or discovery path used to find it
- access result: `accessible`, `blocked`, `rate-limited`, `not relevant`, or
  `deferred with user approval`
- source depth from [evidence-policies.md](./evidence-policies.md)
- exact section, heading, node, page, message, or file area read
- extracted fact, gap, or contradiction
- supported section or material claim
- cross-check source or reason no peer check was available
- action: use, weaken, remove, ask, defer, or discard

The evidence artifact can live in a source package, gate report, PR body, or
draft report depending on the workflow. Hidden reasoning is not an artifact.
Evidence records stay human-readable. Record actual reads and their limits;
there is no connector-wide machine observation in this checkout.

Fail `source-readiness` or `claim-grounding` when:

- the inventory lists only links
- a lane is marked inspected without access and read-area evidence
- a source supports a claim but has no extracted fact or read-area record
- a batch report does not preserve per-target evidence records

## Batch Integrity

Batch work is allowed only when each target keeps its own evidence and gate
state.

For each target in a batch, record:

- target path
- source package or evidence record
- required and triggered lanes
- section coverage or consumer-contract coverage
- claim ledger for material claims
- gate statuses
- final readiness state

A batch summary may roll up the results, but it cannot replace per-target
records. If one target is blocked or partial, the batch summary must name that
target and preserve the affected gaps.

## Claim Ledger For High-Risk Outputs

Use a claim ledger when the task is `deep-research`, `governance-changing`, or
when the output is a decision, technical RFC, production-feature knowledge,
Knowledge Hub doc, BI/BA requirements, or source-grounded advisory that will be
reused.

The ledger can live in the gate report, source package, PR description, or final
document. It does not need to cite every sentence. It must cover material
claims. When a material claim is written into an artifact, also apply the
[shared grounding standard](./evidence/grounding.md).

The ledger is a working review record, not an additional document section or
permanent statement registry. The grounding owner selects a direct link or
contextual footnote for every applicable source-grounded artifact; writer-local
section and source-field requirements still apply.
Use [Statement Evidence Review](./gates/evidence-and-freshness.md#statement-evidence-review)
to assess the support relationship; do not equate access or validation with truth.

Minimum shape:

| Claim | Support level | Source read | Cross-check | Result |
|---|---|---|---|---|
| Concrete material claim | `single-source`, `cross-checked`, `conflict`, `gap`, or `user-confirmed` | Path or URL plus section read | Peer source or reason not checked | keep, weaken, remove, ask, or block |

Rules:

- Do not write `gap` claims as fact.
- Do not use `link-found` sources as support.
- Use plain, decisive language. Avoid "seems", "probably", "looks fine", and
  other vague confidence words.
- If the source is insufficient and upstream URLs may contain the answer, mark
  `needs-deeper-source` and inspect the relevant URLs within existing authorization; ask only when
  required access or scope is missing.

Status meanings:

| Status | Use when |
|---|---|
| `pass` | All required checks passed. |
| `partial` | The output can proceed only with visible gaps. |
| `fail` | The output is not safe to write/finalize. |
| `blocked` | Required evidence cannot be accessed or resolved. |
| `waived` | The user explicitly accepted the risk for this gate. |
| `not applicable` | The gate does not apply to this task; include a reason. |

Blocking rule:

- A required `fail` blocks the next step.
- A required `blocked` blocks the next step.
- Only the user can waive a waivable gate.
- If the user waives a gate, record the waiver in chat and in the PR
  description when a PR is opened.

## Gate procedure routing

- [Evidence and freshness](gates/evidence-and-freshness.md): source readiness, statement review, grounding and cross-reference.
- [Routing and readiness](gates/routing-and-readiness.md): surface, consumer, ownership and maturity transition.
- [Decision preflight](gates/decision-preflight.md): durable changes and consequential owners.
- [Named profiles](gates/gate-profiles.md): reusable required/blocking review sets and local deltas.

## Documents from external authors

Apply [writer-independent review](document-review.md) to documents created by
people or other tools. The same standards, statement/evidence/precedent review
and applicable semantic audit apply. No RFC authoring skill is required.
Use [quality incidents](quality-incidents.md) to turn reusable failures into
owning-rule repairs and regression evidence without blocking feedback intake.
