# Preservation audit

Current update, 02.11.2026: [gap increment review](gap-review.md) supersedes the
implementation-absence statements in this earlier snapshot. Retain the earlier
record for migration history; use the review for current coverage and blockers.

Reviewed: 02.11.2026. Source revision: `692907b0c148da2df0f69daaa21bc988d23ab946`.

## Finding and correction

The first extraction confused a smaller deployment with a smaller operating model. It omitted reusable roles and flows, compressed architecture and evidence rules, and removed generic test coverage. Those were preservation errors, not consequences of the accepted Wix/product exclusions.

This correction restores the portable documentation family and reconnects its consumers. It does not claim to restore every original runtime. Source Harmony Brain was read only. No private project corpus, credentials or session logs were copied.

## Coverage and limits

- Enumerated all 1,997 source paths; root-family counts below account for the full inventory. This is inventory coverage, not a claim that every private data file was semantically reviewed.
- Compared all 95 source-to-target provenance mappings (95 distinct source files, 93 target files); verified source hashes and target existence.
- Reviewed the 24 previously adapted Markdown counterparts for deleted guidance, the root/surface guides, every operations page, the shared documentation/gate/evidence family, and removed mechanics/test functions. Retained specialized standards are labeled reference guidance where their writers/validators are missing.
- Generic omitted source-link tests are restored: 34 cases versus 5 before this correction. Full suite: 145 passed; `npm run check` passes; 72 Markdown files passed the additional local anchor/fence review.
- Path triage of omitted source infrastructure is not full semantic or publication clearance. The unresolved portable families below remain acceptance gaps.

## Source inventory by family

| Source family | Paths | Disposition |
|---|---:|---|
| `.agents` | 114 | Host index recreated for installed packages; private/source-only instructions not copied. |
| `.brain` | 1 | Local machinery/session content not copied. |
| `.claude` | 2 | Other host configuration not installed; compatibility unverified. |
| `.codex` | 1 | Local hook configuration adapted; actual events separately verified. |
| `.github` | 41 | Hosted CI adapted; source product, notification and publishing workflows excluded. |
| `.yarn` | 1 | Source package-manager asset not required by dependency-free npm runtime. |
| `[root files]` | 15 | Entry contracts restored; package and runtime configuration adapted. |
| `actions` | 29 | Explicitly excluded internal product and its dedicated support. |
| `boards` | 8 | Explicitly excluded internal product and its dedicated support. |
| `governance` | 220 | Portable non-fixture docs restored; dedicated product flow excluded; evaluations/fixtures and incident machinery pending. |
| `harmony-playground` | 46 | Explicitly excluded internal product and its dedicated support. |
| `knowledge-hub` | 28 | Private shared corpus excluded; reusable surface contract retained. |
| `planning` | 13 | Explicitly excluded internal product and its dedicated support. |
| `production-features` | 209 | Private shipped corpus excluded; surface/archive contracts retained. |
| `projects-in-progress` | 534 | Private source project corpus excluded; reusable root contract and selected workflows reviewed. |
| `scripts` | 323 | Current extracted mechanics compared; product-specific machinery excluded; generic residuals listed below. |
| `site` | 28 | Explicitly excluded internal product and its dedicated support. |
| `skills-hub` | 384 | Selected packages adapted; excluded collections omitted; portable extensions need further review. |

## Restored documentation and consumer review

| Family | Correction | Consumer disposition |
|---|---|---|
| Architecture and root guides | Storage/authority model, quality layers, canonical sources, skill runtime and source emoji navigation | Root boot, README and how-it-works link to full owners |
| Operations | Creator/Builder roles, checkpoints, fact intake, solution framing, impact population, feature/governance/PR/freshness flows | Bootstrap and root routing restored; freshness/worktree automation still pending |
| Artifacts | Writer map, document consumers, visible gaps, handoff-independent evidence and detailed specialized references | Existing writers remain authoritative; uninstalled specialized writers are not claimed active |
| Evidence and gates | Source depth, cross-reference, stable truth, inventories, source lanes, transition procedures, profiles and Decision checks | Installed writer/reviewer skills point to restored shared profiles |
| Surface READMEs | Semantic capsule, archive shapes, stable shipped truth, lossless consolidation, optional shared taxonomy and skill package explanation | Project starter, archive/feature writers and extraction README aligned |
| Feature template and writer | Detailed platform prompts and claim-driven implementation search | Existing source-grounded output contract preserved |
| Regression tests | All original generic source-link cases through current engine | 34 source-link cases pass; no new production implementation introduced |

