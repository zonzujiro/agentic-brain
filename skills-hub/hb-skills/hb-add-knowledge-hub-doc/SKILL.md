---
name: hb-add-knowledge-hub-doc
description: |
  Canonical source-repo Agentic Brain skill for authoring or updating one
  knowledge-hub document.
metadata: {"brain":{"ownership_class":"canonical-writer","user_invocation":"direct","governed_by":["governance/artifacts/artifact-writer-map.md","governance/skills/skill-metadata.md"],"gate_profile":"standard-authoring","artifacts":[{"id":"shared-reference","role":"final-writer","paths":["knowledge-hub/{document}.md"]}]}}
---


# Add Knowledge-Hub Doc

This is the canonical fast-changing knowledge-hub authoring skill for
source-repo work in Agentic Brain.

## Use This Skill When

- you are working directly in this repo
- you want to add or update one durable shared-reference document under
  `knowledge-hub/`
- you want the latest boundary and grounding behavior

## Supported targets

Resolve one Markdown reference under `knowledge-hub/`, following its current
README. Append `.md` when omitted. An existing subtree must have an owning README;
do not create a new family, taxonomy, or workflow-relevant subtree from a supplied
path alone. A flat reference is sufficient for a small Brain.

## Quality Gates

Use the shared gates in `governance/quality/quality-gates.md` and the evidence policy in
`governance/quality/evidence-policies.md`.

Run gates before:

- drafting durable shared-reference content
- writing or updating a Knowledge Hub doc
- accepting weak grounding as a gap
- opening a PR

Evidence focus:

- root `AGENTS.md`
- `knowledge-hub/README.md`
- target subtree README
- existing target doc and nearby sibling docs
- supplied canonical source material
- `production-features/` when shipped precedent or existing product behavior is
  part of the claim
- relevant reusable domain hub docs
- `governance/quality/evidence-policies.md`
- `governance/quality/quality-gates.md`

Report target:

- chat before drafting and before writing
- target document when gaps, assumptions, or source limits affect the content
- PR description when a PR is opened

Waiver rule:

- Resolve the current owning surface, authority and evidence readiness before
  writing. Wrong targets and unsupported claims cannot be waived by the agent.
- A durable hub contract, subtree or boundary change needs change-impact review
  and the owner approval required by operating rules. These are agent checks,
  not automatic validator enforcement.
- Weakly grounded reusable domain claims must stay as visible gaps,
  single-source claims, or user-confirmed assumptions.

## Artifact Write Boundary

Before creating or updating a Knowledge Hub doc, resolve the artifact write
boundary from `governance/artifacts/artifact-write-boundary.md`.

Expected resolution:

- Artifact type: durable reusable domain reference
- Owning surface: `knowledge-hub/`
- Target path: resolved target doc under the selected subtree
- Maturity state: `canonical`, or `working` only when writing an explicit
  `*.working.md` artifact that would finalize to a valid Knowledge Hub target
- Owning workflow or skill: `hb-add-knowledge-hub-doc`
- Existing-artifact handling: create or update the selected doc; exact target
  conflicts require repair or user choice
- Later checks: source support, applicability to intended readers, freshness,
  ownership, final diff and repository validation. PR creation needs explicit approval.

Do not write active project state, repo workflow guidance, runnable code,
package manifests, or helper scripts into `knowledge-hub/`.

## Evidence

Keep evidence and review notes in chat or the existing working artifact.
Use `governance/quality/evidence/access-records.md` for automatic recording and its coverage limits. Describe inspected source areas and
material access gaps honestly; never invent a machine receipt.

