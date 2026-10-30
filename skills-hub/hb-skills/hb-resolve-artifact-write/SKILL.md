---
name: hb-resolve-artifact-write
description: |
  Resolve the Agentic Brain artifact write boundary before creating, moving, or
  materially updating repo artifacts. This skill does not write files.
---

# Resolve Artifact Write

Use this skill before creating, moving, or materially updating an Agentic Brain
artifact when the owning workflow has not already produced an explicit write
boundary resolution.

This skill resolves repo mechanics. It does not write final artifacts, replace
the owning authoring skill, or prove content quality.

## Inputs

The user or parent workflow should provide as much as is known:

- intended artifact or change
- target project, governance scope, skill, doc, or surface
- proposed path, if any
- whether the output is working, provisional, or canonical
- owning workflow or skill, if already known

If required intent is missing, ask only the smallest question needed to resolve
the write boundary.

## Quality Gates

Use the shared gates in `governance/quality/quality-gates.md` and the evidence policy in
`governance/quality/evidence-policies.md`.

Required evidence: root instructions, the [write-boundary contract](../../../governance/artifacts/artifact-write-boundary.md), operating rules, the target surface README, and an owning workflow contract when one exists. Use current contracts and validators for operational rules. Decisions supply rationale and lineage; a proposal is not an adopted rule.

Read the required local sources before returning a boundary result. External
sources are conditional on a claim that needs them; connector access is not
required to resolve a local path. Record unavailable required sources and leave
the affected result unresolved. No automated access telemetry is installed.

Return the result in chat or the parent workflow's working record. Wrong targets,
unowned shapes, and unresolved authority cannot be waived by calling the content
provisional. Current checks do not enforce this workflow automatically.

## Flow

### 1. Classify the intended artifact

Name the artifact type before choosing a path.

Examples:

- shipped-feature knowledge
- Knowledge Hub product reference
- decision record
- quality-gate guidance
- skill helper script
- skill reference

If the artifact type is unclear, ask the user which outcome they intend rather
than guessing from the filename alone.

### 2. Resolve the owning surface

Use `governance/operations/repo-workflows.md` and `governance/artifacts/artifact-write-boundary.md`.

Do not infer a new surface from a convenient local folder. If no surface owns
the artifact type, use [change-impact review](../hb-change-impact/SKILL.md) and the operating rules.

### 3. Resolve target path and maturity state

Return:

- target path
- maturity state: `working`, `provisional`, or `canonical`
- canonical target when the artifact is a `*.working.md` document
- owning workflow or skill

Working document rules:

- document-like non-canonical work uses `*.working.md`
- the canonical target is derived by removing `.working`
- the unsuffixed canonical target must be valid for that surface

Provisional code or helper files:

- must live in a surface that already owns that artifact type
- do not use `*.working.md`
- do not write runnable code into documentation-only surfaces

### 4. Check existing artifacts

Check whether the exact target path exists.

Classify the result:

- create new target
- update existing target
- replace target
- rename/move target
- conflict or user decision needed

Run duplicate or overlap checks required by the current surface contract and
its validator. Decisions may explain the rule, but do not execute rules from
history. If the current contract has no such check, do not invent a fuzzy gate.

### 5. Name later gates

List the gates still required before the requested transition:

- source-grounded drafting
- working save
- provisional save
- canonical write
- finalization
- PR readiness

Do not say content is ready just because the path is valid.

### 6. Return the boundary result

Use this shape:

```md
## Artifact Write Boundary

- Artifact type:
- Owning surface:
- Target path:
- Maturity state:
- Owning workflow or skill:
- Existing-artifact handling:
- Later gates:
- Result: proceed / repair target / ask user / run change impact
```

When the result is `repair target`, the agent should repair before notifying
the user unless the intent is ambiguous.

When the result is `ask user`, present the smallest concrete choice, such as:

- update existing artifact
- create a new distinct artifact
- rename/disambiguate
- keep as working/provisional
- defer until change impact resolves the missing rule

## Guardrails

- Do not write, move, rename, or delete files from this skill.
- Do not replace the owning authoring workflow. If it has not been migrated,
  report that gap rather than invoking a nonexistent skill.
- Do not treat a valid path as proof that claims are grounded.
- Do not turn agent-repairable placement mistakes into user homework.
- Do not create a new folder, artifact type, maturity state, or duplicate rule
  by example.
