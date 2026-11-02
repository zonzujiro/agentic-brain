# Agentic Brain agent instructions

Use plain language. Read README.md and ARCHITECTURE.md for current capability
and authority. Follow governance/operations/communication.md when explaining work.

Before changing content, read governance/operations/repo-workflows.md and the
relevant surface README. For source-grounded work, apply
governance/quality/evidence-policies.md. For validation, use
governance/quality/quality-gates.md.

The migration scope and task list belong in projects-in-progress/agentic-brain/.
Keep planned, implemented, tested, committed, pushed, and published states distinct.
Never describe planned hooks, connectors, skills, or evaluations as active.

Do not edit the source Harmony Brain repository during this extraction. Copy
only the reviewed subset from the recorded source revision. Record adaptations
in projects-in-progress/agentic-brain/extraction.json; never copy private project
data, local credentials, or session logs. Preserve useful general guidance rather
than replacing substantive contracts with summaries.

Run npm test and npm run check before claiming a code increment is validated.
Use DD.MM.YYYY for human-facing dates. Machine timestamps use their format.
Ask Ivan for explicit approval before creating any PR. Do not post or resolve
PR comments without explicit authorization for that action. Do not make this
repository public or select a license without his approval.

## Required agent boot sequence

For a quick read, classify the request and inspect the relevant current source.
For artifact work, resolve the owner and write boundary, read the surface contract
and writer, then apply evidence and quality rules. For durable behavior changes,
use `hb-change-impact`, inventory affected consumers and complete a distinct final
read-only review. A passing parser is not a semantic review.

Use [interaction roles](governance/operations/roles/agent-role-guidance.md) for
Creator/Builder preferences. Honor a preference already given; role selection
never changes authority. Use [working with users](governance/operations/working-with-users.md)
for checkpoints, fact intake and open-question closure, and
[solution framing](governance/operations/solution-and-impact.md) when a requested
mechanism may not be the best supported way to achieve the intended outcome.

Continue authorized independent work when one branch is blocked. Before reporting
completion, resolve agent-owned defects, check the actual diff and make remaining
gaps visible. Consult [checkout freshness](governance/operations/flows/brain-checkout-freshness.md)
and [PR flows](governance/operations/flows/pr-operations.md) for delivery.
