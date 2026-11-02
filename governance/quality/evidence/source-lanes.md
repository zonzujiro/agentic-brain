# Evidence Source Lanes

## Source-Lane Matrix

The matrix below is a default starting point. A workflow may tighten it, but it
must not weaken the evidence-honesty invariant. A lane-specific waiver or gap
may narrow an output; it cannot redefine unread evidence as inspected or a
provisional conclusion as grounded.

For all profiles, apply [Upstream Context Without A Handoff](../../artifacts/documentation-standards.md#upstream-context-without-a-handoff)
when resolving customary files to evidence. An absent handoff does not make an
otherwise satisfied source lane blocked.

### PM / Product Context

Examples:

- product overview
- shipped feature knowledge
- PRD/product-spec refinement
- product assumptions in a handoff

| Lane | Default | Why |
|---|---|---|
| Active project docs | required for active work | Product context must start from current project state. |
| `knowledge-hub` | required when reusable product context exists | Shared product grounding should not be rediscovered. |
| `production-features` | required for precedent and shipped-feature claims | This is the Brain-side product knowledge projection for shipped precedent. |
| External implementation product knowledge | normally out-of-scope | Avoid double-checking the same product facts unless the user explicitly asks or approves deeper source recovery. |
| External implementation code/tests/package docs | conditional | Required only for implementation behavior, ownership, API, state, runtime, or shipped-code claims. |
| `knowledge-hub` | conditional | Required when product claims depend on UX guidelines or design behavior. |
| `knowledge-hub` | conditional | Required when product claims include KPI, metric, or funnel definitions. |
| Slack / Drive / Jira / Figma | conditional | Required when provided as current sources, explicitly in scope, or needed for approved deeper discovery. |

### Production Feature Knowledge

Examples:

- `production-features/{feature}/feature-knowledge.md`
- production-feature source package
- shipped-feature knowledge backfill

| Lane | Default | Why |
|---|---|---|
| `production-features/README.md` | required | The surface contract defines where shipped knowledge belongs. |
| Existing production-feature README / knowledge doc | required when present | Avoid rewriting or contradicting already-consumed Brain-side knowledge. |
| Source package | required when supplied | The writer must audit the package instead of trusting it blindly. |
| Jira / Drive / Slack / Figma / local docs | conditional | Required when provided, discovered for a material gap, or explicitly in scope for source recovery. |
| Nested upstream URLs | conditional | Inspect only when Brain-side extracted data is insufficient and the URL may answer a material gap or conflict. |
| `knowledge-hub` | conditional | Required when reusable product context shapes feature interpretation. |
| `production-features` siblings | conditional | Required for shipped precedent or existing-pattern claims. |
| External implementation product knowledge | normally out-of-scope | Avoid duplicate product checks; use only when explicitly requested or approved for deeper source recovery. |
| External implementation code/tests/package docs | conditional | Required only for implementation, ownership, API, state, runtime, coverage, or event-trigger claims. |

External implementation code/tests/package docs may support a shipped-feature claim, but
they should not be copied into `production-features/` as a current
implementation report. Use them to ground stable shipped behavior or preserve a
visible gap; retrieve current implementation details from External implementation again
when freshness matters.

For source-recovery or batch backfill, each feature needs its own evidence
artifact. Required and triggered lanes must show the source-lane trajectory:
query/tool route, access result, depth, read area, extracted facts/gaps, links
followed, discarded sources, and unresolved gaps. A batch-level summary can roll
up readiness, but it cannot replace per-feature source packages or gate records.

### Active Feature Bootstrap

Examples:

- `hb-start-project`
- creating or completing `projects-in-progress/{project}/README.md`
- bootstrapping Brain active-work surfaces

| Lane | Default | Why |
|---|---|---|
| Root `AGENTS.md` | required | Feature bootstrap writes repo state and must obey repo rules. |
| `governance/artifacts/documentation-standards.md` | required | Feature shape, lazy folders, and downstream doc surfaces are contract-bound. |
| Feature-structure decisions and surface docs | required | Bootstrap must match the current storage model. |
| Existing feature folder and project brief | required when present | Avoid duplicate or conflicting active project state. |
| Domain/product source for metadata | required when metadata is created or changed | Feature metadata must not be invented. |
| `hb-start-project` contract | required | Brain owns project initialization; do not assume an external initializer is installed. |
| External implementation product knowledge | conditional | Use only for domain validation or explicitly requested deeper product-source recovery. |
| External implementation code/tests/package docs | normally out-of-scope | Use only for implementation behavior claims, which feature bootstrap should usually avoid. |
| Slack / Drive / Jira / Figma | normally out-of-scope | Use only when the user provides them as bootstrap sources. |

### UX / UI Design Context

Examples:

- Figma design extraction
- UX guidance
- UI spec/context writing
- UX artifact updates

| Lane | Default | Why |
|---|---|---|
| Figma / current UX artifacts | required | Canonical design evidence lives there. |
| Active project docs and product/design artifacts | required for active work | UX context must align with current product scope and design evidence. |
| `knowledge-hub` | required when reusable UX guidance applies | Avoid inventing local design rules. |
| `knowledge-hub` | conditional | Required when design rationale depends on product audience or goals. |
| `production-features` | conditional | Required for precedent or existing-pattern claims. |
| External implementation product knowledge | normally out-of-scope | Prefer the Brain-side production-feature projection unless the user explicitly asks or approves deeper source recovery. |
| External implementation code/tests/package docs | conditional | Use for implemented component constraints or runtime behavior claims. |
| `knowledge-hub` / event catalog | normally out-of-scope | Use only when design work explicitly affects analytics/BA semantics. |

### R&D / Technical RFC

Examples:

- root technical RFC
- slice design
- architecture/ownership decisions

| Lane | Default | Why |
|---|---|---|
| Active project docs | required | Tech design starts from current feature scope. |
| Product and design evidence (handoff when present) | required for product/UX claims | Current product and UX facts are upstream constraints. |
| Relevant feature/project decisions | required | Tech design must not override accepted local decisions. |
| `knowledge-hub` and `knowledge-hub` | conditional | Required when product/UX assumptions shape architecture. |
| `production-features` | conditional | Required for reuse, precedent, or existing-product claims. |
| External implementation code/tests/package docs | required for implementation, ownership, API, state, and runtime claims | Tech design cannot guess runtime truth. |
| External implementation product knowledge | normally out-of-scope | Use only if explicitly requested or approved for deeper source recovery. |
| `knowledge-hub` / event catalog | conditional | Required for BI event or metric integration claims. |
| Slack / Drive / Jira | optional / conditional | Use when provided or when current ownership/scope cannot be resolved from repo sources. |

### QA / Test Planning

This is claim-specific evidence guidance, not installation of an excluded QA
skill collection or permission to create a new artifact shape.

Examples:

- `quality/test-plan.md`
- coverage mapping
- regression-risk analysis

| Lane | Default | Why |
|---|---|---|
| Active project docs | required | QA needs current feature scope and states. |
| Product and design evidence (handoff when present) | required for product/UX claims | User flows, states, a11y notes, and UI behavior drive coverage. |
| Tech design | required | Test plan depends on implementation and failure modes. |
| Relevant decisions | required when local decisions exist | Accepted scope or risk decisions affect coverage. |
| `production-features` | conditional | Required for reused feature or precedent coverage. |
| External implementation code/tests/package docs | conditional | Required when claiming existing coverage or implementation-specific risk. |
| External implementation product knowledge | normally out-of-scope | Use `production-features/` for shipped product precedent unless explicitly requested or deeper recovery is approved. |
| `knowledge-hub` | conditional | Required for accessibility/UI guideline coverage. |
| `knowledge-hub` / event catalog | conditional | Required when validating BI events or KPI correctness. |

### BI / BA Requirements

This preserves evidence requirements when discussing measurements; it does not
install the excluded BA collection or its writers.

Examples:

- `analytics/bi-requirements.md`
- event mapping
- KPI context
- BA analysis plans

| Lane | Default | Why |
|---|---|---|
| Active project docs | required | BI needs current feature scope. |
| Product and design evidence (handoff when present) | required for product/UX claims | UI actions and flows drive event needs. |
| Tech design | required when available | Runtime trigger points must align with implementation. |
| `knowledge-hub` | required for KPI/metric claims | KPI definitions should not be invented. |
| event catalog / BI catalogs | conditional | Required when event names, schemas, or existing tracking are claimed. |
| `production-features` | conditional | Required for precedent or existing-event behavior. |
| External implementation product knowledge | normally out-of-scope | Prefer `production-features/` unless explicitly requested or deeper source recovery is approved. |
| External implementation code/tests/package docs | conditional | Required when mapping event trigger points to runtime behavior. |
| Figma | conditional | Required when visual source has BA-relevant markings or design action semantics. |

### Decision / Preflight / Repo Governance

Examples:

- feature decisions
- Agentic Brain governance decisions
- preflight analysis
- repo workflow changes
- skill behavior changes

| Lane | Default | Why |
|---|---|---|
| Accepted scope and architecture | required for Agentic Brain governance decisions | Governance must align with product goals and architecture. |
| Relevant Decision summaries | required | Start selective, not recursive. |
| Relevant decision bodies | required for shortlisted decisions | Contradiction, rationale, and lineage checks need exact text. Decision bodies are not governing sources for action. |
| One-hop linked decisions | conditional | Needed for lineage or conflict checks. |
| Affected surface docs | required | Read the contract before changing it. |
| `skills-hub/README.md` / bucket `AGENTS.md` | conditional | Required for skill/package changes. |
| External implementation code/tests/package docs | normally out-of-scope | Use only when governance claims depend on shipped implementation. |
| External implementation product knowledge | normally out-of-scope | Use only when explicitly requested or when approved source recovery needs it. |
| `knowledge-hub` / `production-features` | conditional | Use when the decision affects those surfaces. |

### Skill Change / Package Governance

Examples:

- `hb-review-skill`
- `hb-adopt-skill`

| Lane | Default | Why |
|---|---|---|
| Root `AGENTS.md` | required | Skill changes are workflow-contract changes. |
| `skills-hub/README.md` | required | It defines shared skill package and validation rules. |
| Relevant bucket `AGENTS.md` | required when present | Discipline or vendored buckets can add ownership rules. |
| Affected `SKILL.md` and package files | required | Review must inspect the changed contract and runtime assumptions. |
| Referenced scripts/assets/evals/agent configs | conditional | Required when the skill behavior depends on them. |
| Validators and generated indexes/symlinks | conditional | Required when package shape, validation, or activation changes. |
| Vendored source config | conditional | Required for vendored refresh or curation flows. |
| Related skill decisions | conditional | Use for rationale, lineage, and contradiction checks when a change may reopen accepted governance. Operational behavior must come from skills, docs, validators, or config. |
| Upstream vendored source packages | conditional | Required when adopting or refreshing copied skills. |
| External implementation | normally out-of-scope | Use only when the skill claim depends on shipped implementation or product knowledge. |

### Knowledge Hub Authoring

Examples:

- `knowledge-hub/*-overview.md`
- `knowledge-hub/*`
- `knowledge-hub/*`

| Lane | Default | Why |
|---|---|---|
| `knowledge-hub/README.md` and subtree README | required | Surface and subtree conventions matter. |
| Sibling docs in the target subtree | required | Preserve local conventions. |
| Existing canonical sources supplied by user | required | The content must be grounded. |
| `production-features` | conditional | Required when shared reference depends on shipped feature precedent. |
| External implementation product knowledge | normally out-of-scope | Prefer `production-features/`; reopen product knowledge only when explicitly requested or approved for deeper recovery. |
| External implementation code/tests/package docs | normally out-of-scope | Use only for implementation-behavior claims. |
| Active project docs | normally out-of-scope | Use only if explicitly converting a stable, durable lesson out of active work. |
