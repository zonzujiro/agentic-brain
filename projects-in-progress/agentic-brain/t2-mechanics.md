# T2 mechanics and verification

Inspected and exercised on 30.10.2026. This is an implementation inventory, not
approval to drop unported source mechanics. Source provenance is in
[extraction.json](extraction.json); the accepted boundary remains [scope](scope.md).

## Preserved and adapted

| Mechanic | Current implementation and evidence |
|---|---|
| Evidence links and footnotes | Shared Markdown utility and repository check; nine foundation tests retained |
| Change discovery | Local exact-path, optional affected-document and shared-source candidates; baseline coverage and outside-path tests |
| Decision operations | Stable records, parser moved from notification module, dot-date validation, catalog and active/archived lineage; no notification dependency |
| Semantic audit | Portable Node/Git controller and two schemas, qualified identities, complete pair routing, bounded packets, changed-hunk evidence, schema/citation validation, input digests, isolated combined trees and owned temporary sessions |
| Semantic regression coverage | Thirty-four generic controller tests and four freshness tests retained; dedicated planning tests and unrelated company metadata-validator import removed; no CK cases copied |
| Producer conflict audit | Portable two-stage controller, batching, output ownership comparison, cited results, input binding and session cleanup; new neutral local fixtures avoid excluded collection tests |
| Skill source | Fifteen instruction packages; source discipline names removed from the two knowledge writers; all pass skill-creator format validation |
| Codex discovery | Fifteen relative `.agents/skills/` links to canonical sources; no duplicate packages |
| Local Git checks | Optional non-overwriting installer, pre-commit and pre-push run tests/checks; real disposable Git operations exercise success and failure, preservation and stale configuration |
| Onboarding | Fictional source/working-reference sandbox exercise with actual evidence and shared-knowledge contracts; not the complete T3 lifecycle example |

The semantic controller's active README input limit is 100 lines and 10,000
characters; an oversized input stops with an error rather than silently dropping
meaning. This is an audit input limit, not permission to remove substantive
context. Put supporting depth in owned documents and keep the README meaningful.
The source governance-project-name exclusion was removed; it is not a general
rule that a project with a particular name cannot supply evidence.

The producer packet's compatibility field `writer_map` carries the current
write-boundary contract. Current surface contracts and actual artifacts remain
operational owners. Neither historical Decisions nor generated audit text replace them.

## Actual host verification

Codex CLI 0.144.2 ran with the existing login, ephemeral sessions, read-only
sandbox and ignored user configuration. One trial listed all fifteen repository
skills from initial skill metadata without file searches. A second explicitly
invoked the routing skill, read local contracts, resolved the existing evidence
policy owner, and kept the unspecified replacement rule unresolved. Both exited
successfully. No session logs or credentials are stored in this repository.

This uses the documented repository discovery route and symlink support in
[OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills).
Observed behavior here establishes this CLI discovery/invocation path only.
It does not prove every workflow's behavior or desktop/other-host parity.

Git-hook tests use disposable repositories and a local bare remote. No hooks were
installed into Ivan's main checkout. Hooks inspect the current working tree;
they do not isolate staged content or prove the pushed revision passed. Hosted
CI checks committed content separately. Existing custom hooks remain untouched.

## Acceptance status after the remaining-mechanics increment

| Area | State and reason |
|---|---|
| Agent tool/lifecycle hooks and shared engine | Implemented and fixture-tested; configuration prepared. Actual host outcomes pending user trust; details below. |
| Bounded delivery interception and PR attestation guards | Implemented for actual repository/head input and fixture-tested. Live hook and hosted PR execution remain unverified; supported command scope is explicit. |
| Surface/skill validation and adopter | Implemented against current contracts; reviewed imports preserve bytes and reject collisions. |
| Identifier overlap validation | Implemented with coverage limits and warning-only findings; no mandatory company metadata. |
| Full workflow behavior evaluation | T5 remains pending; no kit selected. Local trials and deterministic tests are not a model evaluation suite. |
| Complete setup journey and worked small-project lifecycle | T3 remains pending; the project starter and sandbox lesson are partial inputs. |

