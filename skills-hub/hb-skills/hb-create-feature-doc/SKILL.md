---
name: hb-create-feature-doc
description: |
  Canonical writer for one shipped feature knowledge doc under
  `production-features/`. Use when the user wants to document, backfill, or
  refresh released feature knowledge from Jira, Docs, Slides, Figma, Slack, or
  existing repo sources, or says "create feature doc", "document this feature",
  "fill in the feature template", or "write a feature knowledge doc". Do not use
  for product-level overviews or active in-progress feature planning.
---


# Create Feature Doc

Read actual source contents through available, user-configured tools or local
files. No connector, gateway or automatic evidence observer is required or
installed. Use the evidence policy to choose sources by the claims they support.

## Use This Skill When

- you are working directly in this repo
- you want to create or update one shipped or live feature knowledge doc
- the target belongs under `production-features/`

Do not use this skill for:

- whole-product or sub-product context -> route to
  `hb-create-product-context`
- active project work -> route to the `projects-in-progress/` flow
- current implementation reports, API inventories, runtime-state dumps,
  coverage snapshots, or implementation ownership reports copied from code ->
  retrieve those from the actual implementation source when needed
- implementation or execution documents -> resolve the existing project owner

## Supported target

The canonical output is:

```text
production-features/{feature}/feature-knowledge.md
```

This skill does **not** create WIP clones of this artifact under
`projects-in-progress/`.

## Quality Gates

Use the shared gates in `governance/quality/quality-gates.md` and the evidence policy in
`governance/quality/evidence-policies.md`.

Run gates before:

- accepting source readiness for drafting
- drafting shipped feature knowledge
- treating a source package as ready
- writing or updating `feature-knowledge.md`
- accepting a section gap or user-confirmed assumption
- opening a PR

Evidence focus:

- root `AGENTS.md`
- `production-features/README.md`
- existing `production-features/{feature}/README.md`
- existing `production-features/{feature}/feature-knowledge.md`
- an existing evidence package when supplied; do not assume an unmigrated discovery skill
- user-supplied Jira, Drive, Slack, Figma, or local docs
- `knowledge-hub` for reusable product context
- `governance/quality/evidence-policies.md`
- `governance/quality/quality-gates.md`
- implementation code/tests only for implementation, API, runtime, coverage or
  event claims; inspect the relevant revision and separate it from release proof

Report target:

- chat before follow-up questions and before writing
- feature knowledge doc when gaps or assumptions affect the content
- PR description when a PR is opened

Resolve the current surface, ownership and source support before writing.
Missing evidence cannot become fact through a waiver. Preserve qualified reports
and open questions only when the result remains useful and honest. Required
release confirmation for delivered knowledge cannot be replaced by passing tests.

## Artifact Write Boundary

Before creating or updating `feature-knowledge.md`, resolve the artifact write
boundary from `governance/artifacts/artifact-write-boundary.md`.

Expected resolution:

- Artifact type: shipped-feature knowledge
- Owning surface: `production-features/{feature}/`
- Target path: `production-features/{feature}/feature-knowledge.md`
- Maturity state: `canonical`
- Owning workflow or skill: `hb-create-feature-doc`
- Existing-artifact handling: create or update the existing Brain-side feature
  artifact; exact target conflicts require repair or user choice
- Later checks: release confirmation, adjacent evidence, applicability, owner,
  diff review and repository validation

Check the exact target and obvious related feature owners. Execute overlap
checks only from the current surface contract, never from historical Decisions.

## Evidence

Keep inspected read areas and material limitations in chat or the working
record. Never invent access receipts; this repository has no evidence observer.

