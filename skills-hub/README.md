# 🧰 Skills Hub

Canonical source lives under `hb-skills/{skill}/`. Repository-local Codex and Claude links
under `.agents/skills/` and `.claude/skills/` point to those sources without duplicating instructions.
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

## Structural checks and adoption

`npm run check` checks skill names/descriptions, matching folder names, duplicate
or unsupported metadata keys, regular package files and relative Codex discovery
links. Optional supported metadata is preserved; the parser accepts block fields,
not arbitrary YAML. It does not prove dependency availability or workflow quality.
Canonical packages live directly under `hb-skills/`; discovery entries must point
there and stale entries fail validation. Package symlinks are rejected.

The adoption helper previews one reviewed package and requires that preview's
digest to copy it. It never overwrites packages or discovery entries. `--link` is
an explicit optional installation action. Review source ownership, dependencies,
content and output conflicts before applying; the digest proves unchanged bytes,
not semantic approval or distribution rights.

Local lifecycle and delivery hooks now have shared rule implementations and
repository configuration. Their live host activation still requires user trust
and actual event trials; see [the host contract](../governance/operations/agent-hooks.md).

## ✨ Bringing a skill

Start with a source package and its intended responsibility. Use `hb-adopt-skill`
to review the package, dependencies, output ownership and conflicts before copying
it. Review its preview and explicit transformations; preserve compatible metadata
and substantive instructions. Do not silently shorten its workflow or rename
upstream-owned content. PR creation remains a separate explicit approval.

## 📏 Package convention

Each package has its own directory and a `SKILL.md` entrypoint. Optional
`scripts/`, `references/` and `assets/` remain beside the package. Instructions
should name the actual triggers, inputs, outputs, evidence, ownership, halt
conditions and validation. A helper script owns deterministic transformations;
the agent owns semantic judgment. A reference is read when its task needs it.

Keep host discovery separate from canonical authorship. An installed link does
not establish that all hosts loaded the package or that its runtime dependencies
are available. A renamed package must update its consumers and discovery links.
Do not overwrite existing package content during adoption.

## 🛠️ Review and extension

Use `hb-review-skill` for trigger fit, role boundaries, evidence, output ownership,
missing dependencies and collisions with other producers. Run change-impact
review for durable behavior changes and preserve a concrete outcome for every
affected consumer. Structural checks do not establish workflow quality.

The [ownership metadata reference](../governance/skills/skill-metadata.md)
preserves the original metadata model. Its validator migration is pending;
current packages must follow the actually supported parser and writer map.
The removed CK/BA/QA collections are excluded source packages, not a reason to
remove reusable adoption, review or evidence requirements.

## 🛟 Learning the workflow

Use [sandbox onboarding](../governance/onboarding/README.md) to practice. It must
let the user edit concrete examples, validate and repair them, and leave canonical
project data untouched. A static tour does not count as completing the exercise.
