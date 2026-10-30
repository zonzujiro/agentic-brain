# Reusable workflows

Workflow source lives under `hb-skills/{skill}/`. Read a skill in this checkout
and resolve repository paths from this repository root. Copying a skill directory
alone does not carry its governance dependencies. No host discovery or hooks are
installed; this increment supports explicitly reading the workflow instructions.

## Adapted source

- [Resolve artifact write](hb-skills/hb-resolve-artifact-write/SKILL.md): read-only
  routing before a material write. Determines owner, path, maturity, existing-file
  handling, and remaining checks. It neither writes artifacts nor validates their
  truth. Its contract is [artifact write boundary](../governance/artifacts/artifact-write-boundary.md).

- [Change impact](hb-skills/hb-change-impact/SKILL.md): local explicit-reference
  discovery plus agent review of claims, owners, producers and affected consumers.
- [Review skill](hb-skills/hb-review-skill/SKILL.md): read-only semantic review of
  a skill's triggers, dependencies, outputs, ownership and hidden assumptions.
- [Write shared knowledge](hb-skills/hb-add-knowledge-hub-doc/SKILL.md): one
  supported reusable reference with applicability and freshness limits.

- [Record a decision](hb-skills/hb-add-decision/SKILL.md): one stable record of
  an open or chosen answer, its evidence, alternatives and lineage.
- [Review a decision](hb-skills/hb-review-decision/SKILL.md): distinct read-only
  review of the answer, support, contradictions and operational consequences.
- [Resolve decision impact](hb-skills/hb-resolve-decision-impact/SKILL.md): inspect
  confirmed downstream entries and update only those actually reviewed.

The other eight candidates remain pending. See the
[scope](../projects-in-progress/agentic-brain/scope.md) and
[tasks](../projects-in-progress/agentic-brain/tasks.md). Host integration and model
behavior evaluations remain separate work; a source file is not an installed hook.
