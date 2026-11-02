# Technical RFC Documentation Standard

> Retained consumer contract. Structural document validation is installed;
> specialized authoring is not. Use the writer-independent review procedure; creating a new canonical artifact still requires its write boundary.
> Checklist items below are semantic review criteria, not a claim of automated
> enforcement. Preserve source-defined IDs; do not invent IDs to satisfy a table.

## Technical RFC

**Primary author:** Developer / TL

### Consumers and Their Needs

| Consumer | What they need from the Technical RFC |
|----------|-------------------------------------|
| Product Manager / UX | **Risks section in non-technical language** — technical risks that may affect scope or user experience. Dependencies on external teams. Unknowns and assumptions. |
| QA Engineer | **Flow descriptions with edge cases** — how the feature works step by step, what can go wrong, error states and how they're handled, integration points with other systems |
| BI Analyst | **Event integration points** — where in the technical flow BI events should fire, especially when UI actions trigger complex backend logic. Must specify the logical trigger point, not just the UI action. |
| Other Developers / On-call Owners | Architecture decisions, API contracts, data model changes, runtime monitoring posture, and ownership boundaries for operational signals |

Resolve product and UX sources through
[Upstream Context Without A Handoff](../documentation-standards.md#upstream-context-without-a-handoff).
The RFC's implementation claims still require implementation source grounding.

### Document Metadata

Record the document title, project, author when known, and source verification
posture. The original RFC metadata validator is not installed; do not claim a
schema pass. Record implementation branches/revisions actually inspected and
material stale or unverified scope in **Assumptions And Unknowns**. Apply the
[grounding standard](../../quality/evidence/grounding.md) to sourced statements.

### RFC Scope And Naming

A project may have any number of independently reviewable RFCs at
`projects-in-progress/{project}/engineering/rfc-{rfc-slug}.md`. The stable,
lower-kebab-case slug identifies the proposal and does not have to track every
later title change.

Use one RFC per coherent proposal or review boundary. Related RFCs link to each
other and state what each one owns; they do not require a root RFC or an
umbrella-project declaration. RFCs are written directly at their canonical
path. There is no `.working.md` RFC form: unfinished thinking, open questions,
and evidence gaps stay visible in the RFC while the branch and pull request
carry the work-in-progress state.

### Document Shape And Voice

The default Technical RFC shape is reader-first; a first-time reader (PM,
reviewer from another team, new engineer) must be able to extract the
proposal without prior context. This shape is the default, not a
straitjacket — deviate when the feature genuinely fits it badly, and say so.

Order the document as:

1. **What You Get** — the user-visible outcome first, as a before/after
   example where behavior changes, plus the whole proposal in one paragraph
   and the core idea as a highlighted callout.
2. **Glossary** — one line per term; no acronym or internal name may appear
   in the narrative before the glossary defines it.
3. **How To Read This Document** — reading paths per audience.
4. **Architecture Overview** and **Implementation Approach** — the
   implementation approach is written as per-system vertical slices
   ("Changes in {system}..."), including explicit "no changes" slices for
   systems the reader would expect to change, with code examples for any new
   or changed types (marked illustrative while contracts are open).
5. Exactly **one** runtime-flow diagram, with plain-language participant
   labels a first-time reader can decode.
6. **Open Decisions** — a table of decision / options / current leaning /
   owner. Choices owned by someone outside the authoring session (an
   external team, an unconfirmed owner) are always written here as open with
   a leaning, never as settled facts.
7. The remaining required sections as contract detail, closing with a
   **Where This Lands In Code** appendix that owns all low-level identifiers
   (package names, entry points, API/method names, file paths). The
   narrative above the appendix must read without them.

Default section skeleton (from the first validated reader-first design;
adapt names where the feature needs it, keep the reading order):

```md
---
{Document Metadata frontmatter}
---

# Technical RFC: {Feature Name}

## What You Get
## Glossary
## How To Read This Document
## Architecture Overview
## Implementation Approach
### 1. {System}: {what changes, or "no changes"}
### 2. {System}: ...
## Runtime Flow
## Scope
## Open Decisions

{one-line note: the sections below are standard contract detail}

## API Interactions
## Reuse Of Existing Product Parts
## Integrations
## Technical Dependencies
## External Ownership
## Error Handling
## Edge Conditions
## Backward Compatibility
## Risks And Unknowns
## Assumptions And Unknowns
## BI Event Integration
## Monitoring
## Testing Considerations
## Performance Impact
## AI Usage
## Appendix: Where This Lands In Code
```

Voice rules:

- Present-tense design reasoning: state choices with their motivation and
  tradeoff. Never narrate decision history ("X was rejected on {date}") —
  alternative litigation lives in the working artifact or decision record,
  with at most a one-line pointer from the document.
- No session codenames or working-artifact labels (option tags like "A1",
  shorthand like "V-B") in the final document; every concept gets an
  audience-facing plain name.

### Excluded Planning Content

Do not include delivery task inventories (including Jira ticket lists), task
counts, effort estimates, task assignments, schedules, delivery milestone or
target dates, or delivery status anywhere in an RFC. This includes scope,
risks, assumptions, source-conflict explanations, tables, footnotes, and
appendices. Evidence and provenance requirements do not exempt planning facts
from this exclusion.

Jira discussion and planning records are discovery inputs, not technical
design evidence. Ground intended behavior in accepted product requirements or
Decisions, and existing implementation claims in code, tests, or package
documentation, following the [R&D source lanes](../../quality/evidence/source-lanes.md#rd--technical-rfc).
If that grounding is missing, record the technical gap rather than treating a
ticket or comment as an agreed design contract.

Technical ownership, runtime limits, rollout conditions, and code-verification
dates remain valid design content when grounded in those sources.

### Required Sections

- **Architecture overview** — how the feature fits into the existing system
- **Implementation approach** — key technical decisions and why
- **Scope** — the feature behaviors and technical capabilities included in
  this proposal, and those explicitly excluded. Describe the boundary in terms
  of what the feature does, including when reconciling conflicting project
  sources. For example: automatic retries are included; bulk recovery is
  excluded. Cite the source that establishes the boundary.
- **Reuse of existing product parts** — describe any reuse of existing product parts (for example shared components, dialogs, upload components or design system elements). For each reused part, clarify what is reused as-is vs. what is customized or extended. This is critical for BI (to understand which parts already have BI coverage) and QA (to understand existing test coverage)
- **Integrations** — list all internal and external integrations required for this feature (for example content, accessibility, platform, infrastructure or third-party APIs)
- **External ownership** — list all product areas, services, or components involved that are owned outside this project (for example platform, billing, permissions or infrastructure). If none: "All parts are under this project’s ownership"
- **Error handling** — for each error state:
  - How it surfaces in the UI (toast, modal, silent fail, background-only)
  - Whether we differentiate between error types from a user perspective (e.g., "try again later", "permission issue", "invalid input", "technical error")
  - Which errors are critical to track analytically (must-have vs. nice-to-have for BI)
- **Edge conditions** — list all relevant edge conditions (very large sites, high-traffic sites, specific verticals, mobile only, multi-language sites, contributors). For each: describe expected behavior, and call out any conditions where behavior is degraded, limited, or explicitly unsupported
- **Backward compatibility** — is this feature backward compatible? Can it be disabled without breaking existing flows or requiring migration/fixes? If not: describe what breaks and what migration is needed
- **Risks and unknowns** — in language a PM can understand. Explain what could go wrong, what depends on other teams, what is uncertain, and the consequences for the proposed behavior or technical scope.
- **Assumptions and unknowns** — technical assumptions and verification gaps
  that affect the proposed behavior, architecture, interfaces, state, or runtime
  ownership. For each, state the unresolved technical claim and its design
  consequence. Express source conflicts through that technical consequence.
  Always record the implementation branch, HEAD and verification date, and what
  was checked. If no material technical gaps remain, state that explicitly.
- **BI event integration** — where BI events are triggered in the code flow. For complex logic: the specific point in the execution path where each event fires, co-determined with BI. Format: event name, trigger point (code location or logical step), and required fields. When no BA-provided BI requirements exist yet, developers do not enumerate or guess event IDs: the section records the logical trigger points plus an explicit `_Gap:` stating the event list is BI/BA-owned and pending
- **Monitoring** — operational monitoring / runtime observability, not BI analytics, QA test coverage, manual follow-up, or product notifications. Use the implementation repository's observability guide and vocabulary. Describe the feature's monitoring posture when it adds or changes user-visible, integration-heavy, or measurable runtime behavior. Include: key user actions, system actions, or handoffs that should create transactions or equivalent operational signals; feature-owned errors or failure paths that should be reported explicitly; expected UX states that should not be treated as monitoring errors; downstream systems, reused components, or platform flows that already own monitoring and should not be double-reported locally; component or entry-point attribution requirements; alerting, dashboard, or ownership expectations when relevant; and verification targets. If no monitoring changes are needed: "No additional monitoring is required"
- **Testing considerations** — testing-relevant implementation considerations:
  risky areas, edge conditions, failure modes, integration points, and
  constraints that QA and developers should be aware of when planning coverage.
  This section may highlight what deserves attention, but it must not ask QA to
  prescribe a specific testing layer (for example `unit`, `integration`, or
  `E2E`)
- **Performance impact** — identify specific steps in the flow that might be slow or prone to load/execute failures. Does this feature change the application's initial load time? Does it add a new phase during application load? If no performance concerns: "No expected performance impact"
- **AI usage** (if applicable) — if the feature uses AI: describe where and how (which steps in the flow, foreground vs. background usage), specify relevant AI identifiers (application or assistant identifiers), and list the AI tools/skills used. If no AI: "This feature does not use AI"

### Recommended Sections

- Data model changes
- API contracts (new or modified)
- Migration or rollback plan
- Spec Kit / OpenSpec reference link (if implementation spec exists)

### Validation Rules

- [ ] Architecture overview is present
- [ ] Reuse of existing product parts section is present (or "no reuse")
- [ ] Integrations section lists at least one integration (or "no integrations required")
- [ ] External ownership section is present (or "all parts under this project’s ownership")
- [ ] Error handling section describes at least one error scenario with UI surfacing method
- [ ] Edge conditions section is present (or "no relevant edge conditions")
- [ ] Backward compatibility section is present
- [ ] Risks section is present and contains at least one item (or explicit "no known risks")
- [ ] Assumptions and unknowns section is present, stating either "verified, no significant assumptions" with the resolved implementation branch reference, or enumerating partial-grounding assumptions and unknowns
- [ ] BI event integration section is present (or explicit "no BI events in this feature")
- [ ] Monitoring section is present and describes operational monitoring / runtime observability posture, or explicitly states "No additional monitoring is required"
- [ ] Testing considerations section is present
- [ ] Performance impact section is present (or "no expected performance impact")
- [ ] AI usage section is present (or "this feature does not use AI")
- [ ] No placeholder text (`{placeholder}`, `TBD`, `TODO`, `...`)
- [ ] No draft/open-state markers or standalone confirmation placeholders outside a local waiver table
- [ ] No session codenames or working-artifact option labels in the document body; every concept has an audience-facing plain name
- [ ] The entire RFC satisfies [Excluded Planning Content](#excluded-planning-content), including citations and appendices (semantic consumer-contract review)
- [ ] No acronym or internal name is used in the narrative before the glossary defines it
- [ ] Externally-owned choices are recorded as open decision + leaning + owner, not as settled facts
- [ ] BI event integration is either grounded in BA-provided requirements or records trigger points plus an explicit `_Gap:` (no developer-guessed event IDs)
- [ ] Every material sourced statement has adjacent support under the shared grounding rule; useful verification context stays in concise end-of-file footnotes (semantic `claim-grounding` review)
- [ ] Every footnote reference resolves to exactly one non-empty definition, with no duplicate or unreferenced definitions (deterministic integrity validation)

### Cross-Discipline Collaboration Note

The **BI event integration** section requires collaboration between R&D and BI. The typical workflow:

1. BI analyst defines which user actions need tracking (from their BI requirements doc)
2. Developer identifies where in the code flow each event should fire
3. Together they determine the exact trigger point — especially important when a UI action (e.g., button click) triggers complex logic and the event must fire at a specific step
4. Developer documents the agreed trigger points in the technical RFC
5. BI analyst validates that the technical RFC's event section matches their requirements

---