## Remaining portable migration gaps

These are pending work, not approved exclusions. Their guidance may be retained while runtime remains absent. T2/T3/T5 must not be marked complete until each has an explicit implemented, replaced, or owner-approved exclusion disposition.

| Family | Current disposition | Acceptance needed |
|---|---|---|
| Skill ownership metadata and gate-profile validation | Original metadata model/profile docs retained; original enforcement removed | Migrate parser/validator coverage and package declarations together, or get an explicit replacement decision |
| Artifact-format, source portability, instruction shape and project metadata checks | Current root/link/Decision/skill checks are narrower | Preserve generic checks without reintroducing excluded product exceptions; document deliberate replacements |
| Source evidence reader/receipts, response-access and evidence review | Mandatory retention confirmed on 02.11.2026; not installed yet | Reuse the original self-logging reader, shared writer and observer tooling; verify connector-specific coverage under T4 and expose recording failures |
| Checkout freshness and role propagation | Manual guidance restored; source network hook/worktree copying absent | Migrate and test current/stale/network-denied worktrees plus actual host mounts |
| Index synchronization and document validators | Decision catalog and lineage checks already exist; discovery synchronization and broader document validation still need work | Preserve existing catalog; migrate missing generic helpers and checks |
| Portable extension skills | On 02.11.2026 Ivan excluded RFC authoring for now, source-PR reconciliation and dedicated PR follow-through. Changelog and source discovery remain open. | Preserve writer-independent document validation; resolve the two open candidates without treating questions as exclusions |
| Onboarding and behavior evaluations | Current fictional lesson works; original full lifecycle/interaction fixtures and model kit not migrated | T3 complete lifecycle and T5 portable behavioral evidence, with CK-specific material removed |
| Quality incidents | Private source incident entries not copied; original generic feedback machinery absent | Preserve useful generic failure-learning contract without source session data |

## Per-file provenance review

Every row below has a verified pinned source hash in `extraction.json`. Adaptations record scope and current limits; a retained reference is not runtime parity.

