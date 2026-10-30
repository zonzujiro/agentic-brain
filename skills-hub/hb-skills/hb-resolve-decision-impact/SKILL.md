---
name: hb-resolve-decision-impact
description: |
  Agentic Brain helper for reviewing and closing downstream affected_docs
  entries after a Decision contains a concrete choice.
---


# Resolve Decision Impact

Use this helper to review downstream files named in Decision `affected_docs`.
The metadata is a work list for downstream review; the actual
product or operational truth belongs in the affected file.

## Input

- a project slug, optionally narrowed to one or more `DEC-...` IDs
- flat Decision files under `projects-in-progress/{project}/decisions/`

Scan only Decisions with at least one affected entry whose status is `pending`
or `blocked`. Do not infer new affected files silently from prose; when the
review discovers a missing consequential file, return it to the
`hb-add-decision` authoring flow so the Decision and contradiction analysis can
be updated together.

## Entry contract

```yaml
affected_docs:
  - path: projects-in-progress/example/engineering/rfc-example.md
    status: pending | reviewed | no_change_needed | blocked
    resolved_at: DD.MM.YYYY
    note: Optional explanation.
```

`path` is the real repo-relative target. Do not use logical keys such as `prd`
or `technical-rfc`, and do not copy an owner into the Decision. Resolve the
owner from the target document or project metadata.

`affected_docs` is valid only when `## Decision` contains a concrete choice. If
the file says that no choice is made, stop and move the possible impacts back
into its analysis or open questions.

## Flow

1. List the unresolved Decision IDs and exact paths.
2. Let the user select scope when they did not already name IDs.
3. For each selected path, inspect its current content and governing workflow.
   Do not copy a rule from Decision history without checking whether the target
   already contains newer truth.
4. Apply one action from
   [`references/resolution-actions.md`](references/resolution-actions.md):
   `update_doc`, `no_change_needed`, or `blocked`.
5. Edit only the entries reviewed in this run. Preserve unrelated notes and
   statuses.
6. Run the affected surface validator, `node scripts/validate_decisions.mjs`,
   and the full repository validator before PR readiness.

Terminal statuses are `reviewed` and `no_change_needed`. `resolved_at` is
optional, but when written it uses the current session date in DD.MM.YYYY format.
`blocked` and `pending` must not carry a misleading completion date.

One run and one PR may resolve multiple Decisions in the same project. Report
which files changed, which required no change, and which remain blocked. No notifications or automatic cascade are installed. PR creation is a separate
explicitly approved action.

## Quality gates

Use the current quality review checks plus the owning workflow for each
affected surface. Do not mark `reviewed` when required evidence is missing.
Use `blocked` with a visible note instead.

## Guardrails

- Do not treat the Decision as the operational source of truth.
- Do not add lifecycle status to the Decision.
- Do not edit unreviewed affected entries.
- Do not invent ownership or a target path.
- Do not create or comment on a PR without the user's explicit approval.
