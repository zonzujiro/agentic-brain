# Agentic Brain Quality Incidents

This doc defines the lightweight incident loop for Agentic Brain quality gates.

The goal is to turn real agent drift into better gates, profiles, validators,
or decisions. Do not use this as a blame log. Use it as a product-quality
feedback loop.

Recording feedback follows the [user-feedback exemption](./quality-gates.md#user-feedback-exemption).
The shape below is authoring guidance; feedback entries do not require validation.

## When To Record An Incident

Record an incident when a real workflow exposes a material quality failure or a
repeated waiver pattern.

Record these by default:

- an agent proceeds, or tries to proceed, after a required gate fails
- a source is cited after only finding a URL or path
- a material claim is written without evidence
- a contradiction is hidden or silently resolved
- a required governing doc, preflight, or decision lineage/contradiction check
  is skipped
- a Brain / source system / discipline boundary is violated
- a tech-design implementation claim is made without required Cold Storage
  code/test/package grounding
- a PR that should contain gate results does not contain them
- the same waiver pattern appears more than once
- the user flags the output as drift, guessing, half-truth, or AI slop

Do not record routine noise:

- typo-only mistakes
- a blocked source that was already reported as a visible gap
- a one-off user waiver that does not weaken future reusable guidance
- formatting issues that do not change meaning, evidence, routing, or
  validation behavior

## Incident Shape Guidance

A record is a short document, not a bullet list. Each part below is a real
section with its own heading, because each one carries paragraphs, tables, or
diagrams rather than a single value. The scannable facts live in one table at the
top so a reader can triage without reading the body.

```md
## DD.MM.YYYY - Short Incident Title

| | |
|---|---|
| Status | open / fixed / accepted risk |
| Type | plain label |
| Workflow or skill | ... |
| Artifacts | paths, links, or "chat only" |
| Gates | ... |
| Follow-up owner | ... |

One or two sentences a reader can stop at: what broke and why it matters.

### What failed

### Evidence

### What happened next

### Proposed fix

### Options for the decision   <!-- only when the fix is a decision -->
```

Section rules:

| Section | Suggested content |
|---|---|
| Header table | `Status` is `open`, `fixed`, or `accepted risk`. `Type` is a plain label such as `ungrounded claim`, `boundary drift`, `repeated waiver`. `Workflow or skill` names the skill, workflow family, or "chat advisory". `Artifacts` gives paths or links, or "chat only". `Gates` lists the failed or missing gate IDs. `Follow-up owner` may be a role or surface owner when no person is known. |
| Opening summary | Unlabelled prose directly under the table. State the failure and its consequence in plain language, without repo jargon the reader must resolve elsewhere. |
| What failed | The concrete mechanism. Prose, not a value. Use a table, a code excerpt, or a diagram whenever the relationship is clearer that way than in sentences. |
| Evidence | The diffs, findings, code paths, source reads, and user corrections that prove the record. Name them specifically; a link alone is not evidence that it was read. |
| What happened next | Whether work was blocked, rewritten, waived, reverted, or accepted with visible gaps, and what state the artifacts are in now. |
| Proposed fix | One of: update gate, update evidence policy, update skill-local gate contract, add deterministic validator, promote decision, no change. Explain why that class is the right one. |
| Options for the decision | Only when the proposed fix is a decision. One `####` subsection per candidate with its cost, then open questions, then an explicit statement of what is not decided. Never write it so a reader could mistake it for a choice already made. |

Diagrams, tables, excerpts, and worked examples are encouraged wherever they
explain more than prose. Keep diagrams in fenced blocks so they render the same
in an editor, on GitHub, and to an agent reading the raw file.


## How Incidents Feed Back

Every recorded incident should lead to exactly one next governance action:

- update a gate when the failure is reusable across skills
- update an evidence policy when the wrong source lane was required, skipped,
  or treated as duplicate evidence
- update a skill-local gate contract when only one workflow needs the rule
- add a deterministic validator when the failure is repo-provable
- promote a decision when the fix changes durable policy
- mark `accepted risk` when the failure is local, understood, and not worth new
  process

Do not create a new process for every incident. Start from the smallest fix that
would have prevented the failure.

## Storage

Until a richer incident workflow exists, store incidents in this document under
`## Incident Records

No private source incidents were migrated. Add only reviewed records from this repository.

## Repair verification

Recording feedback never waits for a validator. For a fix, name the owning rule,
reproduce the failure, add a regression or behavioral scenario at that owner,
then run the affected checks and the repository suite. Review the actual change
against the original evidence. Mark fixed only after that verification; an open
follow-up or blocked model run is not a fix. Accepted risk needs the deciding
owner and its scope. The automated check remains advisory so incomplete feedback
can always be captured. Run `node scripts/check_quality_incidents.mjs`.
