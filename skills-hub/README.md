# Reusable workflows

Canonical source lives under `hb-skills/{skill}/`. Repository-local Codex links
under `.agents/skills/` point to those sources without duplicating instructions.
Resolve repository paths from this checkout; bundled reference paths are relative
to their skill. Copying a skill alone omits its governance dependencies.

## Adapted workflows

| Workflow | Responsibility |
|---|---|
| [Bootstrap](hb-skills/hb-bootstrap/SKILL.md) | Check runtime and local readiness; optional Git checks |
| [Start project](hb-skills/hb-start-project/SKILL.md) | Minimal project context and idempotent repair |
| [Onboard](hb-skills/hb-onboard/SKILL.md) | Hands-on fictional exercise in temporary storage |
| [Resolve artifact write](hb-skills/hb-resolve-artifact-write/SKILL.md) | Read-only owner, path and readiness resolution |
| [Change impact](hb-skills/hb-change-impact/SKILL.md) | Candidate discovery, producer conflicts and consumer review |
| [Record decision](hb-skills/hb-add-decision/SKILL.md) | Stable choice, evidence, rationale and lineage |
| [Review decision](hb-skills/hb-review-decision/SKILL.md) | Read-only challenge of choice and consequences |
| [Resolve decision impact](hb-skills/hb-resolve-decision-impact/SKILL.md) | Reviewed downstream entries and their operational owners |
| [Write shared knowledge](hb-skills/hb-add-knowledge-hub-doc/SKILL.md) | One general reusable reference |
| [Create product context](hb-skills/hb-create-product-context/SKILL.md) | Specialized product overview, not a second general writer |
| [Create feature knowledge](hb-skills/hb-create-feature-doc/SKILL.md) | Confirmed delivered behavior and its limitations |
| [Archive project](hb-skills/hb-archive-project/SKILL.md) | Preserve one delivered project, then invoke feature writer |
| [Adopt skill](hb-skills/hb-adopt-skill/SKILL.md) | Reviewed package adoption without silent installation |
| [Review skill](hb-skills/hb-review-skill/SKILL.md) | Triggers, dependencies, outputs and ownership review |
| [Semantic project audit](hb-skills/hb-semantic-project-audit/SKILL.md) | Bounded two-stage active/shipped comparison |

The two `hb-create-*` writers replace their source `hb-pm-create-*` names; no PM
role is required. Source paths and transformations remain in the extraction manifest.

## Mechanics and limits

Semantic and producer controllers construct bounded evidence, validate response
shape and citations, bind results to inputs, and clean their temporary sessions.
The active agent still judges meaning. No evaluation kit or paid CI model run is
required. Git checks are optional local working-tree checks, not agent tool hooks.

Codex CLI discovery of all fifteen skills and an explicit routing invocation were
verified on 30.10.2026. This does not establish universal host compatibility,
connector observation or automatic enforcement. See the
[mechanics inventory](../projects-in-progress/agentic-brain/t2-mechanics.md) and
[remaining tasks](../projects-in-progress/agentic-brain/tasks.md).
