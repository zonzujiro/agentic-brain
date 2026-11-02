# Working With Users During Repo Operations

## Multi-Step Repo Operations

A multi-step repo operation is any Agentic Brain task that may involve more
than one repo-affecting step: shaping, source reading, drafting, artifact write
boundary resolution, gates, preflight, validation, cleanup, PR readiness, or
resume.

This guidance applies whether the work is performed by a source-repo skill,
deterministic scripts, direct agent work, subagents, or a mix. Do not wait for a
formal skill label before applying it.

### Gate behavior

Gates protect state transitions. They are not default stop signs for every step
inside active work.

| Operation state | Gate behavior |
|---|---|
| Active WIP | Gates identify required repairs, gaps, blocked sources, risks, and next steps. They do not block preserving honest provisional work, but identified repairs on the session's own output stay the agent's to resolve (fix, explicit gap, or user-owned stop) before the work is treated as done. |
| Before canonical write | Gates drive repair and readiness checks. Agent-owned problems should be fixed before asking the user. |
| Before finalization or promotion | Gates can block when unresolved risk would become accepted Brain truth. |
| Before PR readiness | Gates check that the branch is explainable, validated, reviewable, and honest about gaps or waivers. |
| After failure or blocker | Gate output should route the next move: repair, keep as WIP, ask user, request waiver, mark blocked, or stop. |

Multi-step skills may declare **gated transitions** when useful, such as target
resolved, source package ready, canonical write, result promotion, or PR
readiness. They should not define a gate matrix for every internal step.

### User transparency

Brain should be transparent about decisions, blockers, risk, and final state,
not about every internal action.

Show the user:

- user-owned decisions
- real blockers
- accepted limitations or waivers
- material risks
- meaningful result state, such as saved as WIP, ready to promote, not ready to
  finalize, or PR-ready

Do not show the user by default:

- every source read
- every validator line
- every gate that passed
- agent-repairable issues already fixed
- long evidence logs unless requested or needed for review

For Creator-facing users, use plain outcome language. For Builder-facing users,
include paths, gate names, and validation commands when they help, but still
avoid ritual logs.

Question discipline: the user is not the search engine. Ask only questions
that the required sources could not answer, map each question to the specific
gap or decision it unblocks, and group what remains into at most a few short
questions. When the evidence supports a recommendation, give it and its reason
before asking for the owner's choice. An option list alone is not a
recommendation. Name the evidence or changed condition that would favor the
alternative; do not ask the user to repeat facts already supplied. A
recommendation does not authorize the write or decide for the owner.
This is interaction guidance, not a separate question-count gate.

### Checkpoint discipline

After the user approves a direction, continue through safe continuation steps
without asking again.

Continue without a checkpoint when the next step is:

- implied by the approved operation
- reversible
- mechanical validation, formatting, sync, cleanup, or diff inspection
- applying an already-agreed decision
- recording a user-supplied fact into its resolved owning artifact
- repairing an agent-owned issue without changing accepted truth or scope

Stop and ask when the next step requires:

- a user-owned product, UX, technical, or governance decision
- accepting a blocker, limitation, partial result, or waiver
- changing scope
- choosing between materially different valid directions
- making an irreversible external action
- changing accepted Brain truth in a way the user has not approved; a user's
  statement of a fact they own counts as approval for recording that fact in
  its owning artifact

### User-supplied fact intake

This section owns the fact-intake behavior. The artifact writer map owns only
the artifact-to-writer routing pointers.

A fact the user states about work they own - a delivery or task status, a
blocker state, a timeline or scope movement they announce, an accepted
technical decision, a correction of a recorded fact, or feature metadata they
provide - is both the evidence (`user-confirmed` support level) and the write
approval for recording it in its owning artifact.

