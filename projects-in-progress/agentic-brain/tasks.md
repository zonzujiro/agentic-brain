# Extraction tasks

Owner: Ivan. Recorded: 30.10.2026. This list tracks work; it does not substitute
for implementation evidence or create external tickets.

## T1 — Independent foundation

State: baseline `f094e45` pushed to private `zonzujiro/agentic-brain` on
30.10.2026. Nine tests and repository checks passed locally on Node.js 26.7.0;
[hosted Node.js 24 validation passed](https://github.com/zonzujiro/agentic-brain/actions/runs/41066397637).

Separate checkout, accepted scope, source provenance, core evidence and
communication guidance, dependency-free source-link checks, and hosted CI definition.
Acceptance: tests and repository checks pass in the extracted repository without
company access; the source checkout remains untouched.

## T2 — Core governance, skills, and hooks

State: in progress. Fifteen candidate instruction workflows are adapted, but
that package count does not establish preservation of the source operating model.
The two knowledge writers have neutral names. The portable semantic and
producer controllers are retained, not replaced by manual-only descriptions.
Source hashes and transformations are in `extraction.json`.

Earlier increment validation: 116 tests and repository checks passed. All fifteen skill sources
pass the format checker in an isolated temporary PyYAML environment; core runtime
still has no npm dependencies. Codex CLI 0.144.2 discovered all fifteen repository
skills and successfully invoked the routing skill in an ephemeral read-only trial.
Optional Git hooks passed real disposable commit/push tests; no main-checkout hook
configuration was changed. These are separate kinds of evidence.

See [T2 mechanics](t2-mechanics.md) for the exact retained/adapted mechanics,
removed dedicated tests, host evidence and missing work. Surface/skill validation, identifier comparison, the reviewed adoption helper,
shared file rules, local lifecycle mounts and revision-bound delivery guards are
implemented. The new Codex hook configuration still needs Ivan's review/trust in
`/hooks`; a disposable read-only CLI trial did not receive identifiable Brain hook
context. SessionStart was subsequently observed in this chat. Other event activation
and T2 host acceptance remain unverified; the observation does not establish
trust or coverage for every event. The PR guard passes local committed
fixtures; actual hosted PR execution also remains unverified (no PR authorized).

Adapt the fifteen candidates in scope; retain substantive reusable contracts.
Remove obsolete owners, package references, schemas, source routes, notification
metadata, and planning/QA triggers. Move shared utilities out of removed modules.
Preserve generic behavioral coverage; remove CK-specific coverage outright.
Acceptance: every retained workflow resolves its required files; host integration
is tested in an actual supported host; no inherited company service is mandatory.

## T3 — Build your own Brain and explain it

State: pending; initial reading route, minimal project starter and a fictional
knowledge onboarding exercise exist. The full lifecycle example and explanation
coverage review are not complete.

Design the initializer and a general project-context writer. Establish whether
same-repository and separate-repository implementation are supported. Build one
fictional small-project fixture through evidence, decisions, changed assumptions,
delivery confirmation, and reusable knowledge. Explain extension and optionality.
Acceptance: a fresh agent can follow the fixture and explain the whole system,
including ownership, freshness, gaps, quality layers, and present limitations;
review against an explicit coverage rubric. No requirement to use separate roles.

## T4 — Real connector investigation

State: required. Automatic source-access records are mandatory. Portable
existing-tooling migration can proceed; connector-specific acceptance requires
an actual connected host/connector pair.

This task is explicitly requested by Ivan. Start from the pinned source's
`scripts/read_source.mjs`, `scripts/lib/source-evidence.mjs`, session log and
source-observation hooks. Inspect their dependency and privacy boundaries, retain
portable coverage and tests, and adapt the company-specific routes. The source
writer silently treats a log failure as advisory; do not inherit that behavior
as proof that the mandatory recording requirement was satisfied. Preserve the
read result but expose missing recording and do not mark access as recorded.

Do not finish adapters on assumptions.
Choose one actual host/connector pair and inspect tool inputs, outputs, source IDs,
URLs, pagination, and the hook events the host actually exposes. Exercise full and
partial reads, denied access, authentication failure, unsupported operations, and
actions in a disposable destination with explicit action authorization.

Proposed contract topics: link resolution and stable identity; read coverage;
actions and approval; evidence; source authority; failures. Determine whether
instructions plus host-observed JavaScript adapters suffice, or a request-executing
wrapper is needed. Connectors and authentication belong to the user's configured
environment; no mandatory Brain-owned MCP server is approved.

Acceptance: a demonstrated compatibility record and captured, sanitized fixtures
support each claimed capability. Document unavailable observation or interception.
Only then implement and test adapters. Never claim instruction-only support provides
automatic evidence tracking or action enforcement. No external writes are authorized
merely by this task description.

## T5 — Portable behavior evaluations

State: portable host-CLI trial runner and 13 retained interaction scenarios
implemented. Representative attempts are blocked: configured Codex model requires
a newer CLI; Claude reports no login. No behavior pass is claimed.

Choose a replacement kit using retained Brain scenarios. Delete all CK-specific
scenarios, fixtures, grading, and dedicated infrastructure. Preserve only shared
parts needed by retained behavior. Deterministic tests and model evaluations must
remain separate; unavailable model access cannot be reported as a behavior pass.
Acceptance: representative retained scenarios run through the selected kit with
honest backend and outcome reporting. No internal package dependency remains.

## T6 — Publication readiness

State: pending; repository stays private.

Resolve permission to distribute retained material and license choice with Ivan.
Review files for confidential data, credentials, private-source leakage, and third-
party obligations. Complete installation and local-only lifecycle acceptance,
verify hosted CI, and review documentation for false capability claims.
Acceptance: concrete review results and Ivan's explicit approval to make it public.
Do not add a guessed license or publish because deterministic checks pass.

## Preservation correction — 02.11.2026

The initial extraction over-compressed architecture, evidence and surface
contracts and omitted reusable operating roles/flows. The local correction
restores those contracts, detailed gate procedures, writer routing, document
consumer guidance and original source-link regression coverage. See the
[preservation audit](preservation-audit.md) for file-level dispositions and gaps.

Still required before full-preservation acceptance:

- validate live host and connector coverage beyond the restored document,
  ownership/profile, format and source-portability checks;
- verify actual host freshness events; the checker, mounts and automatic Git
  worktree role propagation are now implemented and tested;
- resolve source-discovery and changelog candidates; RFC authoring, source-PR
  reconciliation and dedicated PR follow-through are now explicitly excluded;
- complete model acceptance under T5; the portable runner, retained interaction
  fixtures and full fictional lifecycle are now implemented;
- validate actual host events and hosted PR guards under T2.

These are pending implementation/review tasks, not missing-content exemptions or
claims that guidance alone restored the original runtime.

## T7 — Writer-independent document review and retained safeguards

State: repository implementation and deterministic verification completed on
02.11.2026; host activation and model acceptance remain explicitly unverified.
See [the increment review](gap-review.md) for exact coverage and remaining work.

Accept documents written by other tools through their resolved artifact owner.
Validate against the applicable documentation standard without requiring the
excluded RFC authoring skill. Preserve all applicable existing validation and
semantic audit. Review material statements against actual evidence and compare
precedents for applicability; a complete outline or passing schema is insufficient.
A review reports missing consumer information, unsupported statements,
contradictions and unresolved decisions without inventing content.

Retain and adapt generic skill ownership/profile checks, document and artifact
validation, and useful shared helpers. Restore checkout-freshness enforcement and
non-overwriting worktree role propagation. Support both Codex and Claude with
canonical skill sources and discovery-index synchronization; verify actual host
behavior separately from configuration. Restore the quality-incident intake,
triage, corrective-rule and regression loop without copying private incident data.

Acceptance: external-authored fixtures with structural and semantic defects
produce concrete findings; clean controls do not. Stale checkout/worktree and
role-preservation tests pass. Each host has explicit verified event coverage or
an honest remaining gap. Quality feedback can lead to a reviewed rule/test repair.
Model-based evidence and deterministic checks remain separately reported.

Automatic access recording is mandatory under T4; connector coverage and adapter
design still require investigation. Source discovery and changelog remain
open candidates; the three explicitly dropped workflows are not T7 dependencies.
