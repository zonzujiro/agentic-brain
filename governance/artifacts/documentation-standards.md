# Documentation Standards

Apply [communication guidance](../operations/communication.md) to explanatory
prose without removing an artifact's required structure, evidence or technical
coverage. Each document has consumers beyond its author. Useful content, explicit
gaps and source support matter more than the presence of headings.

These standards are a reusable authoring baseline. They preserve consumer needs,
section prompts, evidence requirements and review checklists from the source
repository, with company-specific integrations removed. People can use and extend
them directly; a dedicated authoring skill is not required to make them useful.

Document-specific contracts below and installed writer templates own their
respective shapes. The original technical RFC, test-plan and BI writer packages
are not installed. Structural validation is installed independently through
`validate_root_docs.mjs`; semantic checklists still require review. do not confuse that limitation with an absence of documentation rules.

## Consumer readiness and local waivers

Identify the primary author, downstream consumers, required information,
recommended depth and actual validation. A missing source, mapping, constraint
or decision must remain visible. A waiver grants permission for a specified
transition; it does not make a missing claim true.

| Waived requirement | Gap | Reason | Follow-up |
|---|---|---|---|
| Exact requirement | What is missing | Why the owner accepts partial progress | Owner or condition, if known |

Use a genuine not-applicable explanation when no information is required. Do not
use a waiver table to invent approval or silently remove a consumer's need.

## Visible Gap Grammar

`_Gap: <what is missing and why>_` is the sanctioned marker for explicit,
visible gaps in working and provisional documents.

- A `_Gap:_` marker means "this is not data": authors use it instead of
  silent TODOs or placeholder prose, so incompleteness is visible to both
  humans and hooks.
- Consumers - human or agent - must quote gap-marked content as a gap, never
  treat it as fact, and never fill it from thin air because the file exists.
  The write-time advisor flags downstream documents that cite into
  gap-marked sections.
- The current advisor recognizes explicit gaps. Writer-specific readiness rules
  still decide whether a gap is acceptable for the requested transition; do not
  claim that absent document-type validators have passed.

---

## Upstream Context Without A Handoff

This section owns the handoff prerequisite rule for every Brain authoring,
update, review, and planning workflow. A handoff is a preferred readiness index
when present, not a required file or the only source of product and UX truth.
Projects with direct or partial source packages can use their current sources without
creating or restoring a handoff first.

Resolve the sources against the requested work: project README, accepted local
Decisions, product spec and design evidence, existing engineering, quality and
analytics docs, and relevant inspected external sources. Read a current handoff
when it exists and follow its source links as needed. Do not revive superseded
artifacts or ignore a substantive conflict or blocked consumer merely because
another source is available.

Record the actual sources in `upstream_contract` where that metadata applies
and retain claim-level grounding. Mention an absent handoff once in the source
inventory; its absence alone is not a material evidence gap, a waiver, or a
reason to ask permission again for already-authorized work. Do not manufacture
a placeholder handoff or require an upstream packaging step to proceed.

Required source lanes mean required evidence for the claims being made, not a
requirement that every customary filename exist. Inspect applicable Technical
RFCs when available; their absence does not establish runtime facts. Product,
flow, design, ownership, event/schema and implementation claims must still have
the evidence their profiles require. If the available sources are insufficient
or contradictory, name the missing fact and affected output, and apply the
existing grounding, gap, waiver and finalization rules. File absence never
waives those rules or makes incomplete coverage complete.

Preserve source-defined requirement and flow identifiers wherever they live.
Do not fabricate upstream IDs to satisfy a mapping: identify any missing mapping
as a substantive gap under the document's existing contract.

## Cross-Project Handoff Lifecycle

A cross-project relationship is recorded only inside the artifact that owns
the relevant fact. Brain does not require a separate relationship file or
registry.

During product shaping, when a user flow leaves one project and continues in
another, the Product Spec must state:

- the user action or product event that starts the handoff;
- which project owns the experience before and after that event;
- the product information that must cross the boundary;
- which user-visible loading, cancellation, error, and return outcomes each
  project owns.

These are product responsibilities, not API details. If the flow is still
being considered, keep the uncertainty in `Open decisions`. If the flow is
abandoned or the accepted solution needs no implementation, mark it out of
scope and retire active build contracts rather than manufacturing a handoff.

Before product-to-engineering handoff, every implementation-relevant product
boundary must be resolved or explicitly waived with an owner and blocking
consequence. The handoff artifact reports this truth; it does not infer or copy
it. An unresolved boundary makes the affected consumer `Blocked`, not the
whole project automatically blocked when independent scope remains ready.

During Technical RFC work, Engineering defines the concrete API or event,
payload, timing, retries, cancellation, errors, and return behavior for each
accepted product handoff. The RFC does not reopen product ownership and must
not invent a technical contract for an abandoned or no-implementation flow.

At PR or push readiness, semantic audit checks current sources for conflicts,
missing accepted-boundary details, and stale build contracts. It is a verifier,
not the lifecycle stage where product or technical ownership is first decided.

## Installed document contracts

Use the [writer map](artifact-writer-map.md) and the actual writer's template for
project briefs, Decisions, shared/product knowledge and shipped-feature docs.
Do not impose the original repository's uninstalled frontmatter or document
validators on these outputs. Preserve source-defined identifiers and meaning
when adapting a source document; missing evidence remains a gap.

## Retained specialized reference contracts

These preserve useful downstream expectations with structural validation mounted independently of specialized writers. Follow
[document review](../quality/document-review.md) for the required semantic pass. A named role can be performed by one person;
the distinctions describe responsibilities, not a required organization chart.

- [Handoff](documentation-standards/handoff.md)
- [Technical RFC](documentation-standards/technical-rfc.md)
- [Test plan](documentation-standards/test-plan.md)
- [Measurement requirements](documentation-standards/bi-requirements.md)
- [Cross-document dependencies](documentation-standards/dependencies.md)

## Extending these standards

Start with the closest existing document-type standard. Preserve its useful
consumer needs, required information, evidence rules and review checklist. Add
project-specific sections or examples where they solve a concrete need; explain
why a section does not apply instead of dropping it silently or inventing content.
One person may perform several author and consumer roles.

When a reusable requirement changes, describe what the consumer was missing,
review the impact with the producing owner, and update the owning standard.
Update affected writer templates, guidance and checks together. Keep automation
claims tied to the checks actually implemented. Existing documents need a
migration disposition when the change affects their meaning or consumer readiness;
format-only differences do not justify rewriting historical evidence.

For a new document type, establish its purpose, author, consumers, required and
recommended sections, evidence, gap handling and review criteria. Resolve its
canonical path and writer through the write-boundary contract, then link the new
standard here. Use [cross-document dependencies](documentation-standards/dependencies.md)
and [change impact](../../skills-hub/hb-skills/hb-change-impact/SKILL.md) when the
change affects other contracts. Extend the maintained owner instead of creating
a competing copy of these rules.
