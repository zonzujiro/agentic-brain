# Cross-Document Documentation Standards

> Retained consumer contract. Structural document validation is installed;
> specialized authoring is not. Use the writer-independent review procedure; creating a new canonical artifact still requires its write boundary.
> Checklist items below are semantic review criteria, not a claim of automated
> enforcement. Preserve source-defined IDs; do not invent IDs to satisfy a table.

## Cross-Document Dependency Map

This shows consistency relationships, not a mandatory creation order. When an
upstream document changes, review the affected downstream documents. Resolve
available inputs through [Upstream Context Without A Handoff](../documentation-standards.md#upstream-context-without-a-handoff).

```
Current Product + UX Sources
 └── Source context (direct reads; handoff index when present)
      ├── Technical RFC (must implement the handed-off requirements and flows)
      │    ├── Test Plan (must cover technical RFC flows and error states)
      │    ├── BI Requirements → Technical RFC (BI event trigger points must be in technical RFC)
      │    └── Technical RFC → BI Requirements (trigger points co-determined)
      └── BI Requirements (must map events to handed-off scope and success intent)

Upstream design sources referenced directly or through an available handoff
 └── BI Requirements (must reference design entry points and `UF-*` links)
```

### Bidirectional Dependency: BI Requirements ↔ Technical RFC

Unlike other document pairs, BI Requirements and Technical RFC have a **bidirectional dependency**:
- BI defines *what* to track (from their analysis of current product and design sources)
- R&D determines *where* to track it (from their understanding of the code)
- The agreed result must appear in both documents

This is the one case where two disciplines must actively collaborate to produce their documents, rather than one producing and the other consuming.

---

## Evolution Process

These standards are not fixed. To propose a change:

1. The discipline that discovered a gap describes what was missing and why it caused a problem
2. The producing discipline assesses the impact of adding the requirement
3. Both disciplines agree on the new standard
4. The standard is updated in this document (version-controlled in Agentic Brain)
5. Existing features are not retroactively required to comply, but new features must

Changes to standards should be lightweight. The goal is practical usefulness, not bureaucratic completeness.
