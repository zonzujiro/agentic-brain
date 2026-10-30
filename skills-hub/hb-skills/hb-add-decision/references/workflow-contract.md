# Decision Operation Contract

This contract owns changes to one stable Decision document. It deliberately has
no Decision lifecycle and no promotion step.

## Owned artifact

`projects-in-progress/{project}/decisions/{slug}.md`

The file can contain an unresolved choice, a selected answer, a rejection, or a
later supersession. Its path and metadata shape stay the same.

## Operations

| Operation | What changes | Required checks |
|---|---|---|
| Create | Add the stable file, even when the answer is still open. | Correct project and slug, no collision, required metadata, one plain-English `## Decision`, contradiction review. |
| Clarify | Improve evidence, options, questions, or wording without changing the answer. | Relevant source and consumer checks; keep the summary aligned. |
| Change the answer | Rewrite `## Decision`, summary, consequences, and affected paths. | User approval, `hb-review-decision`, contradiction and lineage review, current quality review checks. |
| Reject | Add `## Rejection` explaining the rejected answer and consequence. | User-owned rejection, semantic review, affected-document review when operational truth changes. |
| Supersede | New Decision adds `supersedes: DEC-old`; old Decision adds `## Supersession` naming the replacement. | Both files agree, target exists, no self-reference or cycle, contradiction review. |
| Resolve impact | Update only the reviewed `affected_docs` entries. | Inspect the actual target file; record `reviewed`, `no_change_needed`, or `blocked`. |
| PR readiness | Present the Decision and its operational changes for repository review. | Targeted checks, `node scripts/validate_decisions.mjs`, full repo validation, explicit user approval before PR creation. |

## Questions and follow-up

Open questions remain in the Decision that owns them. A question is allowed
after an answer when it is an implementation detail that cannot reverse the
answer. If it could change the selected option, ownership boundary, scope, or
consequence, the Decision must say that the choice is not yet made and must not
activate `affected_docs`.

## Agent-owned repairs

The agent may repair a mismatched ID, malformed date, stale summary, invalid
lineage reference, duplicate affected path, or missing explicit gap without
asking the user. Choosing an answer, rejecting it, accepting a contradiction,
or replacing another Decision remains user-owned.

