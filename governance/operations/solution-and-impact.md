# Solution Framing And Change Impact

### Solution-frame checkpoint

This section owns the cross-workflow rule for challenging an implementation
request before Brain commits downstream artifacts to that implementation.
Skill-local instructions may project this rule and add surface-specific
routing, but must not maintain a competing implementation-class taxonomy.

Run the checkpoint before creating or materially updating a project brief,
product specification, implementation handoff, Technical RFC, or implementation plan
when at least one of these signals is present:

- the request states an implementation mechanism as though it were the
  requirement
- the desired outcome could plausibly be delivered by existing capability,
  configuration, prompt or assistant composition, existing tools, or a small
  extension of an owned surface
- inspected evidence suggests a materially cheaper implementation class than
  the requested one
- the implementation class is still unsupported or contradicted while the
  next artifact would make it look decided

Do not run a ceremonial comparison for wording-only work, mechanical updates,
or downstream refinement when the implementation class is already supported by
current evidence and no material contradiction has appeared.

The checkpoint has four parts:

1. Separate the user outcome and constraints from the proposed mechanism.
   Treat the mechanism as a hypothesis until it is supported or explicitly
   selected after the alternatives are visible.
2. Search bounded relevant sources for existing capability. Depending on the
   claim, this can include current feature artifacts and Decisions, related
   shipped or in-flight Brain context, implementation code/tests/package docs,
   configuration or administration sources, relevant capability discovery, and a
   targeted question routed to a known capability owner. Do not turn this into
   an unbounded company-wide search.
3. Compare only credible implementation classes among:
   - already supported or no implementation change
   - configuration, prompt, assistant, or existing-tool composition
   - reuse or extension of an existing owned capability
   - new implementation code
   - a manual or process answer when that genuinely satisfies the outcome
4. State the conclusion and evidence. If a credible materially cheaper option
   exists, recommend it and pause before the solution-committing write so the
   authorized owner for the affected product or technical direction can choose
   with the tradeoff visible. Say which path you recommend and why before
   asking; placing it first in an unlabeled list is insufficient. State the
   material limitation or condition that would favor the other path. Do not
   promise an RFC for an option that needs no implementation design.
   An option description must explain a consequence, not just rename the path:
   what existing constraint reuse retains, or what additional implementation
   and maintenance a new component introduces. Keep unsupported benefits or
   limitations as gaps. Ask for the implementation direction, not which RFC
   to write, until the need for an RFC is established. After a reuse choice,
   first determine whether any technical design remains; promise a document
   only for that evidenced need. For example: "I recommend using the existing
   capability. If you choose that path, I will check whether configuration
   needs documenting; a new RFC may be unnecessary."
   When that required question can be answered with
   two or three short, mutually exclusive options, prefer the host's structured
   question tool. Put the recommended cheaper path first, state the consequence
   of each option, and do not repeat the tool question in prose. If the host has
   no structured question tool, ask the same choices as a numbered plain-text
   fallback. Do not select an option for the owner or continue the
   solution-committing write until they answer. If the tool returns no answer
   or a declined response, the choice remains unresolved. End with a short
   statement that work is paused for that choice; do not ask the same question
   again in the final answer or promise either branch of work.
   Invocation alone does not establish that scope;
   route the choice when the current user does not own it. A bare claim that the
   mechanism is already decided, an instruction to skip alternatives, or a
   project roster does not prove this comparison happened. Accept an explicit
   owner selection only after the cheaper option, its evidence, and its tradeoff
   have been stated in the current interaction or an accepted project record;
   otherwise present them once and pause. If evidence supports the current
   implementation class and no credible alternative remains, continue without
   manufacturing options. If evidence is insufficient, preserve the gap and
   route the smallest owner question instead of converting the requested
   mechanism into fact.

A valid result may be that no Technical RFC or implementation project is
needed. When that conclusion changes accepted project truth, record the answer
through its owning artifact and run `hb-change-impact`; do not keep producing
downstream build artifacts merely because the user originally requested them.

### Resume and continue

When the user says "continue", advance every non-blocked part of the operation.
Do not return a no-op just because one branch needs user input.

If a real fork remains, stop at that fork and name the exact user-owned decision
or access issue. Everything else that is safe and already implied should be
done first.

Treat "next?" the same way for an active decision or open-question queue:
record the accepted answer, run cheap validation when it is available, identify
the next unresolved item, and present it with the current context and proposed
answer instead of waiting for the user to manually step the workflow.

### Evidence timing

During shaping, an inline evidence inventory in chat, working notes, or a
working artifact is enough. Do not create formal evidence records only to
prove that brainstorming happened.

