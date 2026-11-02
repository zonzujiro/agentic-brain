# BI Requirements Documentation Standard

> Retained consumer contract. Structural document validation is installed;
> specialized authoring is not. Use the writer-independent review procedure; creating a new canonical artifact still requires its write boundary.
> Checklist items below are semantic review criteria, not a claim of automated
> enforcement. Preserve source-defined IDs; do not invent IDs to satisfy a table.

## BI Requirements

**Primary author:** BI Analyst

### Consumers and Their Needs

| Consumer | What they need from BI Requirements |
|----------|-------------------------------------|
| Developer / TL | **Precise event specifications** — event name, which UI action triggers it, a short plain-language explanation of the exact user action and UI context being measured, what fields to send, and critically: the logical trigger point in the code when the action involves complex backend logic |
| QA Engineer | Event names and expected payloads to validate in tests |
| Product Manager | Understanding of what is measured and how it connects to success criteria |

Resolve product and UX sources through
[Upstream Context Without A Handoff](../documentation-standards.md#upstream-context-without-a-handoff).
Read applicable `engineering/rfc-*.md` documents when available and preserve
any material technical grounding gaps.

### Required Sections

- **Event map** — table or list of all events for the feature, each with:
  - Event name / stable identifier (for example `EV-*`, a canonical spec name, or another stable event ID)
  - Trigger action (which UI element / user action)
  - Exact user-action explanation (short plain-language description of what the user actually did and in which UI context/state)
  - Trigger point (where in the flow the event fires — especially important for actions with complex backend logic; to be co-determined with R&D)
  - Required fields and their data sources
  - Related `UF-*` user-flow IDs
  - Purpose (what business question this event answers)
- **Design references** — which parts of the design each event maps to (Figma frame/component references), including the referenced `UF-*` IDs
- **Reuse assessment** — which events or fields reuse existing BI infrastructure. For each reused part, provide: `source system, stable event identifier, and feature name. This data is needed to understand which parts of the functionality are already covered with BI

### Recommended Sections

- Event validation criteria (how to verify events fire correctly)
- Funnel or flow analysis plan (how events combine to measure user journeys)
- Dashboard or reporting requirements

### Validation Rules

- [ ] Event map is present with at least one event
- [ ] Each event has: stable identifier, trigger action, exact user-action explanation, required fields, and at least one related `UF-*` ID
- [ ] Design references section is present
- [ ] Design references use `UF-*` IDs
- [ ] Reuse assessment section is present (or "no reuse" if all new)
- [ ] No placeholder text (`{placeholder}`, `TBD`, `TODO`, `...`)
- [ ] Every material sourced statement has adjacent support under the shared grounding rule; useful verification context stays in concise end-of-file footnotes (semantic `claim-grounding` review)

---
