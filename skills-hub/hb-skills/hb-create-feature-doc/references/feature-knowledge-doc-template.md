# Feature Knowledge Doc
## Detailed reference template

For a small project, keep purpose, supported behavior, scope, evidence and
limitations prominent. Other prompts are optional depth: mark a section not
applicable with a reason rather than inventing data or forcing enterprise process.

*Use this template for shipped or live feature knowledge under `production-features/`.*

*Active work in `projects-in-progress/` stays in the WIP flow and should
not be rewritten into this artifact before release.*

*Sections should be filled from source-backed evidence first. Put a direct
source link beside each material sourced statement when it gives enough
context; use a concise end-of-file footnote for useful verification context.
The optional Grounding note and section source fields do not replace this
statement-level support. If a section
cannot be completed honestly, keep the gap explicit instead of inventing
certainty.*

*If no usable sources are available, use this as an interview guide. Mark
unknown answers as gaps instead of filling them with plausible-sounding feature
knowledge.*

| Template fields | |
|---|---|
| **Feature Name** | [Name of the feature] |
| **Feature Area** | [E.g. Editor / Checkout / Settings] |
| **Status** | [Live / Launched / Deprecated] |
| **Launch Date** | [DD.MM.YYYY, or state the known precision] |
| **Document Owner** | [Owner, when known] |
| **Last Updated** | [DD.MM.YYYY] |

Optional grounding note:

| Grounding | |
|---|---|
| **Primary sources** | [Bootstrap README, Docs, Slides, Jira, Figma, Slack, BI, owner interview. Preserve source URLs as clickable Markdown links when available.] |
| **Known gaps** | [Sections or claims still missing source support] |

---

## 1. Product Goal

What problem does this feature solve, and for whom? Write 2–4 sentences that explain the core purpose of the feature from the user's point of view. Avoid engineering or implementation language here.

*Tip: A good product goal can be read by a new team member with no context and still make sense.*

---

## 2. User Intents

List the jobs-to-be-done (JTBD) this feature covers — the real-world goals users are trying to accomplish. Describe each intent as an authored user-goal statement, not a research quote: "I want to…" or "I need to…"

### Primary Intents

The main reasons users come to this feature. These should account for the majority of usage.

*Examples: "I want to go edit my About page" / "I need a new page on my site" / "This item name is wrong"*

- [Primary user intent — write as a user-goal statement]
- [Primary user intent]
- [Primary user intent]

### Secondary Intents

Less frequent but still valid use cases this feature supports. These are often power-user needs or edge cases.

- [Secondary user intent — write as a user-goal statement]
- [Secondary user intent]
- [Secondary user intent]

### Feature Value

Break down the value this feature delivers into distinct pillars. Each pillar should have a name and a plain-English description of what it means for users in practice.

| Pillar | What it means in practice |
|---|---|
| [Pillar name, e.g. Core Action] | Describe what this pillar enables the user to do. Focus on outcome, not mechanism. |
| [Pillar name] | Add as many rows as needed. |
| [Pillar name] | |

---

## 3. Data Foundation

This section captures the quantitative research that informed product decisions. It should be completed before launch (to guide design) and updated after launch (to validate assumptions). Data here answers the question: "What do we actually know about how users behave?"

### Research Source & Population

| | |
|---|---|
| **Research source** | Link or name the data study, dashboard, or research doc |
| **Population / cohort** | Who was measured? (e.g. all Editor users in Q1 2024, paying customers only) |
| **Time period** | When was the data collected? |
| **Sample size** | How many users / sessions / events were analyzed? |

### Usage & Volume Data

Capture the baseline behavioral data that reveals how users interact with this feature area today. Populate the metrics most relevant to your feature type.

| Metric | Value / Finding |
|---|---|
| Adoption rate (% of users who use this feature) | [X%] |
| Frequency of use (sessions per user per period) | [Value] |
| Key funnel drop-off point(s) | [Describe where users abandon the flow] |
| Segment differences (e.g. free vs paid, new vs returning) | [Key differences observed] |
| [Add metric relevant to your feature] | [Value] |

### Distribution & Segmentation

If applicable, include a distribution breakdown (e.g. P10/P25/P50/P75/P90 percentiles, or breakdown by user type). This helps understand the range of behaviors, not just the average.

*Example: "90% of sites have fewer than 20 pages" — this tells you the design should optimise for small sites, even if large sites exist.*

Include a table or bullet summary of any relevant distribution data here.

### Key Behavioral Insights

Summarise the 3–5 most important findings from the data that directly influenced product decisions. Be specific — avoid vague statements like "most users prefer X."

- [Insight 1 — state what the data shows and why it matters for design decisions]
- [Insight 2 — include the stat that supports the insight]
- [Insight 3]

