# Product Overview
## Shared Template For `knowledge-hub/*-overview.md`

*Use this template for durable product overviews in
`knowledge-hub/`.*

*The authoring flow should extract from sources first. Put a direct source link
beside each material sourced statement when it gives enough context; use a
concise end-of-file footnote when verification context matters. The optional
Grounding note does not replace statement-level support. Any unresolved
section should stay explicitly incomplete rather than invented.*

*If no usable sources are available, use this as an interview guide. Mark
unknown answers as gaps instead of filling them with plausible-sounding product
knowledge.*

| Template fields | |
|---|---|
| **Purpose** | [What repeated product-grounding need this overview serves] |
| **Owner** | [product owner] |
| **Last updated** | [DD.MM.YYYY] |
| **Status** | [Living / Stable / Archived] |

Optional grounding note:

| Grounding | |
|---|---|
| **Primary sources** | [Docs, slides, Jira, existing hub docs, owner interview] |
| **Known gaps** | [Sections or claims still missing source support] |

---

## 1. What [Product] Is

What is this product or sub-product, in one short grounding explanation?

- What does it do?
- Who is it for?
- Where does it sit in the broader product context?
- Is it live, growing, deprecated, or pre-launch?

---

## 2. Target Users

Who is this product primarily for, and who is it not for?

- What internal or external name is used for the primary segment?
- What jobs do those users hire the product for?
- Which adjacent audiences are out of scope or secondary?

---

## 3. Value Proposition

What is the core value proposition, and what supporting pillars make it true in
practice?

- What is the headline promise?
- What 3-5 pillars make the product valuable or differentiated?
- Which user frustrations or needs does it directly answer?

---

## 4. Primary Funnel Or Core Flow

What are the main user paths that lead to the product's core outcome?

- How do users enter this product area?
- What are the primary creation, editing, or activation loops?
- What are the key success states?

If the scope does not have one canonical funnel, say so explicitly.

---

## 5. Core Product Areas

What are the major capability areas inside this product scope?

- Which major areas repeatedly matter to downstream work?
- What falls under each area?
- Which areas are adjacent but not part of this scope?

---

## 6. Roadmap And Scope

What medium-term roadmap context or scope boundaries matter repeatedly?

- What is currently in scope?
- What is explicitly out of scope?
- Which roadmap themes or expected expansions are worth naming?

If roadmap evidence is weak, keep the gap explicit.

---

## 7. Product Guidelines

What reusable product principles or decision rules should downstream work know?

- Are there repeated product heuristics for building in this area?
- Are there default constraints or non-negotiables?
- Which product-level tradeoffs come up often enough to document once?

---

## 8. Design Checklist

What cross-cutting considerations should product or design work check every
time?

- mobile
- AI assistance, when present
- templates
- brand
- responsiveness
- migration or backward compatibility

Keep only the checks that truly repeat for this scope.

---

## 9. Key Metrics And North Star

Which success metrics or health indicators matter for this product scope?

- What is the North Star, if one exists?
- Which funnel, adoption, satisfaction, or quality metrics matter repeatedly?
- What metric caveats or confounders should readers know?

If metrics are not grounded, keep the gap explicit.

---

## 10. Glossary

Which product-specific terms should be defined once for shared reuse?

- internal terms
- user-facing concepts
- abbreviations
- repeated names for flows, systems, or roles

---

## Validation Checklist

Before treating the overview as ready to save:

- [ ] The doc belongs under `knowledge-hub/`, not
      `production-features/`, `projects-in-progress/`, `governance/`, or unrelated shared references.
- [ ] Every section is grounded, explicitly partial, or explicitly missing.
- [ ] No placeholder text remains unless it is intentionally part of a marked
      gap.
- [ ] Product-specific glossary terms cover important terminology used
      elsewhere in the doc.
- [ ] Owner, last-updated, status, and purpose fields are filled or explicitly
      marked as missing.
- [ ] Metrics, roadmap, persona, and scope claims are sourced or marked as
      gaps.
