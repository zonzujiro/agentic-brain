---
name: hb-review-decision
description: |
  Repo-only Agentic Brain second-opinion review for a new Decision or a
  meaning-changing Decision edit.
---


# Review Decision

Use this skill as a distinct reviewer pass when a Decision file is created,
when its answer, rejection, or supersession changes, or when a PR depends on its
substance. The review result is reported in conversation or the PR; it is not a
status stored in Decision metadata.

The reviewer challenges the draft. It does not author or finalize the Decision.

## Inputs

- the target `projects-in-progress/{project}/decisions/{slug}.md`
- the target project README or Agentic Brain governance context
- Decision catalog summaries, followed by the directly relevant Decision bodies
- `amends`, `supersedes`, and derived reverse relationships
- the real files named by `affected_docs`
- evidence needed for the claims in the answer

## Review flow

### 1. Establish what the file actually says

Quote or restate the plain-English answer in `## Decision`. If it says no choice
has been made, name the unresolved choice. Compare `summary` to that answer;
reject a summary that only describes the problem or a former answer.

### 2. Check contradictions

Use catalog metadata to shortlist related records, then read the bodies needed
to answer these questions:

- Does an existing Decision require a different answer?
- Does this draft amend an older answer or replace it entirely?
- If it replaces one, does the new file use `supersedes: DEC-old`, and does the
  old file contain `## Supersession` naming the new ID?
- Does any current product document, RFC, skill, validator, template, or config
  still enforce the opposite behavior?
- Could the choice break another feature or discipline-owned contract that is
  not listed in `affected_docs`?

Do not bulk-read every Decision when a catalog shortlist is enough. Do not
ignore a historical Decision when lineage or a prior contradiction makes it
relevant.

### 3. Challenge the substance

Check for:

- a missing real alternative raised by a user, source, reviewer, or existing
  rule
- invented alternatives that exist only to make the document look complete
- claims stronger than their evidence
- unresolved questions that could reverse the answer
- unclear decision ownership
- hidden user, product, technical or ownership consequences
- `affected_docs` before any concrete choice exists
- missing actual paths after a choice exists
- operational rules that exist only in the Decision instead of the owning file
- a rejection that does not explain the practical result
- a supersession that leaves readers unable to find the current answer

Open questions are allowed inside the Decision. Classify each as either:

- direction-changing: the file must say no choice is made and must not activate
  `affected_docs`; or
- implementation follow-up: the selected answer remains stable.

### 4. Report the review

Use concise conversational output:

- `Major concerns`
- `Questions to resolve`
- `Required changes`
- `Residual risks`

If there are no material concerns, say exactly what was checked: the answer,
summary, contradictions, lineage, affected files, and unresolved questions.
Do not write `review.status` or another approval marker into the Decision.

Keep the review in chat or the PR unless its decision-relevant conclusions need
to be preserved in the Decision. If the user asks for an independently durable
review artifact, resolve an already-governed canonical surface through the
artifact write boundary. If none covers it, run `hb-change-impact`; never
invent `reviews/` or another folder.

## Quality gates

Use the current review checks in
`governance/quality/quality-gates.md` and `governance/quality/evidence-policies.md`. The review cannot waive
missing user choices, boundary violations, unsupported facts, or unresolved
contradictions. A visible gap is preferable to a fabricated answer.

## Guardrails

- Do not edit or finalize the Decision from the reviewer role.
- Do not treat clean metadata as proof that the answer is sound.
- Do not approve a summary that diverges from `## Decision`.
- Do not skip contradiction analysis, including the possibility that the new
  answer breaks another feature.
- Do not require the answer to be complete before the file exists; a Decision
  may honestly preserve an unresolved choice.
- Use `scripts/validate_decisions.mjs` for structural checks, but keep semantic
  review separate because a script cannot prove that evidence, meaning, and
  consequences are correct.