That approval establishes the recording authority, not independent verification
of an external fact. Preserve human attribution, uninspected-source limits,
and exact waiver scope under [Human Reports And Waivers](../quality/evidence-policies.md#human-reports-and-waivers).
An owned requirement can be recorded as that requirement; do not rewrite an
external implementation report as code-verified behavior.

The intake flow for an unambiguous route is:

1. Resolve the owning artifact and workflow. Use the intake routing pointers in
   [artifact-writer-map.md](../artifacts/artifact-writer-map.md) and resolve the
   [artifact write boundary](../artifacts/artifact-write-boundary.md) as usual.
2. Write through the canonical writer, or a permitted governed direct edit that
   satisfies the same contract.
3. Run the surface's deterministic validator when one exists.
4. Report after, instead of asking before: state what was recorded, where, that
   validation passed, and anything deliberately not recorded and why.

Do not ask "do you want me to update this file?" when the owner is
unambiguous. If routing leaves more than one plausible owning artifact, ask one
targeted question that names the candidates and includes a recommendation.
State which home you recommend and why, while leaving both unchanged until the
owner answers. If evidence cannot distinguish the homes, name that gap rather
than fabricating a reason. If
no owning workflow, artifact, or handler exists after bounded repo discovery,
stop before inventing a new shape: report the missing handler as a gap, propose
the nearest existing route, and ask a focused routing or preflight question.

Record only what the user actually said. Interpretation, extension, or
restructuring beyond the stated fact stays on the stop-and-ask list, as do
lossy or destructive rewrites, waivers, scope changes, new or changed durable
rules, external writes, and irreversible actions. Intake writes stay in the
local working tree; commits and PRs remain explicitly user-approved.

Adjacent loops keep their own triggers: recheck shipped claims against current
implementation evidence when freshness matters, and use `hb-change-impact` for
significant context drift instead of silently patching consumers.

### Resolving open questions

This section applies whenever a workflow establishes an accepted answer that
closes an open question in any governed Brain artifact. It is not limited to
Decision files, user-supplied answers, or a section literally named
`Open Questions`.

Before writing, resolve the owning artifact and perform a lightweight impact
triage on the accepted answer itself. Use the explicit signals owned by
[Change impact as a conditional step](./solution-and-impact.md#change-impact-as-a-conditional-step):
known consumers, Decision `affected_docs`, exact references, shared source
identifiers, and any possible scope, behavior, delivery, source-of-truth, or
ownership change. For a repo-backed artifact, use deterministic candidate
discovery when the inspected context cannot rule out downstream consumers. A
candidate is only a reason to inspect; it is not proof of impact. Include
consumers explicitly named by the user or scenario even when the detector finds
no reference to them. Inspect their governing content and record each concrete
disposition at the owning answer; lacking authority to edit a consumer leaves
its impact pending, rather than removing it from the assessment.

Route the first write according to that triage:

- If the answer is local or informational and inspected context shows no
  downstream effect, record it through the artifact's owning writer or a
  permitted governed direct edit. Then report that no further action is needed
  and explain why.
- If the answer may make another artifact stale or contradictory, or may
  change scope, behavior, delivery, a source-of-truth boundary, or an ownership
  boundary, run `hb-change-impact` before writing the answer or any of its
  consequences.

A fact supplied by a user who owns it follows the user-supplied fact intake
flow. A factual answer established from inspected evidence follows the owning
writer's evidence and gate contract. Evidence may resolve a factual question;
it must not select a human-owned product, UX, technical, QA, BI, or governance
direction. Approval to record the answer does not waive a required pre-write
impact or durable-behavior gate.

Before reporting completion, finish the owning writer's required review and
report its concrete verdict and any remaining findings. Reading the review
instructions or passing a schema validator does not complete a semantic review.

Recording the answer and acting on its consequences are separate transitions.
A user's statement approves the exact fact they own in its owning artifact.
Neither that approval nor a source-grounded factual answer silently approves
inferred product, UX, R&D, QA, BI, planning, or cross-project changes.

For every proposed follow-up, resolve the affected project, the artifact owner,
the discipline that owns the response, and whether the current conversation
explicitly covers that response. Use grounded project metadata, artifact
contracts, and explicit user coordination. Do not infer a person's authority
from Creator/Builder mode, repository write access, a filename, a project team
alone, or an unverified ownership label. This is an interaction and action-
routing rule, not a new repository permission system: coordinated cross-role
contributions remain allowed.

The current conversation establishes confirmed scope when it explicitly states
that the named discipline or project response is coordinated with the relevant
owner, delegated to the current user by that owner, or owned by the current
user. Explicitly coordinated cross-role or cross-project work may therefore be
in scope. Merely naming a target, asking Brain to change it, participating in
the conversation, belonging to a project team, or asking about an effect does
not establish that broader organizational scope.

Route the result according to that evidence:

- Within the current user's confirmed scope, including explicitly coordinated
  cross-role or cross-project work, propose the consequential update and its
  expected project effect. Apply it only when the current request or a later
  answer approves that broader change.
- For another discipline in the same project outside the confirmed scope,
  explain the implication and propose an owner review or handoff. Do not ask
  the current user to choose or commit on that discipline's behalf.
- For another project outside the confirmed scope, explain the cross-project
  effect and leave the target project unchanged. The current project may record
  its own dependency or risk through its owning workflow.
- When the owner or authority is unresolved, preserve that as a visible
  blocker. Do not invent a recipient or silently broaden the current user's
  scope.

Propose only evidence-backed actions. There may be one action, several real
alternatives, or no further action; do not manufacture options to fill a
template. Explain what each material option would change, what it leaves
unchanged, its likely effect on the project, and any evidence gap that limits
the conclusion.

User-facing messages should be plain and friendly. Lead with what was resolved,
then use short paragraphs separated by blank lines. Use a small bullet list
only when several effects or next steps are easier to scan. Do not expose an
internal authority matrix, gate report, or artifact-routing schema by default.
