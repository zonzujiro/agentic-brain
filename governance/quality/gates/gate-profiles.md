# Quality Gate Profiles

## First-Rollout Gate Profiles

Do not try to map every skill in the repo. Use these profiles for the skill
families and output types where gating materially protects Brain from drift.

Gate IDs:

| ID | Gate |
|---|---|
| `surface-routing` | Surface Routing |
| `source-readiness` | Evidence Policy And Source Readiness |
| `claim-grounding` | Source-To-Claim Grounding |
| `cross-reference` | Cross-Reference And Contradiction |
| `freshness` | Freshness |
| `consumer-contract` | Consumer Contract |
| `decision-preflight` | Decision / Preflight |
| `boundary` | Boundary |
| `write-readiness` | Write Readiness |

Gate IDs are stable kebab-case slugs. These profiles are agent-applied review
contracts. The current skill validator does not enforce profile declarations or
deltas. Model behavior evaluations remain a separate migration task.

Profile rules:

- Artifact-writing workflows must resolve the artifact write boundary before
  file edits.
- Required gates must run before writing, finalizing, or opening a PR.
- Blocking gates stop the next step when they are `fail` or `blocked`.
- A user may waive only gates that the workflow marks as waivable.
- Gate results must be available to the owning workflow for transition and
  readiness decisions. User-facing display follows
  [repo-workflows.md](../../operations/repo-workflows.md).
- If a PR is opened, include the report or concise summary in the PR
  description when relevant to the changed surface.
- Baseline governing sources from [evidence-policies.md](.././evidence-policies.md)
  are required for every profile.

## Named Gate Profiles

A named gate profile is a reusable pair of gate sets: the gates a workflow must
run, and the subset that stops the next step on `fail` or `blocked`. This
section is the only place those sets are defined. Skill-local contracts name a
profile and record local deltas; they must not restate the gate lists.

A gate profile is not an evidence profile. The evidence profiles in
[evidence-policies.md](.././evidence-policies.md) select source lanes; a gate
profile selects gates. The two axes are independent - the same evidence profile
appears with different gate profiles - so a skill-local contract carries both
fields.

| Gate profile | Use when |
|---|---|
| `standard-authoring` | The workflow writes or updates a Brain artifact from sources and the output has a downstream consumer contract. `decision-preflight` applies only when the durable-behavior check is positive. |
| `governed-change` | The workflow always changes, approves, or reviews a durable rule, contract, or decision outcome, so `decision-preflight` is unconditional. |
| `skill-change` | The workflow imports, refreshes, reviews, or changes skill packages and their contracts. Source freshness is not the material risk, and the consumer contract is checked without blocking. |
| `boundary-resolution` | The workflow resolves a write target, artifact shape, maturity state, or ownership question and does not author content itself. |
| `change-impact` | The workflow evaluates whether a concrete content or governance change makes another artifact stale, contradictory, or in need of an owning-writer update. |

### Profile: `standard-authoring`

Required gates:

- `surface-routing`
- `source-readiness`
- `claim-grounding`
- `cross-reference`
- `freshness`
- `consumer-contract`
- `decision-preflight` when the durable-behavior check is positive
- `boundary`
- `write-readiness`

Blocking gates:

- `surface-routing`
- `source-readiness`
- `claim-grounding`
- `cross-reference`
- `consumer-contract`
- `decision-preflight` when triggered
- `boundary`
- `write-readiness`

### Profile: `governed-change`

Required gates:

- `surface-routing`
- `source-readiness`
- `claim-grounding`
- `cross-reference`
- `freshness`
- `consumer-contract`
- `decision-preflight`
- `boundary`
- `write-readiness`

Blocking gates:

- `surface-routing`
- `source-readiness`
- `claim-grounding`
- `cross-reference`
- `consumer-contract`
- `decision-preflight`
- `boundary`
- `write-readiness`

### Profile: `skill-change`

Required gates:

- `surface-routing`
- `source-readiness`
- `claim-grounding`
- `cross-reference`
- `consumer-contract`
- `decision-preflight`
- `boundary`
- `write-readiness`

Blocking gates:

- `surface-routing`
- `source-readiness`
- `claim-grounding`
- `cross-reference`
- `decision-preflight`
- `boundary`
- `write-readiness`

### Profile: `boundary-resolution`

Required gates:

- `surface-routing`
- `decision-preflight` when the durable-behavior check is positive
- `boundary`
- `write-readiness` for the requested maturity transition

Blocking gates:

- `surface-routing`
- `decision-preflight` when triggered
- `boundary`
- `write-readiness`

### Profile: `change-impact`

Required gates:

- `source-readiness`
- `claim-grounding`
- `cross-reference`
- `freshness`
- `consumer-contract`
- `decision-preflight` when the durable-behavior check is positive
- `boundary`
- `write-readiness`

Blocking gates:

- `source-readiness`
- `claim-grounding`
- `cross-reference`
- `consumer-contract`
- `decision-preflight` when triggered
- `boundary`
- `write-readiness`

### Profile Deltas

State a delta only when the skill's real contract differs from its named
profile. Use these forms so the resolved set stays unambiguous:

| Delta form | Effect |
|---|---|
| `` `gate` is not required. `` | Remove the gate from the required set and from the blocking set. |
| `` `gate` is required but does not block. `` | Keep it required; remove it from the blocking set. |
| `` `gate` blocks only for {narrow condition}. `` | Keep it required and blocking, narrowed to the stated condition. |
| `` `gate` is required when {condition}. `` | Make an otherwise unconditional gate conditional, or add a gate the profile does not carry. |

Do not inline a gate list in a skill because no profile fits. Add the profile
here instead, so one surface keeps the definition.

Do not restate the canonical `hb-change-impact` trigger in a delta.
[solution-and-impact.md](../../operations/solution-and-impact.md#change-impact-as-a-conditional-step)
owns that trigger taxonomy, and `decision-preflight` already resolves against
the durable-behavior check.

## Skill-Local Gate Contracts

Each migrated skill should keep a small local gate contract in its `SKILL.md`.
Do not copy gate definitions or gate lists into skills. Name the gate profile;
[Named Gate Profiles](#named-gate-profiles) owns what it contains.

The local contract tells the skill which profile to run and what is locally
different. This doc tells the skill what each gate means.

Required local contract fields:

| Field | Meaning |
|---|---|
| Profile | The evidence profile from [evidence-policies.md](.././evidence-policies.md). It selects source lanes, not gates. |
| Gate profile | The named gate profile from [Named Gate Profiles](#named-gate-profiles). It selects the required and blocking gate sets. |
| Profile deltas | Only the differences from that gate profile, in the delta forms above. Omit the field when there are none. |
| Run gates before | The workflow moments that require validation. |
| Evidence focus | Discipline-specific source lanes this skill must prioritize. |
| Report target | Where the gate report appears: chat, document, PR description, or all that apply. |
| Waiver rule | Which failures can be user-waived and how the gap must remain visible. |

For a skill that declares a profile, review these fields and delta syntax
manually. Do not describe that review as validator enforcement.


Example local declaration (guidance, not validated metadata):

```text
Profile: PM / Product Context
Gate profile: standard-authoring
Run gates before: canonical write; finalization; PR readiness
Evidence focus: current source package and relevant shipped precedent
Report target: chat; PR description when authorized
Waiver rule: preserve the exact owner-approved scope and affected gaps
```
