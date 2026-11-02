# Evidence And Freshness Gates

## Statement Evidence Review

Apply the [statements, evidence, and precedents model](../evidence-policies.md#statements-evidence-and-precedents)
while authoring and reviewing material sourced statements, and when a known
source change affects an existing document. The owning writer retains authority
over the document; this procedure does not authorize a wider source crawl or
changes to another owner's decisions.

1. Identify the materially affected statements, including table cells and
   diagram annotations. Read their direct support and footnote definitions.
   Separate requirements/proposals from existing implementation and release facts.
   Find repeated statements and summaries of the changed behavior throughout the
   affected document; a correction in one section does not repair a stale claim
   in another. This includes carried-forward wording and reused notes.
2. Establish what each relevant source actually supports. Inspect the necessary
   area, revision, source status, and execution conditions. Reuse sufficient
   extracted Brain support honestly; follow the nested-source rule when deeper
   recovery is needed. Confirm the completed read output contains the source
   area used by the statement. A file list, named path, or successful command
   is not that content; retry a bounded read or leave the claim unverified.
   Access telemetry is not semantic proof.
3. Check the relationship: does the support establish the full wording, only
   part of it, or another fact? Preserve human-report and uninspected-source
   limits. Reassess reused evidence and waivers when meaning or intended use
   changes. Label a check waived only when a person granted that exact scope;
   an open or blocked check remains a gap. Unrelated gaps elsewhere do not
   invalidate a supported passage.
   Keep conclusions within the inspected flag, environment and execution
   conditions. Inspect the other branch before making a claim about both states;
   a condition in another section cannot qualify an unconditional summary.
   When the source-to-statement relationship is not obvious, record a short,
   checkable support rationale in the existing claim ledger or gate report:
   what the inspected source shows, why it supports the exact wording, and any
   material limit or competing reading. An explanation cannot replace source
   content or rescue an unsupported statement.
4. Compare relevant contradictory evidence. Keep intent, implementation,
   observation, and release distinct. Correct established factual/attribution
   errors; do not silently choose an unresolved product or ownership outcome.
   Compare a material precedent's context and quality before using it as rationale.
5. Retain, correct, qualify, remove, or route each affected statement. Update its
   support together with the wording through the owning writer. Keep material
   limitations visible in the body and concise verification context in the note.
   Keep working support rationales in the review record. Carry one into a
   footnote only when future readers need that explanation; a direct link is
   enough when support is clear without it.
   Remove obsolete references/definitions; preserve still-applicable approvals,
   rationale, and compatibility constraints. Do not append an investigation log.
6. Record the result in the existing evidence inventory or gate report. Verify
   citation integrity and the actual source-to-statement match separately.
   A source path written only as prose or code is not a clickable locator; use a
   direct source link or a footnote whose definition links to the source when
   affected claims need that source. A clickable footnote marker alone does not
   make a plain-path definition a source link.
   For changed or reused repo-relative source links in affected claims, resolve
   the target from the document's actual directory and check the intended file
   exists. A valid footnote marker or a successful source read does not establish
   that the document link works. External access follows the source-lane rules.
   A completed audit, a passing structural check, or publication of a proposal
   does not resolve a known wrong statement or establish readiness. Correct or
   visibly qualify an established error before treating affected content as ready;
   genuine unresolved decisions stay open and routed to their owner.

For a new or materially revised Technical RFC, that changes implementation statements, use a second agent for a final evidence
review before reporting the affected statements as ready. Give that reviewer the
draft, changed scope, relevant source locations, and any human permission. The
reviewer must obtain the supporting source content in its own completed tool
output, compare each changed material statement with that content, resolve
source links from the document directory, and compare each claimed waiver with
the person's exact permission and transition. For each non-obvious changed
material statement, the reviewer must write its own concise support-or-challenge
rationale from the inspected source, including any material limit; it must not
merely endorse the writer's explanation. Do not accept the writer's access log,
citation table, or gate result as proof of those checks. Record the
reviewer's findings in the existing gate report and repair the draft before a
pass. If a second agent is unavailable, report the review as unperformed and
do not claim an evidence-review pass or PR readiness.
The reviewer has no authority to change another owner's decision or expand the
source scope.

For PR-bound work, expose concise rationales for non-obvious changed material
statements and any material reviewer challenge in the existing PR gate evidence,
or point to the changed document location that contains the explanation. A
session-only ledger or chat message is not enough for PR review. Do not publish
the agent's private reasoning trace or copy the full investigation into the PR.

Review the affected scope, not every statement in the repository. Writers invoke this procedure when
requirements, designs, human decisions, or other evidence changes are supplied.
It does not promise discovery of unreported external changes.

## Gate: source-readiness - Evidence Policy And Source Readiness

**Question:** Did the workflow inspect the source lanes required for this task?

**Why this gate exists:** Agents drift when source selection is implicit. The
required lanes must be visible before drafting.

Agent steps:

1. Open [evidence-policies.md](.././evidence-policies.md).
2. Select the closest source-lane profile.
3. Copy the profile's `required` and triggered `conditional` lanes into the
   evidence inventory.
4. For each lane, mark one status: `inspected`, `blocked`, `not relevant`, or
   `deferred with user approval`.
5. For each `not relevant` or `deferred` lane, write a one-line reason.
6. Do not mark a lane `inspected` if only a URL/path was found.
7. For source-recovery work, record the source-lane trajectory: query/tool
   route, access result, source depth, links followed, discarded sources, and
   unresolved gaps.
8. If a required or triggered conditional lane is `blocked`, stop and ask the
   user to solve access, narrow the claim, or explicitly waive the lane before
   drafting, writing, finalizing, or opening a PR.
9. Before describing a source as analysed or presenting a recommendation as
   evidence-grounded, apply the evidence-honesty invariant in
   [evidence-policies.md](.././evidence-policies.md). Exploration may continue with
   incomplete evidence only when the missing lane and affected conclusion stay
   visibly provisional.

Pass when:

- Every required lane has a status and reason.
- Every triggered conditional lane has a status and reason.
- No required or triggered material lane is blocked or deferred without
  explicit user approval.
- No `normally out-of-scope` lane was read without a task-specific reason.

Fail when:

- A required lane is missing from the inventory.
- A lane is marked `inspected` but only a URL/path was found.
- A lane is marked `inspected` without a query/tool route, access result, and
  read-area or extraction record.
- A required or triggered material lane is `blocked` and the workflow continues
  as ready or PR-ready.
- A blocked lane is used to support a claim instead of being treated as an
  access problem, waived gap, or user-confirmed assumption.
- implementation sources product knowledge is used as a default duplicate check for
  `production-features/`.
- A batch-level report hides per-target lane statuses.
- A declared source is a machine-local or ephemeral identifier: a local
  filesystem path, `file://`, a loopback/private-network URL, or a
  presigned/expiring URL (hook-enforced:
  `source-readiness/non-portable-source` family).

Record:

- selected profile
- required lanes
- triggered conditional lanes
- source-lane trajectory for source-recovery work
- skipped lanes with reasons

## Gate: claim-grounding - Source-To-Claim Grounding

**Question:** Did the agent read source content deeply enough and map material
claims to support?

**Why this gate exists:** Finding links is not research, and unsupported claims
become bad reusable context. A URL cannot support a claim until its relevant
content was read or extracted and the claim support is visible.

Agent steps:

1. For every source used by the output, assign a depth from
   [evidence-policies.md](.././evidence-policies.md):
   `link-found`, `read`, `extracted`, `cross-checked`,
   `needs-deeper-source`, `blocked`, or `not needed`.
2. If depth is `link-found`, do not use that source to support any claim.
3. If depth is `read`, record the exact section, heading, node, page, or local
   file area that was read.
4. If depth is `extracted`, record the fact, constraint, gap, or contradiction
   extracted from the source.
5. If a Brain doc contains upstream URLs, first check whether the Brain doc
   already contains the needed fact.
6. If the Brain doc does not contain the needed fact but an upstream URL may,
   mark `needs-deeper-source` and ask the user before expanding the search.
   The wording can vary, but the message must say both facts:
   available extracted data is not enough, and reading upstream URLs again is
   one possible next step.
7. If access to a material source fails, record the attempted access and stop
   for access repair or an explicit user waiver before treating the affected
   section or claim as complete.
8. For batch work, repeat source-depth records per target. Do not use one shared
   "source inspected" claim for multiple target documents unless every target
   has the same source support recorded.
9. When multiple evidence passes exist for the same claim, reconcile them before
   using the claim. A narrower or later pass must not silently replace broader
   evidence already found.
10. Apply [Statement Evidence Review](#statement-evidence-review) to the draft
    or planned output's material claims.
11. Treat these as material claims by default: product behavior, UX behavior,
    a11y behavior, translation/content keys, implementation behavior,
    ownership, launch state, KPI, metric, event, risk, scope, timeline,
    dependency, durable repo rule.
12. For each material claim, attach one support level: `single-source`,
    `cross-checked`, `conflict`, `gap`, or `user-confirmed`.
13. If the support level is `gap`, rewrite the claim as an unknown or stop.
14. If the support level is `user-confirmed`, say that it is user-confirmed.
15. For artifact Markdown covered by the grounding contract, attach the
    statement-adjacent support required by
    [evidence-policies.md](../evidence/grounding.md).
    Governance documents do not use claim-level grounding footnotes.
16. When a material alternative was already surfaced, keep it visible until it
    is selected, rejected with an evidence-grounded reason, made irrelevant by
    a recorded scope change, or explicitly left open. Do not silently remove it
    when narrowing the recommendation.

Pass when:

- Every source used for a material claim has depth `read`, `extracted`, or
  `cross-checked`.
- Every `link-found` source is treated as discovery only.
- Every `needs-deeper-source` source is reported as a gap or permission request.
- Every `blocked` material source is reported as an access problem, and the
  affected claim is absent, a visible gap, or user-confirmed after waiver.
- Every material claim has a support level.
- Every externally grounded material claim has the statement-adjacent support
  required by the grounding contract, with material support limitations visible.
- Broader evidence already found is reconciled before writing a narrower claim.
- Every `gap` remains visible in the output.
- No unsupported claim is written as fact.

Fail when:

- The output cites a source that was not opened/read.
- The evidence inventory lists only URLs.
- The evidence inventory omits the section, heading, node, page, message, or
  file area read for a material source.
- A material source is `blocked` but the related section is treated as complete
  or the output is marked ready.
- The output claims something from a production-feature upstream URL that is not
  present in the production-feature doc and was not separately inspected.
- A material claim has no source.
- A material claim derived from an inspected source lacks the statement-adjacent
  support required by the grounding contract.
- Ownership is inferred from a file name or path only.
- KPI, metric, event, launch, or implementation claims are invented.
- A narrower evidence pass is written as fact while broader evidence already
  found remains unreconciled.
- A batch output reports source-to-claim grounding without per-target
  source-depth records.
- A source is described as read, reviewed, checked, or analysed without a
  successful access and a human-readable read-area record. Automatic
  [access records](../evidence/access-records.md) establish only their supported
  transport coverage, not statement support.
- A material alternative disappears from a recommendation without a grounded
  closure reason, recorded scope change, or explicit open state.

Record:

- claim
- support level
- source
- depth
- relevant section/node/file area read
- extracted fact or gap
- supported section or material claim
- source link or footnote ID tying support to the statement
- permission needed for deeper source, if any

## Gate: cross-reference - Cross-Reference And Contradiction

**Question:** Were high-impact claims checked against a second relevant source
lane when needed?

**Why this gate exists:** Single-source claims can be stale or incomplete. High
impact claims need a second check when another relevant lane exists.

Agent steps:

1. Identify high-impact claims. Use this list:
   scope change, source-of-truth rule, shipped behavior, implementation
   behavior, ownership, analytics event, KPI, accessibility requirement,
   launch/current-state claim, risk/dependency claim.
2. For each high-impact claim, choose the peer lane from
   [evidence-policies.md](.././evidence-policies.md).
3. Check the peer lane if it is available and in scope. For Agentic Brain
   product or UX claims, peer lanes include repo-local reads from relevant
   `knowledge-hub/` docs, sibling `production-features/` docs, and
   `projects-in-progress/` docs when active-work context is material.
4. If peer evidence agrees, mark `cross-checked`.
5. If peer evidence disagrees, mark `conflict` and name both sources.
6. If no peer lane is available or the user did not approve deeper source
   expansion, keep the claim as `single-source` and say why.
7. Treat evidence-scope regressions as contradictions: if earlier or broader
   evidence indicates wider scope, impact, or risk than a later narrower pass,
   reconcile the difference before approving the narrower claim.
8. For new or changed structured artifacts, compare proposed fields against
   existing validators, schemas, scripts, and docs that already own related
   fields. Treat two-writers-of-the-same-field collisions as contradictions
   before drafting or approving the proposal.

Pass when:

- High-impact claims are cross-checked or explicitly marked `single-source`
  with a reason.
- Available in-scope Brain peer files were actually read before being used as
  cross-reference support.
- Conflicts are named and not silently resolved.
- Broader-vs-narrower evidence conflicts are reconciled before the narrower
  result is treated as final.
- New structured-artifact fields do not duplicate ownership already held by an
  existing validator, schema, script, or canonical artifact.

Fail when:

- A high-impact claim is treated as final after only shallow evidence.
- A relevant in-scope Brain peer lane exists but is skipped and the claim is
  still presented as fully cross-checked or final.
- Conflicting sources exist and the output chooses one without saying why.
- A stale document overrides a newer or more canonical source without note.
- A narrower follow-up search overrides a broader finding without explaining why
  the broader finding no longer applies.
- A new structured artifact re-declares fields already owned elsewhere without
  resolving which artifact is canonical.

Record:

- claim
- primary source
- peer source or reason not checked
- result: `cross-checked`, `single-source`, or `conflict`

## Gate: freshness - Freshness

**Question:** Is the source current enough for the claim being made?

**Why this gate exists:** Old, proposed, extracted, or historical sources must
not be treated as current truth by accident.

Agent steps:

1. For each current-state claim, identify the source lifecycle state:
   active, proposed, decided, shipped, stale, historical, extracted, unknown.
2. If the source has a date, record it.
3. If the source has no date and freshness matters, mark freshness as unknown.
4. Do not use extraction time as approval/finality time.
5. For repo-authored human-facing dates such as decision `date`,
   `review.reviewed_at`, `resolved_at`, or incident dates, use the current
   session date in the repo's default date format. Treat dates in handoffs,
   prior artifacts, templates, or source material as source dates, not as the
   authoring, review, or finality date.
6. If current truth cannot be confirmed, write the claim as historical or
   unknown.
7. In `production-features/`, treat current implementation details from Cold
   Storage as on-demand evidence, not durable feature knowledge. Convert only
   stable shipped behavior into the feature doc; do not store copied current
   implementation reports as canonical Brain truth.

Pass when:

- Current-state claims have current-state support.
- Stale or historical sources are labeled.
- Unknown freshness is visible when it matters.

Fail when:

- A stale Slack/Drive/Figma/Jira source is presented as current truth.
- A Figma extraction timestamp is treated as design approval.
- A repo-authored decision, review, resolution, or incident date is inherited
  from a handoff, prior artifact, template, or source material instead of using
  the current session date.
- A Decision that says no choice has been made is treated as an accepted answer.
- A volatile implementation snapshot is stored in `production-features/` as
  current durable knowledge instead of being retrieved from implementation sources when
  needed.

Record:

- claim
- source date/state
- repo-authored date used, when relevant
- freshness result
- wording change if needed
