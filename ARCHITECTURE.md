# Architecture

Agentic Brain keeps developing project context, reusable knowledge, decisions,
and the rules for maintaining them in version control. It is being extracted
as an independent copy; Harmony Brain continues separately.

## Sources and authority

Brain owns its authored synthesis and governing instructions. Code owns runtime
behavior; a delivery system owns its ticket state; a design source owns its
maintained design. Access permission and authority are separate. A successful
read does not establish that an interpretation is true.

This initial repository contains context and its supporting mechanics. Whether
future users keep implementation in a separate repository or alongside their
Brain is an unresolved setup design choice, not an inherited prohibition on
personal projects. Do not move implementation into this repository by assumption.

## Surfaces

| Surface | Responsibility |
|---|---|
| governance/ | Operating rules, evidence, quality, and system explanation |
| projects-in-progress/ | Developing project context and decisions |
| knowledge-hub/ | Reusable knowledge with applicability and source support |
| production-features/ | Knowledge about delivered work |
| skills-hub/ | Fifteen workflows; Codex CLI discovery verified, other host behavior pending |
| scripts/ | Deterministic supporting mechanics and tests |

Rules have one maintained owner. Other documents link to that owner. Decisions
retain rationale and approval; operational behavior belongs in instructions,
contracts, templates, scripts, or configuration, not reconstructed history.

## Quality responsibilities

Mechanical checks detect structural defects. Agents review evidence, meaning,
contradictions, and downstream effects. Humans retain decision authority.
One layer cannot substitute for another.

Currently implemented: source-link and Decision checks, local change discovery,
bounded semantic/producer controllers, Codex skill discovery and optional Git
checks. The controllers validate inputs and response structure; the agent judges
claims and ownership. Agent lifecycle/tool hooks and automatic audit gates remain
unimplemented. Model evaluations remain a separate task. See the
[mechanics inventory](projects-in-progress/agentic-brain/t2-mechanics.md).

## External integrations

The proposed integration contract covers source identity, links, read coverage,
actions and approval, evidence, authority, and failures. It is a design input,
not a functioning adapter API. Real connectors and observable host events must
be investigated before adapters or enforcement claims are implemented. See the
[connector task](projects-in-progress/agentic-brain/tasks.md#t4-real-connector-investigation).
