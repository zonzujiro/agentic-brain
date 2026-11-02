# Test Plan Documentation Standard

> Retained consumer contract. Structural document validation is installed;
> specialized authoring is not. Use the writer-independent review procedure; creating a new canonical artifact still requires its write boundary.
> Checklist items below are semantic review criteria, not a claim of automated
> enforcement. Preserve source-defined IDs; do not invent IDs to satisfy a table.

## Test Plan

**Primary author:** QA Engineer

Test plans are assumed to cover all documented user flows for the feature by
default. Explicit in-scope / out-of-scope framing or known-gap sections are only
needed when the author wants to call out a real intentional exception.

### Consumers and Their Needs

| Consumer | What they need from the Test Plan |
|----------|----------------------------------|
| Developer / TL | **Coverage intent structured for implementation** — clear scenarios, conditions, edge/failure cases, and exclusions that developers can implement with the appropriate testing layers |
| Product Manager | Confidence that requirements are covered, understanding of test coverage gaps |

Resolve product and UX sources through
[Upstream Context Without A Handoff](../documentation-standards.md#upstream-context-without-a-handoff).
Read applicable `engineering/rfc-*.md` documents when available and preserve
any material technical grounding gaps.

### Required Sections

- **Existing feature coverage** — list of existing features or reused parts that
  already have coverage. This is needed to calculate incremental coverage:
  what's already covered vs. what's new. Format: feature or reused part, what is
  already covered, and current coverage status
- **Core test scenarios** — primary user-visible flows and expected outcomes.
  Each scenario should include: a stable `TC-*` ID, preconditions, steps, and
  expected results
- **Flow coverage mapping** — explicit mapping from `UF-*` user-flow IDs to the
  relevant `TC-*` scenario IDs that cover them
- **Edge and failure scenarios** — important validation cases, permission cases,
  unusual inputs, resilience concerns, and failure modes that must be covered
- **Special conditions / environments** — conditions that materially affect
  coverage, such as breakpoints, browsers, user roles, data states, site types,
  performance-sensitive contexts, accessibility-sensitive contexts, or other
  meaningful environments

### Recommended Sections

- User story coverage mapping
- Regression considerations
- Accessibility considerations
- Performance-sensitive scenarios

### Validation Rules

- [ ] Existing feature coverage section is present (or "no reused features" if all new)
- [ ] At least one core scenario with a stable `TC-*` ID exists with preconditions, steps, and expected results
- [ ] Flow coverage mapping section is present
- [ ] Flow coverage mapping uses `UF-*` IDs and references one or more `TC-*` IDs per mapped flow
- [ ] Edge and failure scenarios section is present (or "no additional edge/failure scenarios")
- [ ] Special conditions / environments section is present (or "no special conditions")
- [ ] No placeholder text (`{placeholder}`, `TBD`, `TODO`, `...`)
- [ ] No draft/open-state markers or standalone confirmation placeholders outside a local waiver table
- [ ] Every material sourced statement has adjacent support under the shared grounding rule; useful verification context stays in concise end-of-file footnotes (semantic `claim-grounding` review)

---
