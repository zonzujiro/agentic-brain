# Resolution Actions

What each allowed action does to the matching `affected_docs` entry in
`hb-resolve-decision-impact` Step 4. Dates follow the
[repo date policy](../../../../governance/operations/repo-workflows.md#date-format).
Load the section for the action you are
applying. The narrow-edit rules, the terminal-state model, and the
`## Guardrails` prohibitions stay in `SKILL.md`.

### `update_doc`

Use the current workflow for the affected surface. Read its operational owner
before applying a historical choice; the target may already contain newer truth.
For governance or another artifact with no dedicated migrated writer, edit the
existing owner directly within authorized scope. If a missing writer's contract
is essential to a safe update, mark the entry blocked instead of inventing it.
Keep each change scoped to the reviewed impact.

After the doc work is complete in this run, update the matching
`affected_docs` entry to:

- `status: reviewed`
- `resolved_at: {current session date}`

### `no_change_needed`

Update the matching entry to:

- `status: no_change_needed`
- `resolved_at: {current session date}`

Add a short note explaining the inspected evidence when it affects confidence.

### `blocked`

Update the matching entry to:

- `status: blocked`

If the entry already has `resolved_at`, remove it when marking the doc blocked
again.

Add a short note naming the blocker and what would resolve it.
