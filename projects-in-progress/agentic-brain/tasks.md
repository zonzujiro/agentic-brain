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

State: in progress. All fifteen candidate instruction workflows are adapted,
with neutral names for the two knowledge writers. The portable semantic and
producer controllers are retained, not replaced by manual-only descriptions.
Source hashes and transformations are in `extraction.json`.

Local validation: 66 tests and repository checks pass. All fifteen skill sources
pass the format checker in an isolated temporary PyYAML environment; core runtime
still has no npm dependencies. Codex CLI 0.144.2 discovered all fifteen repository
skills and successfully invoked the routing skill in an ephemeral read-only trial.
Optional Git hooks passed real disposable commit/push tests; no main-checkout hook
configuration was changed. These are separate kinds of evidence.

See [T2 mechanics](t2-mechanics.md) for the exact retained/adapted mechanics,
removed dedicated tests, host evidence and missing work. Agent tool hooks, automatic
audit enforcement and remaining portable validators/adopter are still pending,
not approved exclusions. T2 acceptance is not complete.

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

State: deferred until a real host and connector are selected and connected.

This task is explicitly requested by Ivan. Do not finish adapters on assumptions.
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

State: pending; evaluation kit not selected.

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