## Explicitly deferred or excluded

Connector-specific host observation and action interception remain deferred under
T4 until actual host/connector combinations are selected and connected. No
adapter, automatic access receipt or action-enforcement guarantee is claimed.

Operational products, company gateway dependencies and CK/BA/QA collections and
CK-specific evaluation infrastructure are excluded by accepted scope. They are
not hidden runtime dependencies. Generic semantic behavior cases may be considered
for T5 with a replacement runner; the internal evaluation package is not retained.

No new scope decision is needed to retain the portable controllers. Their temporary
manual-only adaptation was replaced once dependency inspection showed the core
was portable. T2 remains in progress because the missing mechanics above are real
work, not because Ivan must approve their continued investigation.

## Remaining-mechanics increment

The next increment implements the previously missing portable pieces. Local
validation now passes 116 tests and repository checks. Independent disposable
adoption and delivery review found defects in onboarding compatibility, permissions,
source symlinks, large-group clearance guidance, command working-directory binding
and PR-body triggers; those were corrected and exercised before delivery.

| Mechanic | Implementation and verification |
|---|---|
| Surface and skill shape | Current root ownership, minimal active README, strict skill block metadata and canonical relative discovery; no team/notification requirements |
| Identifier overlap | Source claim-position, case-sensitive identifier, clustering, dormancy and coverage mechanics; 27 generic tests retained plus qualified-identity regression; findings remain advisory |
| Relations | Legacy active slugs and qualified active/shipped members; exact-group clearance, complete corpus routing when the ledger changes; malformed input fails visibly |
| Adoption | Preview-only default, reviewed byte digest, exclusive target creation, metadata/mode preservation, explicit optional discovery link, no source execution or overwrites |
| Shared rules | Same root/link/footnote/private-marker engine in checks and hook mounts; source empty-section, hedge, linked-gap and peer rules remain advisories |
| Lifecycle | Configured SessionStart, structured pre/post-write and Stop mounts; one repair continuation, no authored-content rewrite or transcript storage; fixture tests pass |
| Delivery | Bounded direct-command interception, explicit actual checkout/head binding and both current audit digests; local tests reject stale/hidden attestations, another repository's event and workdir overrides |
| PR CI | Read-only job checks the event's head SHA and base repository; body edits rerun the guard. Local committed-fixture tests pass; actual hosted PR execution is unverified because no PR was authorized |

The source root-document validator exclusively covered handoffs, RFCs, test plans
and BI requirements. Those artifact writers are outside the accepted retained
set, so their templates and required sections were not installed. The portable
active README contract is checked without importing the source company metadata.
Source planning/QA regenerators, role setup, format exceptions and session-based
external evidence assertions are also absent by their established scope boundary.
Decision rules reuse the already adapted validator. The final whole-tree check
replaces session-attributed dirty queues; it reports pre-existing issues without
claiming the current turn caused them. Connector receipts remain T4 work.

### Live hook acceptance still blocked on trust

A disposable copy with the new hook configuration was exercised using Codex CLI
0.144.2, ephemeral read-only mode and the existing login. It ran `pwd` successfully,
but reported no identifiable Agentic Brain hook context. Generic host event labels
were present; those are not proof that these repository handlers executed.
No trust records or approval settings were changed and no bypass flag was used.

The [Codex hook contract](https://learn.chatgpt.com/docs/hooks) requires trust for
project layers and exact non-managed hook definitions. Configuration is now
prepared at `.codex/hooks.json`; Ivan must review/trust it through `/hooks` before
we can demonstrate the real session, denied write, allowed write and final-check
outcomes. The user-owned trust step blocks T2 host acceptance, not code authoring.
See [local hook scope](../../governance/operations/agent-hooks.md) for limitations.