| Target | Disposition / retained boundary |
|---|---|
| `.codex/hooks.json` | Adapted only local lifecycle, structured-write and bounded delivery events; no external evidence observer, checkout policy or excluded generator mounts; requires user hook trust. |
| `AGENTS.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved extraction-specific constraints and restored risk-based boot, role routing, user interaction, solution/impact and delivery pointers. |
| `ARCHITECTURE.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored storage/read-write model, quality layers, hook posture, canonical owners and skill runtime in detail. Kept current implementation status and explicit excluded-product boundaries. |
| `README.md` | Preserved source title/navigation emojis and surface orientation. Adapted identity, private setup/site/planning routes and current capability status; added role/flow navigation and explicit incomplete migration state. |
| `governance/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. |
| `governance/artifacts/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. |
| `governance/artifacts/artifact-write-boundary.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Retained existing detailed boundary and connected restored writer map; current enforcement limits preserved. |
| `governance/artifacts/artifact-writer-map.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored artifact ownership, direct-edit and fact-intake routing against installed writers; removed unavailable writer claims and excluded product rows. |
| `governance/artifacts/documentation-standards.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved shared and specialized reference contracts with explicit writer/validator limits. |
| `governance/artifacts/documentation-standards/bi-requirements.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved detailed consumer/section/checklist guidance as retained reference; specialized writer/schema remains pending, private implementation examples removed. |
| `governance/artifacts/documentation-standards/dependencies.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved detailed consumer/section/checklist guidance as retained reference; specialized writer/schema remains pending, private implementation examples removed. |
| `governance/artifacts/documentation-standards/handoff.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved detailed consumer/section/checklist guidance as retained reference; specialized writer/schema remains pending, private implementation examples removed. |
| `governance/artifacts/documentation-standards/technical-rfc.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved detailed consumer/section/checklist guidance as retained reference; specialized writer/schema remains pending, private implementation examples removed. |
| `governance/artifacts/documentation-standards/test-plan.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved detailed consumer/section/checklist guidance as retained reference; specialized writer/schema remains pending, private implementation examples removed. |
| `governance/onboarding/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored teaching model and isolation/repair guardrails; original discipline fixtures and complete lifecycle explicitly pending. |
| `governance/operations/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. |
| `governance/operations/communication.md` | Preserved substantive communication contract; renamed the owning Brain |
| `governance/operations/flows/brain-checkout-freshness.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored manual freshness and original rollout/safety requirements; network hook explicitly pending. |
| `governance/operations/flows/feature-context.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Retained project-to-shipped-to-shared flows; removed CK and dedicated delivery-plan dependency. |
| `governance/operations/flows/governance-and-skills.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. |
| `governance/operations/flows/pr-operations.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved portable PR preparation, review-request intent, failure handling and follow-through boundaries; excluded company sync/notification automation, no auto-merge assumption. |
| `governance/operations/repo-workflows.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored rule ownership, instruction-file boundaries, Decisions versus governing rules, shape/surface routing, flows and dates; excluded dedicated products and unavailable artifact families. |
| `governance/operations/roles/agent-role-guidance.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved two interaction roles and optional local preference; no worktree-copy automation or repeated setup when the user already stated a preference. |
| `governance/operations/solution-and-impact.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Retained solution alternatives, resume behavior, full-population impact review and semantic review; points to current delivery implementation instead of inherited host/telemetry claims. |
| `governance/operations/working-with-users.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Retained WIP gates, checkpoints, user fact intake, open-question closure and authority boundaries; removed unavailable telemetry/notification and historical Decision pointers. |
| `governance/quality/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Removed links to uninstalled evaluation/fixture trees and described actual test location. |
| `governance/quality/evidence-policies.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored governing-source lane, source-depth vocabulary, bounded nested reads, support levels and stable-artifact boundary; no receipt enforcement claim. |
| `governance/quality/evidence/grounding.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored claim-driven implementation lane and general data-driven availability lesson; excluded company catalog endpoint and private component examples. |
| `governance/quality/evidence/inventory.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored full per-source record and per-target batch requirements; removed source-only observer transport claims. |
| `governance/quality/evidence/source-lanes.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored claim-driven source matrices including optional design/test/measurement evidence; removed dedicated planning, CK, private regression pool and private principles. |
| `governance/quality/gates/decision-preflight.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Removed private principles dependency; retained durable-rule preflight, decision review and operational follow-through. |
| `governance/quality/gates/evidence-and-freshness.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored full statement review, source readiness, grounding, cross-reference and freshness procedures; removed BCA and receipt dependencies. |
| `governance/quality/gates/gate-catalog.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Retained Decision operation matrix and workflow routing through named profiles; removed duplicated gate-set lists and excluded writers. |
| `governance/quality/gates/gate-profiles.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored profiles and a complete example; fixed the source document’s split code fence and disclosed manual validation. |
| `governance/quality/gates/routing-and-readiness.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. |
| `governance/quality/quality-gates.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored detailed review with explicit WIP-versus-promotion scope. |
| `governance/reference-architecture/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. |
| `governance/reference-architecture/capabilities.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Retained capability decomposition, aligned preservation default and removed excluded products. |
| `governance/skills/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Corrected inherited claims of metadata enforcement and a nonexistent surface instruction file. |
| `governance/skills/skill-metadata.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved original ownership metadata vocabulary and schema as reference; explicitly pending validation migration, no unsupported frontmatter requirement. |
| `knowledge-hub/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored author/read boundaries and optional taxonomy; no mandatory organization-sized layout. |
| `production-features/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored full archive shapes, stable evidence boundary, semantic primary document and lossless domain consolidation; removed private bootstrap and notification routes. |
| `projects-in-progress/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored capsule update triggers, experiments and authoring rules without private notification/roster schema. |
| `scripts/__tests__/project-overlap.test.mjs` | Retained 27 generic identifier and coverage tests with fictional examples; removed delivery-plan test, three excluded artifact-placement tests and source-corpus-specific expectation. |
| `scripts/__tests__/semantic-audit-freshness.test.mjs` | Retained four generic content-freshness and conflict-isolation tests; target remote main while fixture branch master remains an explicit supported base. |
| `scripts/__tests__/semantic-project-audit.test.mjs` | Retained generic controller, routing, bounded evidence, input freshness, Git isolation, invalid-output and owned-cleanup tests. Removed four dedicated planning-product tests/fixtures and the company metadata-validator import/constant comparison; neutralized synthetic assistant naming. |
| `scripts/__tests__/source-footnote-links.test.mjs` | Restored all original 34 source-link regression cases, including cross-surface, symlink, multiline, changed-claim and mounted-engine coverage. Adapted the retired standalone rule mount to the current shared engine; no production behavior changed. |
| `scripts/decision/decision-catalog.mjs` | Retained local metadata-first retrieval and reverse lineage derivation; removed dependency on notification module by moving shared parser. Validate records before retrieval and include sibling-project references when deriving reverse lineage. |
| `scripts/delivery/producer-conflict-audit-guard.mjs` | Retained producer finding counts, resolution and owner fields; removed Harmony sync-title exemption. |
| `scripts/delivery/semantic-project-audit-guard.mjs` | Retained attestation format/digest checks; removed Harmony sync-title exemption and inherited import. |
| `scripts/hooks/lib/adapter.mjs` | Retained portable structured patch and literal command parsing; resolve relative paths from event cwd; no external connector observation. |
| `scripts/hooks/local-lifecycle.mjs` | Adapted structured target checks to current root contract, deletion/move repair, event cwd and symlink handling; consolidated lifecycle mounts without connector observation or excluded generated artifacts. |
| `scripts/hooks/pre-delivery.mjs` | Adapted bounded direct-command guard to this checkout/main and both current commit-bound audits; rejects workdir/repository overrides, unsupported push scopes and compound commands; no inherited sync exemption. |
| `scripts/hooks/run-engine.mjs` | Adapted read-only report CLI to current shared engine; no automatic authored-content normalization. |
| `scripts/lib/hooks/advisories.mjs` | Retained hedge, empty-section, linked-gap and peer review as non-blocking advisories; bounded linked reads to repository; removed excluded artifact and role rules, replaced duplicate Decision rules with existing shared validator. |
| `scripts/lib/hooks/engine.mjs` | Adapted shared read-only rule mount used by repository validation and hooks; current root/link/footnote rules, no inherited session receipts or quality-feedback dependencies. |
| `scripts/lib/hooks/surfaces.mjs` | Retained root ownership mechanic against current surface contracts; removed inherited products, format blacklist, discipline exceptions and source-only root files. |
| `scripts/lib/markdown/footnotes.mjs` | Copied without changes |
| `scripts/lib/markdown/frontmatter.mjs` | Moved dependency-free block-style metadata parser out of excluded notification module; normalize BOM and CRLF. Restricted parser syntax is documented; notification behavior is not retained. |
| `scripts/lib/project-overlap/detect.mjs` | Retained claim positions, opaque identifiers, scoped packages, clustering, dormant filtering, coverage reporting and advisory output; removed planning and placement rules; neutral owners and qualified relation members with legacy active-slug compatibility. |
| `scripts/lib/repo-date.mjs` | Adapted human dates to required dot-only format and reject impossible calendar dates. |
| `scripts/validate_decisions.mjs` | Retained stable-path, metadata, lineage, supersession-cycle and impact structure validation; moved parser import to shared Markdown utility, require valid dot dates, reject empty participants and misleading completion dates. Reject unsupported scalar forms and duplicate/unknown metadata keys; do not traverse symlinked decisions directories. |
| `scripts/validate_project_overlap.mjs` | Retained advisory CLI and touched-project annotation filtering; crashes fail visibly; removed excluded placement output. |
| `scripts/validate_root_paths.mjs` | Retained portable path validation CLI backed by current surface map. |
| `scripts/validate_skills_hub.mjs` | Adapted portable metadata, folder and discovery checks; shared strict block parser with adopter; removed collection metadata, evaluation catalog and host-specific requirements. |
| `skills-hub/README.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Preserved current catalog and mechanics; restored source emoji headings, adoption explanation, package responsibility, review and onboarding navigation. |
| `skills-hub/hb-skills/hb-add-decision/SKILL.md` | Retained stable Decision ownership, evidence, alternatives, contradiction/lineage review and narrow impact updates; removed discipline/planning/notification routes, private principles and unmigrated gate profiles; use dot dates and extracted local checks. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-add-decision/references/workflow-contract.md` | Retained operation contract and user-owned choices; removed dedicated QA applicability workflow and unmigrated gate profile. |
| `skills-hub/hb-skills/hb-add-knowledge-hub-doc/SKILL.md` | Preserved nine-step shared-reference authoring and evidence review; removed discipline taxonomy, automatic evidence logs, inherited PR templates and gate names; use current hub contract and existing authorization, with small-project flat references. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-adopt-skill/SKILL.md` | Retained bounded source adoption, metadata preservation, collision handling and honest manual review. Removed discipline buckets, automatic importer/index claims and excluded collection routes; use reviewed explicit copies and current validation.; reviewed digest-bound helper with explicit optional discovery installation Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-adopt-skill/scripts/adopt_skills.mjs` | Adapted reviewed package inventory/copy; one explicit normalized package, preview-first digest-bound apply, no metadata stripping, rename, script execution or implicit index mutation; refuse collisions and symlinks. |
| `skills-hub/hb-skills/hb-archive-project/SKILL.md` | Retained single-project archive modes, exact-target collision protection, inventory preservation, pointer impact and delegated knowledge handoff. Removed operational planning/QA products, role setup, notification and receipt assumptions; retain active and archived Decision lineage. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-bootstrap/SKILL.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Reconnected role preference setup without restoring company login or automatic worktree copying. |
| `skills-hub/hb-skills/hb-change-impact/SKILL.md` | Preserved concrete-delta, producer-conflict, full-population, authority, disposition, rollout and independent final-review contracts. Removed unmigrated producer controller and push hooks; retained local scanner and disclosed manual review and baseline coverage limits. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-change-impact/references/review-checklist.md` | Retained semantic review checklist; replaced source-specific role labels with generic agent role. |
| `skills-hub/hb-skills/hb-change-impact/scripts/discover-change-impact.mjs` | Retained explicit-path, shared-source and optional Decision affected-doc discovery. Removed internal feedback dependency, operational products and obsolete durable-path lists; include shared scripts, reject escaping changed paths, prevent outside symlink reads and expose missing baseline coverage. |
| `skills-hub/hb-skills/hb-change-impact/scripts/producer-conflict-audit.mjs` | Retained bounded two-stage producer comparison, batching, evidence/schema validation, input binding and owned sessions. Removed excluded planning/site/action routes, use current boundary contract, and protect main as well as master from optional producer push completion. Include existing shared script and workflow code as comparison evidence, excluding tests/fixtures. |
| `skills-hub/hb-skills/hb-create-feature-doc/SKILL.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored exact-search-first grounding plan, neighboring tests/entrypoints, auditable unsuccessful searches and stable-output boundary. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-create-feature-doc/references/feature-knowledge-doc-template.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored platform consideration prompts as a detailed neutral table rather than a summary paragraph. |
| `skills-hub/hb-skills/hb-create-product-context/SKILL.md` | Retained source-first extraction, section coverage, selective follow-up, evidence and anti-fabrication contracts under neutral name; removed company transport, products, prescribed vendor lanes, automatic receipts and unmigrated gate/PR requirements. Use current surface and authorization. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-create-product-context/references/product-overview-template.md` | Preserved substantive section prompts and evidence checklist; neutralized company examples, dates and platform/service requirements. Clarified authored user intents are not research quotes and optional depth for small projects. |
| `skills-hub/hb-skills/hb-onboard/SKILL.md` | Retained sandbox isolation, real-contract validation, upstream-first teaching, grouped drafting, hands-on edits and honest completion. Replaced removed discipline/CK tracks with fictional small-project knowledge and changed-evidence exercise; no claim of complete T3 lifecycle coverage.; use explicit document-sandbox validator so repository root ownership does not invalidate the temporary lesson |
| `skills-hub/hb-skills/hb-resolve-artifact-write/SKILL.md` | Preserved six-step read-only boundary resolution, existing-target handling and guardrails; removed obsolete metadata, unmigrated gate profiles and excluded authoring routes; linked current contracts and exposed unavailable automation. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-resolve-decision-impact/SKILL.md` | Retained stable Decision ownership, evidence, alternatives, contradiction/lineage review and narrow impact updates; removed discipline/planning/notification routes, private principles and unmigrated gate profiles; use dot dates and extracted local checks. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-resolve-decision-impact/references/resolution-actions.md` | Retained narrow status transitions; removed excluded authoring handoffs and notification assumptions; route through current operational owners and name blockers. |
| `skills-hub/hb-skills/hb-review-decision/SKILL.md` | Retained stable Decision ownership, evidence, alternatives, contradiction/lineage review and narrow impact updates; removed discipline/planning/notification routes, private principles and unmigrated gate profiles; use dot dates and extracted local checks. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-review-skill/SKILL.md` | Preserved semantic skill rubric, producer-conflict review, edit scope and evidence requirements; removed private principles, excluded evaluation references and nonexistent package validator; use current repository checks with explicit semantic limits. Reconnected restored shared review profile and source-lane owner. |
| `skills-hub/hb-skills/hb-semantic-project-audit/SKILL.md` | Retained original two-stage active-agent controller workflow, bounds, evidence rules, input freshness, advisory semantics and cleanup. Removed operational planning, private metadata, uninstalled CI/producer attestations and evaluation claims; adapted remote main and explicit host limitations. Updated delivery guidance to point to the implemented bounded hook and PR attestation checks; semantic review remains agent-owned. |
| `skills-hub/hb-skills/hb-semantic-project-audit/references/stage1-schema.json` | Retained portable bounded semantic controller, schemas, owned temporary sessions, schema/evidence validation, input binding and Git-tree isolation. Adapted default remote to main, renamed governance exclusion, removed dedicated operational-planning exclusions. No company or evaluation package dependencies. |
| `skills-hub/hb-skills/hb-semantic-project-audit/references/stage2-schema.json` | Retained portable bounded semantic controller, schemas, owned temporary sessions, schema/evidence validation, input binding and Git-tree isolation. Adapted default remote to main, renamed governance exclusion, removed dedicated operational-planning exclusions. No company or evaluation package dependencies. |
| `skills-hub/hb-skills/hb-semantic-project-audit/scripts/lib.mjs` | Retained portable bounded semantic controller, schemas, owned temporary sessions, schema/evidence validation, input binding and Git-tree isolation. Adapted default remote to main, removed source-name-specific governance exclusion, removed dedicated operational-planning exclusions. No company or evaluation package dependencies.; relation input accepts qualified active/shipped members as well as legacy active slugs; relation changes cover the complete qualified active/shipped corpus |
| `skills-hub/hb-skills/hb-semantic-project-audit/scripts/semantic-project-audit.mjs` | Retained portable bounded semantic controller, schemas, owned temporary sessions, schema/evidence validation, input binding and Git-tree isolation. Adapted default remote to main, renamed governance exclusion, removed dedicated operational-planning exclusions. No company or evaluation package dependencies. |
| `skills-hub/hb-skills/hb-start-project/SKILL.md` | Restored substantive portable guidance after preservation audit; renamed the Brain, removed private examples and explicitly excluded products, and separated agent guidance from installed automation. Restored capsule structure and corrected obsolete claim that overlap automation is unavailable. Reconnected restored shared review profile and source-lane owner. |