---

## 4. User Voice

This section captures qualitative signals from real users — what they're saying, asking for, and struggling with. It complements the quantitative data in Section 3 with the "why" behind the numbers.

*Complete this before design decisions are locked. Update after launch with post-release feedback.*

### Research Sources

| | |
|---|---|
| **Sources used** | [e.g. support tickets, user interviews, forum posts, NPS verbatims, session recordings, UserVoice] |
| **Time period** | When was the feedback collected? |
| **Volume** | Approximate number of signals reviewed |
| **Link / doc** | [Link to full research or raw data] |

### Top Pain Points & Frustrations

What are users struggling with today in this area? Capture the recurring themes — not every individual complaint.

*Frame each as a user need or frustration. Cite the source type (e.g. "support ticket", "interview") and rough frequency if known.*

| Pain Point | Source | Frequency |
|---|---|---|
| [What users struggle with — write in plain language close to how users express it] | [Source type] | [High / Medium / Low or ticket count] |
| [Pain point 2] | | |
| [Pain point 3] | | |

### Feature Requests & Unmet Needs

What are users explicitly asking for that doesn't exist yet, or exists but doesn't fully meet their need?

- [Request 1 — describe what users are asking for and why, in their words where possible]
- [Request 2]
- [Request 3]

### Positive Signals

What do users already appreciate about this area? What's working well that we should preserve or build on?

- [Positive signal 1]
- [Positive signal 2]

### Key Qualitative Insights

Summarise the 3–5 most important themes from user voice that should influence product decisions. Connect each to a design implication.

- [Insight 1 — what users feel/say, and what it means for the feature]
- [Insight 2]
- [Insight 3]

---

## 5. Scope & Out of Scope

Clearly define what this feature does and does not include. This is critical for alignment with design, engineering, and stakeholders. Out of scope items should include a rationale — not just a list.

### In Scope

| Area / Capability | What's included |
|---|---|
| [Capability 1] | Describe what exactly is included. Be precise. |
| [Capability 2] | Avoid vague terms like 'basic support' — say what works and what doesn't. |
| [Capability 3] | |

### Out of Scope

| Area / Capability | Rationale for exclusion |
|---|---|
| [Excluded capability 1] | Why was this excluded? (e.g. separate feature scope, data shows low demand, technical constraint, future roadmap item) |
| [Excluded capability 2] | |

---

## 6. User Flows

Document the key end-to-end user flows for this feature. Each flow should start with a user intent and walk through the steps to completion. Focus on the user's actions, not implementation details.

*Include a flow for each primary user intent from Section 2. Add secondary flows as needed.*

### Flow 1: [Name the primary task — e.g. 'Completing an action']

State the user's goal at the start of this flow.

1. [Step 1 — describe what the user does and what the system shows]
2. [Step 2]
3. [Step 3 — end with the outcome / success state]

### Flow 2: [Name a secondary task]

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## 7. Business Goals & Success Metrics

### Business Goals

What business outcome does this feature contribute to? Frame each goal in terms of impact on the business or user experience — not just "ship the feature."

- [Business goal 1 — e.g. Increase feature adoption by reducing friction in X flow]
- [Business goal 2 — e.g. Reduce support tickets related to X]
- [Business goal 3]

### Success Metrics (KPIs)

Define the specific, measurable signals that indicate success. For each metric, note the desired direction and any caveats.

| Metric | Direction | Notes / Caveats |
|---|---|---|
| [Metric name] | ↑ or ↓ | Any known confounders or reasons this metric might move in unexpected ways |
| [Metric name] | ↑ or ↓ | |

---

## 8. Risks, Dilemmas & Open Issues

### Risks

Document the known risks of this feature — both to users and to the business. For each risk, explain why it exists and (if known) how it's being mitigated.

*Think about: UX confusion risks, conflicting user expectations, technical constraints, downstream side-effects on related features, migration risks.*

**Risk 1.**
[Describe the risk clearly. What could go wrong? Who is affected? What is the likelihood / severity? Is there a mitigation plan?]

**Risk 2.**
[Describe the risk]

### Dilemmas

Capture unresolved product tensions — places where two valid approaches conflict, or where the right answer depends on assumptions that haven't been validated.

*Example format: 'Option A does X which benefits Y users, but Option B does Z which benefits W users. We chose A because… but the risk is...'*

