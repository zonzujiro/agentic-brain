# Review documents from any author

This procedure applies equally to a person, Superpowers, another tool or a Brain
writer. It validates existing documents; it does not introduce RFC authoring.
The owning [standards](../artifacts/documentation-standards.md) and
[evidence gates](gates/evidence-and-freshness.md) remain authoritative.

## Establish the review boundary

Identify the document, its consumer, maturity, governing standard and exact
revision or local diff. Read the whole affected section and its dependencies.
List missing inputs explicitly. A filename, successful transport, or another
agent's confidence does not establish completeness or correctness.

## Mechanical pass

Run `node scripts/validate_root_docs.mjs --all` and `npm run check`. These inspect
required sections, unresolved placeholders, test flow mapping, measurement fields,
links, footnotes and repository contracts. Review any waiver for actual scope and
authorization; a syntactically valid waiver is not approval. Preserve open questions
where the owning contract permits them. Report the files actually checked.

## Statement, evidence and precedent pass

For each consequential statement, identify whether it is an observed fact,
user-confirmed requirement, proposal, inference, accepted decision or unknown.
Inspect the cited source content at the necessary depth. Compare what the source
actually says with the scope, lifecycle and certainty of the statement. A source
access record confirms only the access attempt and coverage, never the statement.

Check the applicable governing rule and relevant decisions, shipped examples and
parallel documents. Explain whether precedent applies, differs or conflicts; an
old example cannot override the maintained contract. Separate independent support
from two documents repeating the same upstream claim. Check negative claims such
as “no existing capability” against the bounded search, not one unsuccessful read.
Keep blocked, partial, stale and contradictory evidence visible. Correct unsupported
wording or leave an explicit question instead of manufacturing a source or waiver.

## Semantic and consumer pass

Use the existing semantic-project-audit workflow for affected project identity,
responsibility overlap, copied mutable truth and missing boundaries. Read beyond
the shortlist when a material claim requires it. Check downstream feasibility,
flow/error coverage, ownership, measurable acceptance, rollout/rollback and known
limitations under the applicable standard. Mechanical success does not complete
this pass. Do not use an audit to silently expand the project's accepted scope.

## Review result and repair

Report concrete findings with location, consequence, source and proposed repair.
Distinguish confirmed defects from questions. Preserve useful supported content;
fix omissions at their owner and review affected consumers. Recheck the repaired
pass, then conduct a distinct read-only review of the final diff. Record checks
run, semantic conclusions, unresolved gaps and any authorized waiver in the task
or review output. Do not put transient access logs into canonical documents.

When a reusable failure is found, apply the [incident loop](quality-incidents.md).
Neither a passing parser nor a model score supplies missing approval or evidence.
