# Agentic Brain — Architecture Overview

This document explains the repository surfaces, their authority, the quality
layers, and how source-repo workflows operate together. The
[reference architecture](governance/reference-architecture/README.md) explains the
reusable model. The [extraction scope](projects-in-progress/agentic-brain/scope.md)
and [tasks](projects-in-progress/agentic-brain/tasks.md) distinguish accepted
scope from completed migration.

## Storage Model

Brain separates writable context from the sources used to ground it. These are
responsibilities, not a requirement for separate departments or a fixed vendor.

### Hot storage — this repository

Writable Brain content includes:

- active project work, including this repository's evolution;
- cross-cutting instructions organized by operating responsibility;
- reusable reference knowledge with evidence and applicability boundaries;
- shipped feature knowledge and preserved project history;
- canonical workflow definitions and their supporting mechanics.

Authoring follows the owning workflow and contract. A direct edit must satisfy
that same contract. Changes may be prepared locally; PR creation needs Ivan's
explicit approval for that PR. The current default branch is `main`.

Layout below is an orientation summary. The maintained routing contract is the
[operating surface map](governance/operations/repo-workflows.md#surface-map).

```text
governance/
  operations/{roles,flows}/...
  artifacts/...
  quality/{evidence,gates}/...
  reference-architecture/...
knowledge-hub/...
production-features/{feature}/{README.md,feature-knowledge.md}
production-features/{feature}/changes/{change}/...
projects-in-progress/{project}/README.md
projects-in-progress/{project}/artifacts/project-brief-{project}.md
projects-in-progress/{project}/decisions/{slug}.md
projects-in-progress/agentic-brain/{scope.md,tasks.md,extraction.json}
skills-hub/hb-skills/{skill}/{SKILL.md,references,scripts,...}
scripts/...
.agents/skills/...
.codex/hooks.json
.github/workflows/...
```

Folders are created for actual content, not as empty scaffolding. A small Brain
may keep shared references flat; richer local structures need an explicit owner.

### Cold storage — selected implementation evidence

Implementation code, tests, package documentation and shipped behavior remain
at their implementation owner. Brain reads the relevant revision when a claim
requires it. A filename, API inventory or old extraction does not establish
current runtime behavior.

Read only the necessary code paths, test cases and package contracts. Record the
revision and execution conditions when they matter. Brain may synthesize stable
shipped knowledge, but should not copy changing implementation reports into
`production-features/` and treat them as continuously current.

This extraction does not bind every user to one implementation repository.
Whether a future personal Brain keeps implementation beside its context or in a
separate repository remains a setup choice. Do not infer permission to relocate
implementation from the present folder layout.

### Read-only external repositories and systems

External repositories, designs, documents and delivery systems can provide
evidence without becoming Brain-owned content. Inspect the source content, not
just its URL or search result. Pin repository reads when reproducibility matters.
Reading external code does not authorize executing it or writing into that repo.

During this extraction, Harmony Brain is read-only at the revision recorded in
[the provenance manifest](projects-in-progress/agentic-brain/extraction.json).
Only reviewed reusable material is copied. Private project data, credentials and
session logs are not extraction inputs for the new repository.

## Read/Write Boundary

Access permission and factual authority are different:

| Source | Access in this workflow | Authority retained by the source |
|---|---|---|
| This repository | Governed reads and authorized writes | Authored synthesis, operating rules and recorded decisions |
| Implementation repository | Read-only evidence | Code, API contracts, tests and runtime behavior |
| Delivery system | Read when available and relevant | Its ticket state and assignment |
| Design/document source | Read when available and relevant | Its maintained design or document content |
| Source Harmony Brain | Pinned read-only extraction | Original content and its history |

Resolve artifact type, owning surface, exact target, maturity, writer, existing
content and later gates through the
[write boundary](governance/artifacts/artifact-write-boundary.md). A valid path
or successful read does not establish truth, approval, release or publication
rights. The [writer map](governance/artifacts/artifact-writer-map.md) identifies
which workflow maintains each admitted artifact.

## Quality Enforcement Layers

The quality system has three complementary layers:

| Layer | Owns | Current mechanism and limit |
|---|---|---|
| Infrastructure floor | Mechanically checkable properties | Shared file rules, source-link and Decision checks, skill/discovery and root checks, deterministic controller validation and hosted CI. These inspect structure and binding, not truth. |
| Skills and gates | Evidence depth, source-to-claim fit, contradictions, consumer readiness and ownership | Agent-applied [quality gates](governance/quality/quality-gates.md), [evidence policy](governance/quality/evidence-policies.md), workflow contracts and bounded semantic/producer review. |
| Human verification | Decisions, accepted tradeoffs, truth review and approval transitions | Owner confirmation, Decision review and authorized PR review. Neither a generated explanation nor a test result supplies missing approval. |

Skills help authors satisfy these layers; they are not a substitute for runtime
enforcement. A test pass establishes only its tested properties. Model behavior
evaluations sample instruction-following behavior, not product truth. The portable
interaction runner and preserved scenarios are implemented; current model trials
are blocked by CLI model compatibility and Claude login. No suite pass is claimed.

### Hook posture and shared rules

Repository-file rules that run in hooks and CI should share an implementation.
Each rule needs positive and negative regression cases. Structured-write checks
can reject deterministically illegal destinations before a write. Read-only
checks report authored-content defects for the agent to repair; they must not
rewrite unsupported claims into apparent truth. Content advisories invite review
and do not become blocking truth judgments.

The current local lifecycle and delivery hooks are implemented and configured.
SessionStart has been observed in this chat. That observation does not prove
activation of other events; host trust and actual event trials remain separate.
[Agent hooks](governance/operations/agent-hooks.md) owns the exact event coverage,
stop behavior, bypasses and delivery binding. Optional Git checks are another
mount, not evidence that agent-tool hooks are active.

The delivery guard recognizes a bounded set of literal commands. It pauses
relevant pushes or PR creation when current audit evidence is missing, stale or
malformed. The active agent performs semantic review; the guard does not run a
model or interpret arbitrary wrappers. CI validates current digest-bound audit
attestations, not the truth of a semantic conclusion or a claimed owner approval.
Manual actions and unrecognized host/tool paths are outside this interception.

The [access-record mechanism](governance/quality/evidence/access-records.md)
records pinned source-reader operations and host-visible read events. Missing
canonical identities and ambiguous results remain gaps. No connector-wide coverage
or proof of source truth is claimed. The writer-independent
[document review](governance/quality/document-review.md) combines structural checks
with statement, evidence, precedent and semantic review.

[Checkout freshness](governance/operations/flows/brain-checkout-freshness.md)
is implemented and configured for supported tool events. Its deterministic tests
pass; host activation remains separately verifiable. The Git post-checkout helper
preserves local role preferences in new worktrees when installed.

## Canonical Sources at a Glance

| Surface | Maintained responsibility |
|---|---|
| [Operating rules](governance/operations/repo-workflows.md) | Task routing, rule ownership, roles and flows |
| [Artifact contracts](governance/artifacts/artifact-write-boundary.md) | Write boundary, writer ownership and document consumers |
| [Quality](governance/quality/quality-gates.md) | Review transitions, evidence and validation limits |
| [Reference architecture](governance/reference-architecture/README.md) | Explanatory model; does not override operating owners |
| [Active projects](projects-in-progress/README.md) | Current project meaning, scope, boundaries and Decisions |
| [Shared knowledge](knowledge-hub/README.md) | Durable reusable reference with applicability limits |
| [Shipped features](production-features/README.md) | Confirmed shipped knowledge and historical archive context |
| [Skills](skills-hub/README.md) | Canonical authored workflows |
| [Extraction](projects-in-progress/agentic-brain/README.md) | Migration scope, tasks and provenance |

Decisions preserve rationale, alternatives, approval and lineage. When a Decision
changes behavior, update the owning instructions, templates, configuration or
code. Future agents must not reconstruct operational policy from decision history.

## Source-Repo Skill Runtime Model

Canonical workflows live under `skills-hub/`. Installed Codex and Claude discovery links
under `.agents/skills/` point to those packages; they are not independent authored
copies. Skills can be read directly when host discovery is unavailable. Copying a
skill by itself may omit its governing contracts or helper dependencies.

`hb-bootstrap` checks local prerequisites and offers optional Git checks. The
[Creator/Builder role](governance/operations/roles/agent-role-guidance.md) controls
interaction detail only; it grants no permission and changes no evidence rule.
An optional untracked `AGENTS.local.md` stores a preference when the user wants it.
Other host discovery, automatic role copying and connector setup need their own
implementation and verification.

Workflows gather context, structure content, check evidence and consumers, and
write within the authorized scope. They do not invent missing product/design
substance. Connector access is optional and source-specific; a missing connector
is an explicit evidence limitation, not a reason to fabricate a source result.

## Extraction Boundary

Internal boards, allocation/delivery planning, on-call products, prototype shells,
internal site publication, excluded skill collections and company gateway
integrations remain outside the accepted extraction. Their absence is not a reason
to remove reusable roles, flows, contracts or explanation. Preservation is the
default; every substantive omission or adaptation needs a recorded reason.

The [mechanics inventory](projects-in-progress/agentic-brain/t2-mechanics.md)
separates implemented mechanics, tested behavior and pending work. This remains a
private extraction; publication and licensing require separate approval.