- [Dilemma 1 — name the tension, explain both sides, and note what was decided or what's still open]
- [Dilemma 2]

### Open Issues

List unresolved questions that need answers before or after launch. Assign an owner and target date where possible.

| Open Question | Owner | Target Date |
|---|---|---|
| [What needs to be decided or validated?] | [Name / role] | [DD.MM.YYYY] |

---

## 9. Competitor Landscape

Summarise how competitors handle this feature area. The goal is to understand the market baseline, identify best practices, and spot differentiation opportunities — not to copy.

*Source your competitor research: link the study or note the date/analyst.*

### Research Source

| | |
|---|---|
| **Source / study** | [Link or title of competitor research] |
| **Competitors analyzed** | [List the products compared] |
| **Date conducted** | [DD.MM.YYYY, or state the known precision] |

### Comparison Table

Compare how each competitor handles the key areas of this feature. Choose 4-6
areas that are most relevant to product decisions.

| Area | Our product | Competitor A | Competitor B | Competitor C |
|---|---|---|---|---|
| [Area 1, e.g. Discoverability] | [How we handle it] | [Their approach] | [Their approach] | [Their approach] |
| [Area 2] | | | | |

### Key Takeaways

Summarise the 3-5 most actionable insights from competitor research. What should
we do differently? What should we adopt? What should we avoid?

- [Takeaway 1 - be specific about what we should do as a result of this finding]
- [Takeaway 2]
- [Takeaway 3]

---

## 10. Platform Considerations

Describe relevant device, accessibility, offline, compatibility, integration and
migration constraints. Include only contexts that materially apply; distinguish
verified behavior from intended support and explicit unknowns.

| Area | Considerations and behavior |
|---|---|
| Mobile / devices | Are capabilities adapted, limited or unavailable in particular views or input modes? |
| AI assistance | Can an assistant explain, trigger or automate the feature? What still requires a person? |
| Generated / new content | Does the feature participate in generation or initialization? Which default state is supported? |
| Templates and content | Are presets, catalog entries, templates or content changes needed? |
| Brand / themes | Which colors, fonts, themes or tokens apply, and what happens when they change? |
| Existing users / backward compatibility | Is migration required? What remains compatible and what does not? |
| Other relevant context | Add accessibility, offline, integration or other contexts only when materially relevant. |


---

## 11. Experiments and Changes

A running log of A/B tests and experiments run *on top of the live production
feature* — both currently running and historical. This is the feature's
experiment history; it answers "what have we tried, what's in flight, and what
won?"

*Use the actual experiment specification and results report. No particular
service is required. Never invent result numbers.*

*When a test wins and is rolled out to 100%, fold the resulting behavior into the
relevant product sections above (Scope, User Flows, Platform
Considerations) and keep the row here as the historical record with its result
set to "Implemented / rolled out".*

| Test | Description | Spec / Jira / Figma | Status | Report | Results |
|---|---|---|---|---|---|
| [1–2 sentence summary of what was tested] | [Optional: more detail, variants, scope, or the hypothesis — leave blank if the title is enough] | [Clickable link to the experiment spec, Jira, Figma, or doc] | [Planned / Opened to employees / Running / Paused / Closed] | [Clickable link to the results report, or "—"] | [Outcome: e.g. Back to A / Open B to 100% / Exploratory — back to A / POC completed. Note "Implemented / rolled out" when shipped, or "Pending" while running.] |
| [Test 2] | | | | | |

*Statuses follow the inspected experiment source. Results should name the decision
outcome from a grounded report; if the test is still running, mark it "Pending"
rather than guessing a result.*

---

## Validation Checklist

Before treating this doc as ready to save:

- [ ] The doc belongs under `production-features/{feature}/feature-knowledge.md`.
- [ ] The feature is shipped or live; active work remains in
      `projects-in-progress/`.
- [ ] Every section is grounded, explicitly partial, or explicitly missing.
- [ ] Every material sourced statement has adjacent support; contextual
      footnotes are concise, at the file end, and have valid references.
- [ ] Product Goal reads cleanly to someone with no context.
- [ ] User Intents are framed as user-goal statements or explicitly marked as
      unavailable.
- [ ] Data Foundation names real sources and contains no invented metrics or
      filled-in `[X%]` placeholders.
- [ ] User Voice cites real sources and contains no fabricated complaints or
      quotes.
- [ ] Scope and out-of-scope items include rationale.
- [ ] User Flows cover the primary intents that are known.
- [ ] Success Metrics have direction and caveats, or are explicitly missing.
- [ ] Risks, dilemmas, and open issues are specific to the feature; open issues
      have owners and target dates or explicit gaps.
- [ ] Competitor claims are sourced, or the section says no grounded source was
      found.
- [ ] Platform considerations cover the contexts that actually apply.
- [ ] Experiments and Changes rows link to a real spec/Jira/Figma and a report,
      or explicitly mark the link as missing; no result numbers are stated
      without a grounded report.
- [ ] Any won + rolled-out experiment is reflected in the product body sections,
      not only logged in the experiments table.
