# Decision Preflight Gate

## Gate: decision-preflight - Decision / Preflight

**Question:** Does this change create or modify a durable rule?

**Why this gate exists:** Durable workflow, validation, storage, and
source-of-truth changes must go through governance.

Agent steps:

1. Run the `hb-change-impact` durable-behavior check defined in
   [solution-and-impact.md](../../operations/solution-and-impact.md#change-impact-as-a-conditional-step).
2. If it is positive, `/hb-change-impact` approval is required before implementation.
3. Determine whether the durable choice needs a Decision for rationale,
   alternatives, approval or lineage. Use `hb-add-decision` when it does.
4. Record the rationale for requiring or not requiring a Decision; do not
   fabricate a Decision merely to rename an already-authorized correction.
5. Verify that `## Decision` plainly says whether a choice exists and that no
   open question silently reverses a stated choice.
6. Verify a semantic review result exists for a new or meaning-changing
   Decision; do not store review status in its metadata.
7. If the decision changes behavior, verify that the owning operational surfaces
   are updated or that the missing updates are explicit implementation
   follow-ups. Do not treat the decision body itself as the maintained rule.

Pass when:

- Required preflight evidence exists.
- Required decision/review evidence exists.
- Open implementation follow-ups are separated from open decision questions.
- Behavior-changing decisions identify the consequential docs, skills,
  validators, templates, or config that carry the operational rule.

Fail when:

- A change that matches the canonical trigger is implemented without preflight.
- A concrete choice is treated as operational while direction-changing
  questions remain unresolved.
- A new or meaning-changing Decision skipped semantic review.

Record:

- preflight required: yes/no and why
- decision required: yes/no and why
- semantic review completed: yes/no and where it was reported
- unresolved decision questions, if any