Read and apply the shared
[grounding standard](../../../governance/quality/evidence/grounding.md#claim-level-grounding-footnotes).
Every material claim promoted from an existing document, codebase, test,
package document, decision, or external source keeps support beside the
statement in `feature-knowledge.md`: a direct link when sufficient, or a concise
footnote when verification context is needed. The workflow evidence inventory
still carries the full audit trail.

## Flow

### 1. Parse the feature target and check the lifecycle boundary

Accept:

- `<feature>`
- an existing evidence package plus `<feature>`

Resolve:

- `production-features/{feature}/feature-knowledge.md`

If the request is actually for a feature still in active delivery:

- stop
- explain that WIP work stays in the `projects-in-progress/` flow
- route the user to the appropriate active-work surface instead of writing
  `feature-knowledge.md`

### 2. Read the local contract and template

Read:

- `production-features/README.md`
- `references/feature-knowledge-doc-template.md`
- the existing `production-features/{feature}/feature-knowledge.md`, if present
- the existing `production-features/{feature}/README.md`, if present

Also read the relevant parent overview when the feature needs
broader product grounding.

Treat the template as the canonical section model and question surface for this
artifact.

### 3. Gather sources first

Before asking the user section-by-section, gather as much evidence as possible
from:

- the existing bootstrap `README.md`
- links embedded in the bootstrap file
- links or files the user supplied
- an existing evidence package, when supplied
- related repo-local project artifacts when they still exist
- relevant knowledge-hub docs and decision records when they materially help
  rationale, lineage, or contradiction checks

Preserve every source link that the user supplied or that materially supports the
doc. When a source is used in the written artifact, include it as a clickable
Markdown link in the grounding note or the relevant section instead of reducing
it to plain text like "the deck" or "the Figma".

Use a verification-first, high-effort posture. If the current host cannot read
or verify a source that materially matters, say so and keep the gap explicit.

For experiments, inspect the actual experiment specification and result report
when relevant. Distinguish running tests, measured outcomes and confirmed rollout.
Fold a confirmed behavior change into the main feature description; a winning
experiment is not evidence that every user has received it.

Audit any supplied evidence package claim by claim. Required lanes follow the
claim: release evidence for availability, design for intended interaction, code
and tests for implementation, research for reported user findings. A URL or
package summary is not a successful read. Keep unavailable material lanes visible
and leave affected conclusions provisional. No named vendor service is mandatory.

For multi-feature work, audit each feature independently. A batch-level gate
summary cannot replace a per-feature source package, claim ledger, section
coverage table, and readiness state.

Treat documents, tickets, messages and code as evidence within what each can
establish. Reuse sufficient extracted Brain context with its limitations; follow
nested sources when support, contradiction or freshness requires it. Existing
project material can support rationale, but release claims need release evidence.

For implementation claims, search relevant filenames and exact symbols first,
then inspect matching files and close dependencies. Record the revision and the
area searched when a claim remains partial or no match is found. Avoid broad
repository reads. Synthesize stable delivered behavior rather than copying an
API inventory or runtime snapshot into durable knowledge.

Good grounding targets include:

- packages whose names, exports, or manifests match the feature/component
- tests or fixtures covering the user behavior
- public APIs, manifests, action definitions, experiment/spec keys, or BI event
  emitters named by the source evidence
- existing Brain production-feature bootstrap docs:
  `production-features/{feature}/README.md` and
  `production-features/{feature}/feature-knowledge.md`

When source evidence and shipped-state evidence disagree, write only the
grounded shipped-state behavior as the final fact. Keep the disagreement out of
the final doc unless it explains a current product limitation or unresolved
ambiguity. Record stale, proposed, historical, contradicted, or ungrounded
evidence as a source-package or gap note instead of narrating implementation
history in the feature doc.

If the user provided no sources and no relevant repo-local sources are
discoverable, say that explicitly and switch to interview-only mode. In that
mode, walk the owner through the template section by section, keep every answer
marked as user-confirmed, and leave unknown sections explicit instead of
inventing product goals, data, user voice, owners, dates, competitors, metrics,
risks, or roadmap facts.

### 4. Run a source extraction pass against the template

Use the template's section prompts as an internal extraction checklist.

For each section:

- try to answer the questions from the gathered sources first
- prefill the section from grounded evidence
- mark the section as:
  - `OK` — all section questions were answered from sources
  - `partial` — some answers were grounded, but follow-up is still needed
  - `missing` — the current sources do not answer the section meaningfully

Before any follow-up questioning, present a compact table:

| Section | Status | Notes |
|---|---|---|
| Product Goal | OK | bootstrap + requirement doc agree |
| Data Foundation | partial | source exists, KPI baseline still unclear |
| Competitor Landscape | missing | no grounded source found |

### 5. Continue the original section flow only for gaps

Keep the section model and question surface, but use it only for
the sections still marked `partial` or `missing`.

For each unresolved section:

- show the extracted draft or evidence already found
- ask only the leftover questions that the sources did not answer, using the
  focused prompts from the template
- preserve explicit gaps when the user cannot ground them further
- draft the revised section and ask the user whether it is good, needs edits, or
  should stay marked as a gap

Do not restart a full interview for sections already marked `OK`.

### 6. Draft or update the feature knowledge doc

Write or revise:

- `production-features/{feature}/feature-knowledge.md`

Use the template shape from `references/feature-knowledge-doc-template.md`.
Do not add new top-level sections unless the template is intentionally changed
through the preflight process. Source or implementation evidence should live in the
optional Grounding note or in the relevant template section, not in a custom
appendix such as "Implementation Grounding".

Preserve the existing doc when it already contains good grounded content.
Improve sections from evidence instead of rewriting them for style alone.

Attach a direct source link or contextual footnote beside material sourced
statements while drafting. Preserve the source's actual support state and
extracted fact; do not replace adjacent support with a detached source list.

When a section cannot be completed honestly:

- keep the gap explicit
- do not invent metrics, quotes, competitor behavior, owners, dates, or
  roadmap facts

### 7. Validate before write

Before writing, check that:

- the doc still belongs to shipped feature knowledge rather than WIP planning
- every section is either:
  - grounded well enough to draft
  - explicitly partial
  - explicitly missing
- no fabricated metrics, quotes, or competitor claims slipped in
- the final doc preserves the template contract without pretending unsupported
  sections are complete
- the final doc does not introduce top-level headings outside the template unless
  the template was explicitly changed in this same approved workflow
- user-supplied and material source links are preserved as clickable Markdown
  links in the doc
- every required or triggered source lane is inspected sufficiently, not needed
  with a reason, or visibly blocked with the affected conclusion provisional
- every inspected lane has a read area, extracted evidence and supported claim
- each feature has its own evidence coverage when work is batched
- material source claims are grounded against the right source lane for their
  claim type
- every externally grounded material statement has adjacent support, and every
  footnote reference used for verification context has exactly one non-empty
  definition with no orphan definitions
- material product and UX claims were cross-checked against relevant Brain-side
  peer files in `knowledge-hub/`, sibling `production-features/`, and
  `projects-in-progress/` when those lanes are available and in scope
- user intents are framed in user language, not internal product jargon
- data, user voice, and competitor claims name their sources or remain explicit
  gaps
- success metrics distinguish measured facts from aspirational targets
- open issues have an owner and target date, or those fields are explicitly
  missing

Surface any remaining `partial` or `missing` sections before final approval.
Show the final preview or updated section diff. Ask whether to save, fix gaps
or keep working only when authorization or a material choice is unresolved;
otherwise proceed within the existing request.

### 8. Save within the authorized scope

Show the resulting file or diff and material gaps. Use the current request's
write authorization; do not ask again for an already authorized save. Resolve
ambiguous scope, lossy replacement and new durable rules with the owner first.
Write only the resolved target. Preserve unrelated content and do not refresh
verification dates merely because text was edited. If saving unfinished work,
use `.working.md` beside a valid canonical target; release confirmation remains
required before a feature is represented as delivered.

### 9. Validate and report

Run `npm test` and `npm run check`, then review evidence and meaning separately.
Report the exact file, supported behavior and remaining gaps. Commit and push
only within authorization. Ask Ivan for explicit approval for each PR creation;
never post PR comments without explicit authorization for that action.

## Guardrails

- ALWAYS keep this skill scoped to shipped or live feature knowledge
- ALWAYS gather and extract from sources before interviewing the user
- ALWAYS preserve user-supplied and material source links as clickable Markdown
  links in the generated document
- ALWAYS apply the shared grounding standard to material
  claims derived from inspected sources
- ALWAYS audit source packages against the actual claims and required evidence lanes
- ALWAYS ground material source claims against the right evidence lane for their
  claim type before treating them as final production behavior
- ALWAYS show the section-status table before asking follow-up questions
- ALWAYS use the template prompts as the extraction and gap checklist
- ALWAYS preserve existing grounded sections that are already useful
- ALWAYS preserve the template's top-level section contract unless a template
  change was explicitly approved through `hb-change-impact`
- NEVER create this artifact under `projects-in-progress/`
- NEVER accept a batch-level gate summary as a substitute for per-feature
  evidence records
- NEVER invent data, user voice, competitor claims, or roadmap facts
- NEVER treat the inherited bootstrap `README.md` as sufficient by itself
- NEVER turn RFCs, planning docs, Jira tickets, Slack messages, Figma URLs, or
  decks into final-state facts without reading the relevant content and
  resolving material gaps or contradictions
- NEVER add a new top-level section because the evidence feels useful; fold it
  into Grounding or the relevant template section
- NEVER overwrite an existing feature knowledge doc outside the authorized scope or without showing the resulting diff

## Anti-Fabrication Rules

These are non-negotiable because unsupported product knowledge is worse than an
explicit gap.

1. No invented metrics. If a section needs adoption, frequency, funnel,
   retention, or business impact data and no source exists, write the gap.
2. No invented user quotes. Use real quotes only when a real source is named; if
   the source gives themes but no quotes, write the theme in third person.
3. No invented competitor behavior. If a competitor approach cannot be
   verified, say that no grounded source was found.
4. No generic risk padding. Risks must be specific to the feature or preserved
   as missing.
5. No invented owners, launch dates, roadmap commitments, or target KPI values.
