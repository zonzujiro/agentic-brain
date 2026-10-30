---
name: hb-review-skill
description: |
  Repo-only Agentic Brain reviewer for semantic quality checks on skills-hub
  skills before or during review. Use when an author adds or changes
  a skill and wants Brain to inspect trigger fit, ownership boundaries,
  handoffs, artifact contracts, and hidden runtime assumptions.
---


# Review Skill

Use this repo-only skill to review one or more `skills-hub/` skill packages for
semantic quality.

This skill is a local authoring and review aid. It is not a CI validator and it
must not require Waza, Promptfoo, a local IDE extension, or paid model-backed
GitHub Actions checks. The current agent session performs the review using the
repo context it can read locally.

## Use This Skill When

- a Brain maintainer adds a new skill under
  `skills-hub/`
- an existing skill changes activation, workflow, artifacts, tools, scripts, or
  handoff behavior
- a reviewer wants a plain-language assessment before PR creation or PR review
- deterministic validation passes but the skill may still be too ambiguous,
  broad, narrow, or discipline-blurring

## Inputs

Required:

- target skill name or path

Optional:

- specific concern to focus on
- related discipline or workflow context
- whether suggested edits should be drafted after the review

If the target is missing, ask for the skill name or path directly.

## Quality Gates

Use the shared gates in `governance/quality/quality-gates.md` and the evidence policy in
`governance/quality/evidence-policies.md`.

Run gates before:

- approving a skill, package, validator, generated index, or skill-contract
  change
- saying a non-trivial skill change is ready for PR
- applying fixes after a semantic skill review

Evidence focus:

- root `AGENTS.md`
- `skills-hub/README.md`
- relevant local `AGENTS.md`, when present
- affected `SKILL.md`
- referenced local files, scripts, assets, and `agents/openai.yaml` when present
- generated indexes and validators when the change affects them
- related decision records
- `governance/quality/evidence-policies.md`
- `governance/quality/quality-gates.md`

Report target:

- chat as part of the review result
- PR description when a PR is opened

Waiver rule:

- Resolve owner approval, current contracts and impact before adopting durable
  skill behavior, validator, packaging or ownership changes. These are agent
  review steps, not installed named gate profiles.
- Deterministic validation failures block approval unless the failed check is
  explicitly out of scope and recorded as a visible gap.
- Package or contract contradictions block approval until the target skill or
  governing contract is changed.

## Evidence

Keep inspected source areas and material limitations in chat or the existing
working record. No evidence observer is installed. Never invent machine access
receipts. Decisions explain rationale and lineage; current operational contracts
own the rules being reviewed.

## Flow

### 1. Resolve the target skill

Resolve the target to one or more skill directories under `skills-hub/`.

Accept:

- an exact skill name such as `hb-review-decision`
- a relative path such as `skills-hub/hb-skills/hb-review-decision`
- a discipline folder path when the user wants a batch review

If several skills match, list the matches and ask which one to review unless the
user clearly requested batch review.

### 2. Gather local context

For each target skill, read:

- `SKILL.md`
- `agents/openai.yaml`, when present
- bundled scripts only enough to understand user-facing runtime assumptions
- referenced local files that are necessary to interpret the workflow

Also read nearby context when it materially helps:

- sibling skill names and frontmatter descriptions in the same discipline
- directly related extension skills
- related decision records for rationale, lineage, or contradiction checks

When the reviewed change is non-trivial and alters behavior, contracts,
packaging, validators, workflow order, repo surfaces, or document expectations,
also read the written source-of-truth docs for that surface before judging the
fix. Examples include:

- `skills-hub/README.md`
- bucket-level `skills-hub/*/AGENTS.md`
- surface README entrypoints
- related decision records for rationale, lineage, or contradiction checks

Keep the context bounded. Summarize sibling skills instead of loading every full
skill body unless a conflict needs exact evidence.

### 3. Run deterministic validation first

Run the current repository checks (they do not certify skill semantics or all
package dependencies):

```bash
npm test
npm run check
```

If the deterministic validator fails, report those failures first. Continue with
semantic review only when the failures do not prevent understanding the target
skill.

### 4. Review semantically

For every added or meaningfully changed skill, invoke the Producer Conflict
Review in `hb-change-impact` first. It examines what the skill will produce
against existing writers and artifacts. A skill that produces nothing still
gets a recorded `no` classification. If the review raises a conflict or
required evidence gap, include it as a blocking finding until the user or
relevant owner resolves it. Do not treat passing skill-package validation as
the answer to this semantic question.

Review the target skill against this rubric:

- **Context and contract provenance** - for non-trivial repo changes, the
  author identified the governing source files first and implemented the
  written repo contract rather than a local inferred rule.
- **End-state fit** - the change explains the intended long-lived system shape,
  not only the local patch.
- **Scope and rollout clarity** - the chosen scope explains why this is the
  right durable step now, including what remains if the change is intentionally
  partial.
- **Trigger precision** - the invocation guidance is neither too broad nor so
  narrow that natural user requests miss it.
- **Ownership boundary** - the skill stays inside its owning responsibility and
  hands off work that belongs elsewhere.
- **Handoff clarity** - downstream skills, artifacts, stopping points, and
  required user approvals are named explicitly.
- **Artifact contract** - produced files, expected locations, review gates, and
  validation evidence are clear enough for the next consumer.
- **Runtime assumptions** - scripts, tools, repositories, MCPs, browser access,
  credentials, and local paths are declared instead of hidden.
- **Contradiction and ambiguity** - instructions do not conflict with each
  other, and vague terms have enough operational meaning.
- **Cognitive load** - the skill is not overloaded with too many competing
  branches, priorities, or nested conditions for an agent to follow reliably.
- **Neighbor conflicts** - the skill does not duplicate or steal activation
  from nearby skills without explaining the boundary.
- **Non-technical author fit** - the review output and required fixes are
  explainable to discipline contributors who should not need to install local
  developer tooling.

Do not treat style preferences as findings unless they affect behavior,
ownership, validation, or author usability.

If the reviewed change is non-trivial and does not establish governing context,
current state, desired end state, and rollout reasoning, treat that as a
blocking finding.

### 5. Produce the review

Return concise structured output:

- `Blocking findings`
- `Advisory findings`
- `Questions`
- `Suggested edits`
- `Validation run`
- `Residual risk`

For each finding, include:

- severity
- exact file or section evidence
- why it matters
- a concrete fix direction

If no issues are found, say that clearly and list the validation command that
ran.

### 6. Editing policy

This skill reviews by default. Do not edit files unless the user explicitly asks
for fixes to be applied.

When applying fixes:

- keep edits scoped to the reviewed skill and directly required consumers
- avoid broad source-repo skill behavior, workflow contract, validation-rule,
  storage-path, source-of-truth, ownership-boundary, or
  artifact-standard changes unless `/hb-change-impact` has already
  covered them
- run `npm test` and `npm run check` after changes

## Guardrails

- do not require Waza, Promptfoo, VS Code, or any local install from a
  non-technical skill author
- do not propose paid model calls in GitHub Actions as the default validation
  path
- keep deterministic CI and local semantic review as separate responsibilities
- do not invent discipline ownership or downstream artifacts when the skill is
  unclear; report the ambiguity instead
- do not approve a skill that hides external runtime dependencies behind
  friendly prose
- do not approve non-trivial repo changes that skip the governing-context read
  pass or fail to explain the intended end state
- do not treat one local bug or one existing implementation as sufficient proof
  of repo convention when written contract docs exist
- do not treat a symptom patch as the full solution unless the review makes the
  temporary scope and remaining follow-up explicit
