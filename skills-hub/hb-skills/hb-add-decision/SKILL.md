---
name: hb-add-decision
description: |
  Repo-local Agentic Brain helper for shaping, writing, and meaningfully
  updating one project Decision document.
---


# Add Decision

Use this skill to analyze a choice and keep its history in one Decision file.
The file may start while the answer is unknown, keep its open questions, later
record the answer, and later explain rejection or supersession. It never moves
between lifecycle folders and never gains a lifecycle status field.

## Decision contract

The only Decision path is:

`projects-in-progress/{project}/decisions/{slug}.md`

The same path is used before and after a choice. Preserve decision-relevant
research, audit conclusions, diagrams, and review evidence in the Decision
itself. Independently reusable material may go only to an already-governed
project surface outside `decisions/`. If none covers it, run `hb-change-impact`
instead of inventing `reviews/` or another folder.

Use only this frontmatter shape:

```yaml
---
id: DEC-{slug}
date: DD.MM.YYYY
summary: One to three short sentences summarizing the current Decision answer.
participants:
  - {participant}
amends:
  - DEC-{existing-decision}
supersedes:
  - DEC-{existing-decision}
affected_docs:
  - path: {repo-relative-path}
    status: pending | reviewed | no_change_needed | blocked
    resolved_at: DD.MM.YYYY
    note: {optional explanation}
---
```

`id`, `date`, `summary`, and `participants` are required. `date` is the date the
Decision file was created. For new files, use the current session date in DD.MM.YYYY format.
The parser supports the block-list metadata shape shown here: single-line
scalars, lists, and lists of simple objects. Do not use YAML anchors, flow lists,
multiline scalars or nested object trees. This is a bounded parser, not full YAML.

`summary` is the retrieval text used by the Decision catalog. It summarizes the
answer in `## Decision`, not only the problem. If no answer exists yet, say
which choice remains open. Update the summary when the answer changes.

`amends` and `supersedes` contain existing `DEC-...` IDs. When this Decision
supersedes another one, also add a `## Supersession` section to the older file;
name the replacing Decision and explain the practical consequence. The catalog (`node scripts/decision/decision-catalog.mjs projects-in-progress/{project}`)
derives reverse `amended_by` and `superseded_by` relationships.

`affected_docs` appears only after `## Decision` contains a concrete choice.
Before that, describe possible impact in the analysis or open questions. Each
entry names the real repo-relative path; ownership is resolved from that file
or its project metadata instead of being copied here.

Do not add `status`, `review`, `amended_by`, or any other lifecycle metadata.

## Required body

Every file contains exactly one non-empty `## Decision` section written in
plain English.

- If no choice has been made: say so directly and keep the unresolved questions
  in the same file.
- If a choice has been made: state what people and systems will do.
- If the proposal is rejected: keep `## Decision` for the considered answer and
  add `## Rejection` explaining what was rejected and why.
- If another Decision replaces it: add `## Supersession` naming the replacement
  and the consequence.

Open questions stay in the Decision when they belong to the choice. Do not move
them to governance documents merely because they are unresolved. Separate
implementation follow-ups from questions that could change the choice.

## Flow

1. Resolve the project, flat target path, existing-file handling, and slug using
   `governance/artifacts/artifact-write-boundary.md` and
   [`references/workflow-contract.md`](references/workflow-contract.md).
2. Read the project README, catalog summaries when decisions already exist, the directly related
   Decision bodies, and the owning docs that could contradict the new answer.
3. For repo-wide rules or another durable-behavior change, run `hb-change-impact`
   before implementation and wait for user approval.
4. Show the real alternatives, evidence, contradictions, affected files, and
   unresolved questions. Do not invent alternatives to fill a template.
5. Write or update the stable Decision file after the user approves the
   direction or asks to preserve the open question.
6. Run `hb-review-decision` on creation and whenever the meaning changes. The
   review checks the choice, evidence, contradictions, lineage, affected files,
   and summary. Report the result in chat or the PR; do not store review status
   in the Decision.
7. Run `node scripts/validate_decisions.mjs`, the project catalog, `npm test`
   and `npm run check`. Review semantic conclusions separately before delivery.

## Evidence and quality gates

Use the current review checks in
`governance/quality/quality-gates.md` and the claim rules in `governance/quality/evidence-policies.md`.
Review evidence proportionally: local wording changes need less evidence than a
cross-project product or technical choice, but contradictions analysis is never
skipped.

Decision files record rationale, history, and lineage. Operational behavior
must also be written into the owning product documents, RFCs, skills,
validators, templates, or configuration. `affected_docs` tracks that work; it
does not replace it.

## Guardrails

- Never overwrite an existing Decision silently. Use `amends` when the earlier
  answer still applies with a change; use `supersedes` when the new answer
  replaces it.
- Do not turn missing evidence into a fact. Keep the gap in the Decision.
- Do not treat a Decision with unresolved direction-changing questions as an
  operational rule.
- Do not create a PR or post a PR comment unless the user explicitly approves
  that external write.

