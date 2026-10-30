---
name: hb-start-project
description: |
  Canonical source-repo Agentic Brain initializer for a feature, problem,
  investigation, or initiative under projects-in-progress. Resolves identity,
  overlap, metadata, the initial semantic capsule, solution framing, and the
  first Markdown project brief.
---


# Start Project

Initialize or repair one active Agentic Brain project without depending on a
Creator Kit bootstrap skill.

## Use this skill when

- starting a feature, problem, investigation, or initiative;
- an existing project has only part of its required starting surface; or
- resolving project identity and metadata before another canonical writer runs.

This skill is idempotent. Preserve authored content and add only missing or
explicitly approved information.

## Evidence and ownership

Read current quality gates, evidence policy, active-project README and the
artifact-write boundary. Required evidence is the actual project request and
existing local project context. Domain sources and implementation evidence are
conditional on the claims made. External accounts are not a prerequisite.
Run change-impact review only when introducing a durable cross-project rule.

## Flow

### 1. Resolve identity

Accept a kebab-case slug and describe whether the work is a feature, problem,
investigation or initiative. Search active and delivered project names, purposes,
boundaries and references before creating a folder. Read a possible match; similar
names alone do not establish duplication. If the same work already exists, propose
continuing there rather than silently creating a competitor.

### 2. Establish the smallest useful context

Read the existing README and brief when present. Ground purpose, intended users,
expected outcome, scope, dependencies and constraints in the request and available
sources. Attribute user-owned choices. Do not invent owners, domains, dates,
notification routes or release state. No team registry or notification metadata
is required. The README is a semantic overview, not a file inventory.

### 3. Challenge a solution-shaped request

Separate the desired outcome from the proposed mechanism. Inspect relevant current
capabilities and compare reuse, configuration, a smaller workflow change or new
implementation when each is a credible alternative. Present material tradeoffs
before committing to a solution. If evidence is insufficient, preserve the choice
as open; a useful project brief can exist before the implementation is selected.
Do not invent alternatives simply to fill a section.

### 4. Prepare the minimal project

Use `projects-in-progress/{project}/README.md` for purpose, scope and
responsibilities, boundaries and dependencies, supported context and open questions.
Add `artifacts/project-brief-{project}.md` when the full background, users,
constraints, evidence, assumptions and unresolved questions need more room.
A short project may keep that substance in its README until a separate brief
helps. Use claim-level source links or contextual footnotes from the grounding
standard. Do not introduce a mandatory metadata schema or empty directories.

Create a project-local AGENTS.md only for real local instructions that add to the
root; do not repeat the root rules. Decisions and other documents appear when
there is real content. Do not create operational planning products or generated
indexes. Same-repository application placement remains an explicit setup choice;
starting context does not authorize adding an implementation surface.

### 5. Check overlap and preserve existing work

Compare the proposed purpose and boundary against actual nearby project content.
There is no automatic overlap gate installed yet. Report the searched area and
any ambiguity; do not describe a name search as semantic proof of uniqueness.
For a repair, show the changed fields and preserve unrelated authored content.
For a complete existing project, do not recreate it or refresh dates unnecessarily.
Use the current request's authorization for the resolved start or repair. Ask only
when identity, loss of existing content, authority or a material choice is unresolved.

### 6. Validate and hand off

Read the result as a returning agent: can it recover purpose, owner when known,
scope, source support, unknowns and the next useful action without chat history?
Run `npm test` and `npm run check`; these do not certify semantic uniqueness.
Report exact files and gaps. Offer decision authoring or source-grounded context
work as appropriate. Do not turn this into a mandatory multi-role process.
Commit or push only within authorization; each PR creation needs explicit approval.
