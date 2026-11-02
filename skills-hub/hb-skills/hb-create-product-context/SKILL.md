---
name: hb-create-product-context
description: |
  Canonical writer for one standardized product overview under
  `knowledge-hub/`. Use when the user wants a product or sub-product
  overview built or refreshed from Docs, Slides, Jira, existing hub docs, and
  other grounded product sources, or says "create product context", "create a
  product overview", "document the product", or "create a knowledge base for
  this product area". Do not use for single-feature documentation.
metadata: {"brain":{"ownership_class":"canonical-writer","user_invocation":"direct","governed_by":["governance/artifacts/artifact-writer-map.md","governance/skills/skill-metadata.md"],"gate_profile":"standard-authoring","artifacts":[{"id":"product-overview","role":"final-writer","paths":["knowledge-hub/{document}.md"]}]}}
---


# Create Product Context

Read actual source contents through available, user-configured tools or local
files. No fixed connector or gateway is required. Automatic access recording follows
`governance/quality/evidence/access-records.md`; report unsupported or inactive
channels as gaps. Use the evidence policy to choose sources by claim support.

## Use This Skill When

- you are working directly in this repo
- you want to create or update one durable product overview doc
- the target belongs under `knowledge-hub/`

Do not use this skill for:

- one shipped or live feature -> route to `hb-create-feature-doc`
- one active project -> route to the `projects-in-progress/` flow
- one decision -> route to `hb-add-decision`

## Supported target

Routine writes should resolve to:

```text
knowledge-hub/{scope}-overview.md
```

This section model applies only to product overview documents, not every hub reference.

## Quality Gates

Use the shared gates in `governance/quality/quality-gates.md` and the evidence policy in
`governance/quality/evidence-policies.md`.

Run gates before:

- drafting reusable product context
- writing or updating the product overview
- accepting a section gap or user-confirmed assumption
- opening a PR

Evidence focus:

- root `AGENTS.md`
- `knowledge-hub/README.md`
- existing product overview docs
- supplied Docs, Slides, Jira, or other product sources
- related decisions and repo-local product docs
- `production-features/` for shipped precedent and existing product behavior
- `governance/quality/evidence-policies.md`
- `governance/quality/quality-gates.md`

Report target:

- chat before follow-up questions and before writing
- product overview when gaps or assumptions affect the durable content
- PR description when a PR is opened

Resolve the current surface, ownership and source support before writing.
Missing evidence cannot become fact through a waiver. Preserve qualified reports
and open questions only when the result remains useful and honest. Required
release confirmation for delivered knowledge cannot be replaced by passing tests.

## Evidence

For the authored Knowledge Hub Markdown, apply the
[shared statement-grounding rule](../../../governance/quality/evidence/grounding.md#claim-level-grounding-footnotes):
put a direct source link beside each material sourced statement when sufficient,
or a concise end-of-file footnote when verification context matters.

Keep inspected read areas and material limitations in chat or the working
record. Never invent access receipts; apply `governance/quality/evidence/access-records.md`
and preserve its host and transport coverage limits.

## Flow

### 1. Parse the target and validate the surface

Accept:

- `<target>`
- or a product scope that can resolve to `knowledge-hub/{scope}-overview.md`

If the request is actually:

- feature-specific shipped snapshot material -> route to
  `production-features/{feature}/feature-knowledge.md`
- active project work -> route to `projects-in-progress/`
- non-product hub content -> route to the correct `knowledge-hub` subtree

then stop and explain the correct surface instead of writing here.

### 2. Read the subtree contract and template

Read:

- `knowledge-hub/README.md`
- `references/product-overview-template.md`
- the existing target file, if present

If the target is a sub-scope doc, also read
the relevant parent overview when it helps align terminology or
product framing.

Treat the local skill reference template as the canonical section model for
`knowledge-hub/*-overview.md`.

### 3. Gather sources first

Before asking the user section-by-section, gather as much evidence as possible
from:

- the existing target file, if present
- existing product overview docs in `knowledge-hub/`
- links or files the user supplied
- related decisions and repo-local product docs that materially help

Use a verification-first, high-effort posture. If a claim cannot be grounded
from the current sources, keep that uncertainty explicit.

If the user provided no sources and no relevant repo-local sources are
discoverable, say that explicitly and switch to interview-only mode. In that
mode, walk the owner through the template section by section, keep every answer
marked as user-confirmed, and leave unknown sections explicit instead of
inventing product, roadmap, persona, or metrics facts.

### 4. Run a source extraction pass against the template

Use the template's section prompts as an internal extraction checklist.

For each section:

- try to answer the questions from the gathered sources first
- prefill the section from grounded evidence
- mark the section as:
  - `OK`
  - `partial`
  - `missing`

Before follow-up, present a compact table:

| Section | Status | Notes |
|---|---|---|
| What the product is | OK | existing overview covers this directly |
| Roadmap And Scope | partial | roadmap theme present, out-of-scope still thin |
| Key Metrics And North Star | missing | no grounded metrics source found |

### 5. Continue the original section flow only for gaps

Keep the section model and question surface, but ask the user only
about the sections still marked `partial` or `missing`.

For each unresolved section:

- show the extracted draft or evidence already found
- ask only the leftover questions that the sources did not answer, using the
  focused prompts from the template
- keep gaps explicit when evidence is still weak
- draft the revised section and ask the user whether it is good, needs edits, or
  should stay marked as a gap

Do not restart a full section-by-section interview for `OK` sections.

### 6. Draft or update the product overview

Write or revise:

- `knowledge-hub/{scope}-overview.md`

Use the shared product-overview template from `references/product-overview-template.md`.

Preserve grounded existing content where it is already good.
Do not rewrite durable product facts just to normalize style.

### 7. Validate before write

Before writing, check that:

- the doc still belongs to durable product context rather than feature-local or
  workflow-local state
- every section is either:
  - grounded well enough to draft
  - explicitly partial
  - explicitly missing
- the output stays within `knowledge-hub/`
- the standardization stays scoped to the product overview workflow and does not imply a
  schema for other reference types
- no placeholder text such as `[X%]`, `[placeholder]`, `TBD`, or `TODO` remains
  unless it is intentionally part of an explicit gap
- glossary terms cover product-specific terminology used elsewhere in the doc
- owner, last-updated, status, and purpose fields are filled or explicitly
  marked as missing

Report validation in a compact summary, for example:

```text
Validation:
- complete: 8 sections
- partial: Roadmap And Scope
- missing: Key Metrics And North Star
- blockers before final: owner still unknown
```

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

- ALWAYS keep this skill scoped to `knowledge-hub/`
- ALWAYS extract from sources before questioning the user
- ALWAYS show the section-status table before follow-up
- ALWAYS use the shared product-overview template as the section model
- ALWAYS preserve existing grounded sections that are already useful
- NEVER imply that the same schema governs other shared references
- NEVER invent product, roadmap, persona, or metrics facts to make the doc
  feel complete
- NEVER overwrite an existing product overview outside the authorized scope or without showing the resulting diff

## Shared review profile

Use `governance/quality/gates/gate-profiles.md`: `standard-authoring`.
Use `governance/quality/evidence/source-lanes.md`: PM / Product Context.
Apply these agent review procedures at this skill's existing write/finalization
transitions; preserve its local halt and waiver rules. The current structural
validator does not enforce these declarations. Report material findings in chat
and, when authorized, relevant PR evidence. A read-only helper stays read-only.
