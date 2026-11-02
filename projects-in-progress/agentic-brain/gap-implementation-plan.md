# Gap implementation plan

Owner: Ivan. Approved implementation scope: conversation of 02.11.2026.
State: repository implementation and deterministic review complete on 02.11.2026.
Model acceptance and live host/connector verification remain blocked or unverified;
see [the review](gap-review.md).

## Sequence and acceptance

1. Restore writer-independent document/format/skill validation. Reuse reviewed
   source mechanics, remove excluded-product dependencies, test invalid and valid
   externally authored documents. Keep semantic/evidence/precedent review distinct
   from structural results.
2. Restore automatic evidence recording. Start from the source reader, session
   storage and observer, retain regression coverage, expose recording failures,
   and test real pinned Git reads. Never claim an unobserved source was read.
3. Restore checkout freshness, role propagation and host helpers. Preserve local
   configuration, exercise current/stale worktrees and selector copying, support
   Codex and Claude discovery and event configuration with explicit host limits.
4. Restore quality feedback and portable behavioral evaluation/onboarding assets.
   Keep source private incidents and excluded CK cases out. Run available model
   trials separately from deterministic checks and report any access blocker.
5. Review independently from the final diff: inspect affected operational owners,
   test failure modes, run npm test and npm run check, reconcile documentation,
   update provenance and record remaining external verification explicitly.

## Boundaries

Preserve the existing uncommitted restoration. Source Harmony Brain is read-only
at the recorded revision. No RFC authoring, BCA reconciliation or dedicated PR
follow-through. Source-discovery and changelog decisions remain open. No PR,
publication, connector writes or host trust changes are included.

## Rollout and rollback

Changes are local until reviewed. Host configurations require host-owned trust;
configuration presence is not execution evidence. Installers must preview and
preserve custom hooks. Restore previous configuration to disable a mount without
removing authored documents or evidence. Session records stay ignored and separate
from canonical knowledge. Keep unsupported connector observation visible.

## Acceptance result

Steps 1–4 have repository implementations and regression coverage. Step 5 completed
a distinct read-only review and repaired the findings listed in the review.
187 tests and repository checks pass. Model trials were attempted on both hosts
and remain blocked; no behavior pass or connector-wide coverage is claimed.
