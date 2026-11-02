# Handoff Documentation Standard

> Retained consumer contract. Structural document validation is installed;
> specialized authoring is not. Use the writer-independent review procedure; creating a new canonical artifact still requires its write boundary.
> Checklist items below are semantic review criteria, not a claim of automated
> enforcement. Preserve source-defined IDs; do not invent IDs to satisfy a table.

## Handoff Contract

**Primary author:** The owner coordinating product and design inputs

### Consumers and Their Needs

| Consumer | What they need from the Handoff |
|----------|---------------------------------|
| Developer / TL | A single packaged PM/UX bridge with concise problem framing, stable requirements, flow references, source links, scope boundaries, and implementation context |
| QA Engineer | Problem framing, flow and state context, edge cases, and enough packaged scope to plan coverage without reopening product/design discovery |
| BI Analyst | User-flow context, measurable actions, and canonical design/source references for event mapping |

### Required Sections

- **Downstream Contract** — a source-grounded bridge containing:
  - **Problem Framing** - concise downstream-ready statement of the user / business problem and why this work matters now
  - **Downstream Scope** - in scope, out of scope, assumptions, open questions
  - **Functional Requirements** - stable `FR-*` identifiers with concise requirement text
  - **User Flows** - stable `UF-*` identifiers with flow summaries and canonical design or prototype references
  - **States and Edge Cases** - key states, error states, and important edge conditions
  - **BI-Relevant Actions** - candidate measurable actions and plain-language trigger descriptions
  - **Implementation Context** - related repos/packages, reused parts, and relevant current implementation context
  - **Cross-Project Handoffs** - each accepted cross-project flow and its resolved product boundary, or an explicit statement that none exist
  - **Source References** - canonical product / design artifacts or an explicit note that the handoff was built from a fixture or other condensed local source
  - **Downstream Expectations** - what Engineering, QA, and BI should produce next

### Recommended Sections

- Shared or ambiguous BI actions called out explicitly
- Explicit notes when a requirement or flow still needs stakeholder confirmation

### Validation Rules

- [ ] `## Downstream Contract` is present
- [ ] `Problem Framing` is present and explains the downstream-relevant problem in concise product language
- [ ] `FR-*` identifiers are present when the upstream product spec defines them
- [ ] `UF-*` identifiers and canonical design references are present when upstream design artifacts define them
- [ ] Downstream Scope includes both in-scope and out-of-scope framing (or an explicit statement that all known scope is in scope)
- [ ] States and Edge Cases section is present
- [ ] BI-Relevant Actions section is present, even if it says no additional measurable actions were identified beyond existing implementation
- [ ] Implementation Context section is present
- [ ] Every implementation-relevant cross-project flow has a resolved product boundary; unresolved boundaries mark the affected downstream consumer Blocked
- [ ] A no-implementation or abandoned flow is not packaged as build input
- [ ] Source References section is present and either points to the canonical product / design artifacts used for the handoff or explicitly states that a fixture / condensed local source was used instead
- [ ] No placeholder text (`{placeholder}`, `TBD`, `TODO`, `...`)
- [ ] No draft/open-state markers or standalone confirmation placeholders outside a local waiver table

---