Read and apply the shared
[grounding standard](../../../governance/quality/evidence/grounding.md#claim-level-grounding-footnotes).
Every material claim promoted from an existing document, codebase, test,
package document, decision, or external source keeps support beside the
statement in the durable reference: a direct link when sufficient, or a concise
footnote when verification context is needed. The workflow evidence inventory
still carries the full audit trail.

## Flow

### 1. Parse the target

Accept:

- `<target>`

Resolve the exact path inside `knowledge-hub/`. Reject traversal outside that
surface. If purpose or owner is ambiguous, ask the smallest clarifying question.

### 2. Validate that knowledge-hub is the right surface

Read:

- `knowledge-hub/README.md`
- the target family `README.md` when present

Before drafting, decide whether the requested content belongs in
`knowledge-hub/` at all.

If the request is actually:

- repo workflow, artifact flow, or Brain operating-model guidance -> route to
  `governance/`
- active project work, feature-local state, or delivery coordination -> route
  to `projects-in-progress/{project}/`
- shipped or live feature snapshot material -> route to `production-features/`
- reusable skill/package behavior -> route to `skills-hub/`

then stop and explain the correct canonical surface instead of writing into the
hub.

For a product-wide overview, use `hb-create-product-context` as the owning writer
for `<scope>-overview.md`; do not author a competing general reference.

### 3. Validate subtree scope

Use the current hub README and any existing subtree contract. If the request
introduces a durable taxonomy or workflow dependency, run
[change-impact review](../hb-change-impact/SKILL.md) before adopting it. Do not
require separate product, design or analysis folders for a personal project.

### 4. Read local conventions and current context

Read:

- the hub README and target subtree README, if any
- the existing target file, if it exists
- a small set of nearby sibling docs only when needed to infer local
  conventions

Preserve the local conventions of the target subtree:

- frontmatter or no frontmatter
- heading style
- source / owner / freshness fields when that subtree already uses them
- level of structure that the subtree already treats as normal

Do not force a universal schema on unrelated knowledge.

### 5. Gather grounding before drafting

Collect the substance needed for the doc:

- the actual source material
- named owner when relevant
- freshness signal when relevant

For factual reusable domain claims:

- prefer existing canonical repo docs, discipline-authored hub docs, and
  user-provided source material
- distinguish grounded facts from local inference

If missing evidence is essential to a material conclusion, stop that conclusion
and surface the gap. A reference may preserve an attributed report, single-source
claim or explicitly unresolved question when its limited support is clear and
it does not present an unverified conclusion as settled guidance.

### 6. Guide the draft

Structure and refine the user's content into a durable shared-reference doc.

Keep the content:

- reusable beyond the originating delivery task, with applicability stated
- stable beyond one active delivery thread
- aligned with the local target subtree

Do not invent decisions, roadmap facts, domain rules, definitions, owners,
or current product status.

Attach a direct source link or contextual footnote beside material sourced
statements while drafting. Preserve the source's actual support state and
extracted fact; do not replace adjacent support with a detached source list.

### 7. Run inline reviewer posture before write

Before writing, challenge the draft on:

- wrong-surface placement
- feature-local or workflow-local content disguised as shared reference
- stale or weakly grounded claims
- invented certainty where the right answer is unknown
- unjustified schema invention that conflicts with local subtree conventions
- missing adjacent support for a material sourced statement, or missing,
  duplicate, empty, or orphaned definitions for footnotes that are used

If material uncertainty would make the reference misleading even with explicit
qualification, stop the write. Otherwise preserve the limited support beside
the affected claim.

### 8. Write within the authorized scope

Create or update exactly the resolved reference when the current request
authorizes that write. Do not repeat an already granted approval. A new durable
rule or taxonomy still needs the owner decision required by operating rules.

Do not update synthetic timestamps automatically.

### 9. Validate and report

Review the diff, claim-level support, applicability and freshness limitations.
Run `npm test` and `npm run check`; passing mechanical checks does not establish
that claims are true or transferable to another project. Report the exact file
and remaining gaps. Commit and push only within the user's authorization.
Ask Ivan for explicit approval for each PR creation; do not post PR comments
without explicit authorization for that action.

## Guardrails

- ALWAYS validate that `knowledge-hub/` is the correct surface before drafting
- ALWAYS preserve local subtree conventions instead of forcing one global
  schema
- ALWAYS stop unsupported conclusions; preserve attributable reports and explicit
  open questions only with their limitations visible
- ALWAYS apply the shared grounding standard to material
  claims derived from inspected sources
- NEVER use `knowledge-hub/` for repo workflow docs, active project state, or
  shipped feature snapshots
- NEVER introduce a new first-level family silently
- NEVER invent reusable domain facts to make the doc feel complete

## Shared review profile

Use `governance/quality/gates/gate-profiles.md`: `standard-authoring`.
Use `governance/quality/evidence/source-lanes.md`: Knowledge Hub Authoring.
Apply these agent review procedures at this skill's existing write/finalization
transitions; preserve its local halt and waiver rules. The current structural
validator does not enforce these declarations. Report material findings in chat
and, when authorized, relevant PR evidence. A read-only helper stays read-only.