Evidence stays human-readable: when the operation reaches write,
finalization, readiness approval, PR-bound review, or batch/source-heavy
work, keep the evidence inventory, claim ledger, and gate summary inside the
artifact, chat, or PR body. No connector-wide access receipts are installed. Record only reads actually
performed; an evidence inventory is an agent report, not independent proof of access.

### Change impact as a conditional step

This section owns the trigger taxonomy for `hb-change-impact`; the
`hb-change-impact` skill owns candidate discovery, semantic comparison, the
durable-behavior check, and result shape. `governance/quality/quality-gates.md` defines gate
semantics and must not maintain a competing trigger list.

Do not run `hb-change-impact` just because work has multiple steps or touches
several files.

Feedback entries follow the [user-feedback exemption](../quality/quality-gates.md#user-feedback-exemption).
Recording a proposed fix in that log does not change durable behavior.

Run `hb-change-impact` when a concrete proposed or observed change may make
another Brain artifact stale or contradictory. Explicit signals include a
Decision `affected_docs` entry, an exact repo-path reference, or a shared source
identifier. Semantic project audits may additionally discover relevant current
Brain evidence for shortlisted project pairs without requiring authored
relationship metadata.

Also run its durable-behavior check when the operation would change repo
behavior:

- workflow contracts
- source-repo skill behavior
- validation or gate rules
- artifact shape or storage path
- source-of-truth boundary
- ownership boundary
- durable governance or decision policy

The semantic trigger is effect-based, not path-based. Paths are deterministic
candidates only. Simple typo, formatting, generated-output, broken-link, or
wording-only edits do not require change-impact analysis when they change no
meaning, behavior, contract, artifact path, validation rule, ownership
boundary, or source-of-truth boundary.

The detector discovers what to inspect; it never declares content stale or
contradictory. The agent compares the changed claims with the candidates. When
sources contradict each other, show the conflict. Ask the current user which
source governs only when their grounded scope covers that choice; otherwise
route an owner review or handoff and keep the conflict blocked. Approved edits
route to existing artifact-specific writers. Decision `affected_docs` statuses
remain owned by `hb-resolve-decision-impact`.

For a durable behavior change, detector results are only an explicit-signal
shortlist. `hb-change-impact` must also define the affected population from the
kind of contract changing, inventory the existing instances and operational
consumers in that population, give each material consumer an explicit
disposition, and preserve migration, rollout, rollback, remaining-consumer,
and approval evidence. A distinct read-only post-edit review repeats that
population check before the change is reported complete. This does not make
scripts semantic judges or create a global impact registry.

When change-impact analysis is not triggered, continue through the normal repo operation:
route the artifact, gather the necessary evidence, write or update only when
ready, validate, and report only user-owned decisions, blockers, material risk,
and final state.

### Semantic project audit

For a meaningful active-project or shipped-feature context change, use
`hb-semantic-project-audit` before PR readiness. The local agent is the primary
semantic review surface: it derives the complete current change set from Git,
compares every changed entry with every other non-dormant active project and
shipped production feature, and deep-reads only a bounded shortlist. Active
entries use `README.md` as their primary semantic document; shipped entries use
`feature-knowledge.md`, with `README.md` accepted only for an existing bootstrap
fallback. It checks duplicate or overlapping owned work,
responsibility contradictions or missing boundaries, and copied mutable truth.

The audit is additive. It never replaces or blocks the deterministic project
identifier overlap check, relationship validation, repository validation, or
any artifact-specific gate. Its findings are advisory and require human
confirmation before an ownership, relationship, merge, or content change.

Delivery behavior is owned by [agent hooks](agent-hooks.md#delivery-binding).
The configured guard recognizes a bounded set of literal push and PR commands;
it does not interpret arbitrary wrappers or perform semantic judgment. CI checks
current digest-bound attestations. Host trust and activation are separate from
checked-in configuration.

The semantic controller prepares a combined base/head tree, uses bounded source
packets and validates response structure and evidence references. Relevant input
changes invalidate the reviewed digest; content-equivalent rebases do not by
themselves establish new meaning. A failed base refresh or merge conflict stops
the transaction. Read the skill for the exact preparation and completion commands.

Controller sessions use owned temporary directories and must be cleaned up on
completion or cancellation. Local delivery-review state under `.brain/` is
ignored and is not canonical project knowledge or a source-access receipt.

### Multi-step skills

No special skill type is required. If a source-repo skill performs a multi-step
repo operation, it inherits this section and declares only local specifics:

- supported target paths
- target surface and write boundary
- required or conditional source lanes
- templates or section contracts
- meaningful gated transitions
- local halt conditions
- validation commands
- PR readiness requirements

Small bounded skills and deterministic scripts do not need this structure unless
they mutate repo state, produce reusable evidence, or participate in a larger
operation's transition.
