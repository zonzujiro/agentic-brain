---
name: hb-archive-project
description: |
  Canonical source-repo Agentic Brain skill for archiving one shipped/live
  `projects-in-progress/{project}` folder into `production-features/`,
  preserving the project tree, and delegating `feature-knowledge.md` creation
  or update to `hb-create-feature-doc`. Use when the user says "archive
  project", "move project to production features", "archive
  projects-in-progress", or explicitly invokes `hb-archive-project`.
metadata: {"brain":{"ownership_class":"canonical-writer","user_invocation":"direct","governed_by":["governance/artifacts/artifact-writer-map.md","governance/skills/skill-metadata.md"],"gate_profile":"standard-authoring","artifacts":[{"id":"project-archive","role":"final-writer","paths":["production-features/{feature}/"]}]}}
---


# Archive Project

Use this source-repo skill at the end of a Agentic Brain feature workflow when
one active project is shipped/live and should leave `projects-in-progress/`.

This skill is an orchestrator. It owns lifecycle confirmation, target
resolution, the archive move, post-move validation, and the handoff to
`hb-create-feature-doc`. It does **not** duplicate the shipped-feature
knowledge template, source synthesis, or gates owned by `hb-create-feature-doc`.

## Use This Skill When

- you are working directly in this repo
- exactly one `projects-in-progress/{project}` folder should be archived
- the user can clearly confirm the feature or feature addition is shipped/live
- the archived project should become shipped-feature context under
  `production-features/`

Accepted trigger phrases include:

- `hb-archive-project`
- `archive project`
- `move project to production features`
- `archive projects-in-progress`

Do not use this skill for:

- batching multiple projects in one run
- active work that is not shipped/live
- deleting a project as cleanup without preserving it under `production-features/`
- writing or reshaping implementation code
- creating product-facing shipped knowledge without running
  `hb-create-feature-doc`

## Arguments

Expected inputs, supplied directly or resolved through questions:

- source project slug: `projects-in-progress/{project}`
- target production feature slug: `production-features/{feature}`
- target mode:
  - `new-feature`
  - `change-to-existing-feature`
- change slug when target mode is `change-to-existing-feature`
- explicit shipped/live confirmation from the user
- optional release, implementation PR, Jira, experiment, rollout, Figma, Drive,
  Slack, or other source links for the `hb-create-feature-doc` handoff

If more than one source project is requested, stop and ask the user to run this
skill once per project.

## Quality Gates

Use the shared gates in `governance/quality/quality-gates.md` and the evidence policy in
`governance/quality/evidence-policies.md`.

Run gates before:

- accepting shipped/live readiness for archive
- moving any folder out of `projects-in-progress/`
- creating a first-release production feature archive root
- creating a `changes/{change}/` packet under an existing production feature
- invoking `hb-create-feature-doc` as the shipped-knowledge writer
- claiming the archive is complete
- opening a PR

Evidence focus:

- root `AGENTS.md`
- `governance/operations/repo-workflows.md`
- `governance/artifacts/artifact-write-boundary.md`
- `governance/quality/evidence-policies.md`
- `governance/quality/quality-gates.md`
- `production-features/README.md`
- `projects-in-progress/README.md`
- source project `projects-in-progress/{project}/README.md`
- source project file inventory
- existing target `production-features/{feature}/README.md`, when present
- existing target `production-features/{feature}/feature-knowledge.md`, when
  present
- existing target `production-features/{feature}/changes/`, when present
- optional release, implementation, Jira, Figma, Drive, Slack, experiment, or
  rollout links supplied by the user
- `skills-hub/hb-skills/hb-create-feature-doc/SKILL.md` before the writer
  handoff

Report target:

- chat before the move
- chat after the move and after `hb-create-feature-doc` completes or blocks
- PR description when a PR is opened

Readiness requires a resolved source, nonconflicting destination, authorized
move and explicit shipped/live confirmation. Confirmation may come from the
owner without release links; preserve that attribution and do not describe it
as independently inspected deployment proof. Other unresolved questions do not
block preserving the archive unless they make the destination, delivery status
or move safety unclear. Keep material gaps visible for the knowledge writer.

## Artifact Write Boundary

Before moving or writing, resolve the artifact write boundary from
`governance/artifacts/artifact-write-boundary.md`.

Expected resolution for a first-release archive:

- Artifact type: shipped-feature archive packet plus shipped-feature knowledge
  handoff
- Owning surface: `production-features/{feature}/`
- Target path: `production-features/{feature}/`
- Maturity state: `canonical` archive evidence after successful move;
  `feature-knowledge.md` is canonical only after `hb-create-feature-doc`
  writes it
- Owning workflow or skill: `hb-archive-project` for the move;
  `hb-create-feature-doc` for `feature-knowledge.md`
- Existing-artifact handling: target feature folder must not already exist for
  `new-feature`; if it exists, route to existing-feature handling below