## Locally authored files

The remaining current paths have no claimed one-to-one source extraction. They include configuration, installers, current adapters/tests, synthetic onboarding inputs and migration records. Listing them prevents accidental claims that locally rewritten mechanics preserved an original contract byte-for-byte.

- `.github/workflows/validate.yml`
- `.gitignore`
- `.nvmrc`
- `governance/operations/agent-hooks.md`
- `governance/reference-architecture/how-brain-works.md`
- `package.json`
- `projects-in-progress/agentic-brain/README.md`
- `projects-in-progress/agentic-brain/extraction.json`
- `projects-in-progress/agentic-brain/scope.md`
- `projects-in-progress/agentic-brain/t2-mechanics.md`
- `projects-in-progress/agentic-brain/tasks.md`
- `scripts/__tests__/agent-hooks.test.mjs`
- `scripts/__tests__/change-impact.test.mjs`
- `scripts/__tests__/decisions.test.mjs`
- `scripts/__tests__/delivery.test.mjs`
- `scripts/__tests__/git-hooks.test.mjs`
- `scripts/__tests__/producer-conflict-audit.test.mjs`
- `scripts/__tests__/repository.test.mjs`
- `scripts/__tests__/skill-adoption.test.mjs`
- `scripts/delivery/check.mjs`
- `scripts/delivery/markdown-section.mjs`
- `scripts/githooks/pre-commit`
- `scripts/githooks/pre-push`
- `scripts/install-agent-hooks.mjs`
- `scripts/install-git-hooks.mjs`
- `scripts/validate_repo.mjs`
- `scripts/validate_surfaces.mjs`
- `skills-hub/hb-skills/hb-onboard/references/reading-list/knowledge.working.md`
- `skills-hub/hb-skills/hb-onboard/references/reading-list/source.md`

## Final review

The distinct post-edit review checked the restored operating population and its entrypoint/skill consumers, source hashes, false automation claims, local links/anchors, Markdown fences and test coverage. Repairs included a source split code fence, stale role/overlap claims, missing optional-runtime labels and an inherited metadata-enforcement claim. The final detector scanned 116 text files and returned 59 candidate consumers across the 64 changed paths. Entry and skill consumers were updated; runtime/test consumers retain their current implemented contract, with narrower missing enforcement listed above. The optional role selector is now gitignored. No PR was created; this correction is local and uncommitted. Full migration and publication remain pending.
