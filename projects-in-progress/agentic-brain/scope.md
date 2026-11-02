# Extraction scope

Recorded from Ivan's instructions on 30.10.2026.

## Accepted direction

- Independent copy in the private agentic-brain repository; Harmony Brain continues.
- Preserve substantial reusable governance and mechanics and useful folder conventions.
- Optimize starting and extending a Brain for an individual or small project.
- Remove internal operational products: boards, allocation/delivery planning,
  on-call, prototype shells, internal site publishing, and their dedicated automation.
- Remove CK, BA, and QA skill collections and their owned support files.
- Remove every CK-specific evaluation, fixture, grading path, and dependency.
- Remove the company gateway. External connectors are optional; a connector
  contract needs testing with real connectors before adapter implementation.
- Use GitHub-hosted runners for retained CI checks.
- Make a detailed, source-grounded answer to "How Brain works?" a supported experience.

## Preservation clarification — 02.11.2026

Ivan clarified that the goal is to preserve as much reusable source content as
possible. A smaller deployment is not permission to compress substantive
contracts or omit roles, flows and supporting guidance. Adapt vendor-specific
parts; retain useful detail and folder conventions. Record concrete reasons for
omissions and distinguish excluded products from pending portable migration.

The fifteen candidates are an initial reviewed package set, not a completeness
boundary. The explicit scope decisions below supersede the earlier proposed extension
deferrals; anything unresolved remains visible rather than silently excluded.

## Existing skill candidates

These fifteen identify the reviewed source packages, not approval of every
inherited behavior. All now have adapted instruction sources; see the mechanics
inventory for implemented and missing behavior. The two knowledge writers use
neutral `hb-create-feature-doc` and `hb-create-product-context` names locally;
the old discipline prefixes below identify only their source packages.

- `hb-add-decision`
- `hb-add-knowledge-hub-doc`
- `hb-adopt-skill`
- `hb-archive-project`
- `hb-bootstrap`
- `hb-change-impact`
- `hb-onboard`
- `hb-pm-create-feature-doc`
- `hb-pm-create-product-context`
- `hb-resolve-artifact-write`
- `hb-resolve-decision-impact`
- `hb-review-decision`
- `hb-review-skill`
- `hb-semantic-project-audit`
- `hb-start-project`

## Scope decisions — 02.11.2026

Ivan clarified the missing-capability review:

- Exclude `hb-dev-create-rfc` for now. Keep document standards and validation,
  semantic audit, other applicable checks, and statement/evidence/precedent
  review. Documents produced by external tools must receive the same review;
  adopting a Brain-specific authoring workflow is not a prerequisite.
- Exclude `hb-reconcile-source-pr` from Agentic Brain; Ivan identified its BCA
  dependency. Do not migrate implementation-to-knowledge synchronization.
- Exclude the dedicated `hb-pr-review-follow-through` workflow. Ordinary
  requested PR review and delivery checks remain applicable.
- Retain stronger generic validation, automatic checkout freshness, local role
  propagation into worktrees, the reusable quality-incident learning process,
  Claude support and useful shared helpers. These are required migration work,
  not approved exclusions. Keep private incident entries out.
- Automatic source-access records are required, as confirmed by Ivan on
  02.11.2026. Reuse and adapt the original read runner, shared evidence writer
  and hook observation tooling before designing replacements. Records must come
  from the read/observer, not agent-authored claims. Connector-specific coverage
  still needs verification; missing coverage is a capability gap, not optionality.
  No mandatory connector server or universal interception architecture is selected.
- Feature-source discovery and changelog were questioned, not excluded. Explain
  their purpose and preserve them as unresolved migration candidates. The earlier
  proposed deferrals are not user-approved omissions.
- Behavior evaluations mean model-based evals, distinct from deterministic
  tests. The earlier T5 direction remains; the clarification question does not
  select a new runner or approve copying excluded evaluation dependencies.

## Initial audit and extraction boundary

The source audit covered 1,997 tracked paths at commit
`692907b0c148da2df0f69daaa21bc988d23ab946`. It was path-level triage with targeted
contract and dependency inspection, not full publication clearance. Its private
file inventory is not bundled into this future public product. The extraction
manifest records only the reviewed files brought into this increment.

The original generic-looking document writer actually serves test-plan and BI
requirements. It is excluded. A general project-context authoring workflow must
be designed without importing those discipline requirements.

## Release conditions

A fresh user without company access can set up the supported environment, create
one small project, record a supported decision, update its consequences, and
recover that context in a later session. No excluded package, account, connector,
or missing internal file may be required for that journey. Licensing, private-data
review, and explicit public-release approval remain separate requirements.