- Later gates: archive readiness, source/target grounding, boundary,
  move-readiness, delegated feature-knowledge gates, validation, and PR
  readiness

Expected resolution for an addition to an existing production feature:

- Artifact type: production-feature change archive packet plus shipped-feature
  knowledge handoff
- Owning surface: `production-features/{feature}/changes/{change}/`
- Target path: `production-features/{feature}/changes/{change}/`
- Maturity state: `canonical` archive evidence after successful move;
  `production-features/{feature}/feature-knowledge.md` is canonical only after
  `hb-create-feature-doc` writes it
- Owning workflow or skill: `hb-archive-project` for the move;
  `hb-create-feature-doc` for `feature-knowledge.md`
- Existing-artifact handling: exact change target must not already exist;
  conflicts require user choice before moving
- Later gates: archive readiness, source/target grounding, boundary,
  move-readiness, delegated feature-knowledge gates, validation, and PR
  readiness

## Evidence

Record inspected source areas, the pre-move inventory and material gaps in
chat or the existing working record. Follow `governance/quality/evidence/access-records.md` and report coverage gaps.
An inventory proves preserved files, not the truth of their historical contents.

## Flow

### 1. Read governing sources

Follow root instructions and current operating rules. No separate role is required.

Read:

- root `AGENTS.md`
- `governance/operations/repo-workflows.md`
- `governance/artifacts/artifact-write-boundary.md`
- `governance/quality/evidence-policies.md`
- `governance/quality/quality-gates.md`
- `production-features/README.md`
- `projects-in-progress/README.md`

### 2. Parse and validate one source project

Resolve `projects-in-progress/{project}/`.

Stop if:

- the source project folder does not exist
- the source path is outside `projects-in-progress/`
- more than one project is requested
- the source project has no `README.md`, unless the user explicitly confirms the
  project folder is still the intended archive source and the missing README is
  preserved as a gap

Record a compact source inventory before moving, for example:

```bash
rg --files --hidden projects-in-progress/{project}
```

Include ignored files and symlinks in the safety inspection separately; never
follow an outside target silently. Record content hashes when needed to detect
loss, and inspect untracked local work before planning the move.

Use the inventory later to verify that the moved archive preserved expected
files and folders.

### 3. Confirm shipped/live status

Ask for explicit confirmation that the feature or change is shipped/live unless
the user already gave a clear confirmation in the current request.

Accept confirmation-only readiness when that is the user's choice, but record
missing implementation or release evidence as a gap. Do not infer shipped
runtime behavior from the folder move.

If the user cannot confirm shipped/live, stop before moving.

### 4. Resolve the target mode and path

Resolve the target production feature slug.

For a new production feature:

```text
production-features/{feature}/
```

For a change to an existing production feature:

```text
production-features/{feature}/changes/{change}/
```

If `production-features/{feature}/` already exists, do not silently rename the
target and do not overwrite the existing root. Warn that the target exists and
ask the user to choose one of these explicit outcomes:

1. archive as a change packet under
   `production-features/{feature}/changes/{change}/`
2. choose a different production feature slug only after confirming the work is
   genuinely a separate shipped feature
3. stop before moving

If the exact destination path already exists, stop and ask for a different
change slug or target. Never merge two project folders by copying one over the
other.

### 5. Read target context for collision and writer handoff

When present, read:

- `production-features/{feature}/README.md`
- `production-features/{feature}/feature-knowledge.md`
- existing entries under `production-features/{feature}/changes/`

If an existing production feature only has `README.md`, the archive can still
continue. The later `hb-create-feature-doc` handoff should create
`feature-knowledge.md` from the legacy README, the moved archive packet, and any
other inspected sources.

Before presenting the move plan, use `hb-change-impact` to find exact path
references, shared source identifiers, and Decision `affected_docs` entries
that may need updates after the move. Use the exact `changes/{change}`
destination for an existing-feature change. Include every verified affected
artifact in the move plan; never create an alias or rewrite references without
showing the affected owners.

### 6. Present the move plan before editing

Before moving files, show the user a concise plan:

- source path
- destination path
- target mode
- shipped/live confirmation status
- known missing evidence or unresolved project/phase/decision gaps
- whether `feature-knowledge.md` already exists
- what `hb-create-feature-doc` will be asked to do after the move
- validation commands that will run
- incoming context pointers that would break and the explicit consumer edits
  proposed for them

Proceed when the current request already authorizes the concrete resolved move,
or after the owner resolves any newly discovered ambiguity or material impact.
Do not repeat an approval that already covers the displayed source, destination
and consumer edits.

### 7. Move the project archive

Prefer `git mv` when possible so history remains readable. If `git mv` cannot
move the full folder safely, use `mv` and verify the result.

For a new feature:

```bash
git mv projects-in-progress/{project} production-features/{feature}
```

For a change to an existing feature:

```bash
mkdir -p production-features/{feature}/changes
git mv projects-in-progress/{project} production-features/{feature}/changes/{change}
```

Preserve the internal structure exactly. Keep the moved project `README.md`
as-is. Do not create project-local helper files that were not present in the
source project.

Apply only the consumer pointer edits approved in the move plan, replacing the
old active owner path with the real final production path. Do not infer broader
relationship changes, add backlinks, or invent a relationship registry.

### 8. Invoke `hb-create-feature-doc`

After the move, load and follow:

```text
skills-hub/hb-skills/hb-create-feature-doc/SKILL.md
```

Run it against the final `production-features/{feature}/` target so it can use
the preserved archive contents as local sources.

For a change packet, tell the writer which packet was just moved:

```text
production-features/{feature}/changes/{change}/
```

If `hb-create-feature-doc` completes, verify that
`production-features/{feature}/feature-knowledge.md` exists.

Tell the delegated writer to treat moved engineering, phase, or implementation
notes as historical source context. They may ground stable shipped behavior, but
must not be promoted into `feature-knowledge.md` as a current implementation
report, API inventory, runtime-state dump, or coverage snapshot.

If `hb-create-feature-doc` blocks because of missing sources, failed gates,
or missing user approval, leave the moved archive in place, report the archive
as incomplete, and still run Step 9 to validate the completed move. Stop the
knowledge-writing step, not preservation and link checks; do not claim full success. Do not create a placeholder
`feature-knowledge.md` from this skill, and do not ask the delegated writer to
invent unsupported shipped-feature content just to complete the archive.

### 9. Validate after the move

Run validation that matches the changed surface:

```bash
test ! -e projects-in-progress/{project}
test -d production-features/{feature}
# or, for a change packet:
test -d production-features/{feature}/changes/{change}
git diff --check
node scripts/validate_repo.mjs
```

Also verify from the pre-move inventory that expected files are present under
the destination path.

When moving Decision records, validate the retained lineage across active and
archived scopes. Run `node scripts/validate_decisions.mjs` and the catalog for
the final archive scope, plus `npm test` and `npm run check`. Resolve incoming
links and relative source links against their new locations without changing the
historical claims. Missing target repairs must remain within the approved move.

When `hb-create-feature-doc` completed, verify:

```bash
test -f production-features/{feature}/feature-knowledge.md
```

### 10. Report result

Report one of these states:

- `archive complete` — move validated and `feature-knowledge.md` was created or
  updated successfully
- `archive moved, knowledge blocked` — move validated, but
  `hb-create-feature-doc` blocked; include the blocker and next action
  without creating a placeholder `feature-knowledge.md`
- `archive blocked before move` — no move happened; include the required user
  choice, missing confirmation, or collision
- `archive validation failed` — move or validation failed; include the exact
  failed check and repair path

Include:

- source path
- destination path
- target mode
- shipped/live confirmation source
- visible evidence gaps
- unresolved decisions/phases carried forward, when material
- validation commands and results
- whether a PR is needed

For `archive moved, knowledge blocked`, also include a blocked handoff summary:

- writer skill invoked or inspected
- moved archive packet path offered to the writer
- source lanes available from the moved archive
- missing evidence lanes that prevented an honest `feature-knowledge.md`
- failed gate, missing approval, or missing source that stopped the writer
- next required user action or source package needed to resume

## Delivery

Commit and push only within authorization. Each PR creation needs Ivan's explicit
approval. Report the archive state and any blocked knowledge handoff honestly.
Do not send notifications, post comments or mutate external systems as part of
archiving. No inherited PR template or publication system is required.

## Guardrails

- archive exactly one project per run
- do not archive without clear shipped/live confirmation
- do not treat confirmation-only shipped/live status as inspected release
  evidence
- do not silently rename when `production-features/{feature}/` already exists
- do not overwrite or merge into an existing destination folder
- do not reshape the moved project tree or rewrite its `README.md`
- do not silently rewrite cross-project references found during impact review
- do not create or update `feature-knowledge.md` directly from this skill;
  delegate to `hb-create-feature-doc`
- do not move the archive back automatically if feature-knowledge generation is
  blocked after a successful move
- do not claim success until post-move validation passes and the knowledge
  handoff state is explicit
- do not send stakeholder notifications as part of archive success
- if the requested run would change skill behavior, storage paths, validation
  rules, artifact shape, or source-of-truth boundaries, run `/hb-change-impact`
  before implementation


## Shared review profile

Use `governance/quality/gates/gate-profiles.md`: `standard-authoring`.
Use `governance/quality/evidence/source-lanes.md`: Production Feature Knowledge.
Apply these agent review procedures at this skill's existing write/finalization
transitions; preserve its local halt and waiver rules. The current structural
validator does not enforce these declarations. Report material findings in chat
and, when authorized, relevant PR evidence. A read-only helper stays read-only.
