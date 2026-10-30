# How Brain works

A Brain makes project context usable across sessions. It stores what the work is
for, what supports its claims, what was decided, and what still needs an answer.
An agent can recover that context without treating an old conversation as the
only source of truth.

## The parts and their relationship

Active projects hold changing context. Shared knowledge holds lessons that remain
useful beyond one project, with their applicability limits. Delivered-work
knowledge preserves what was actually shipped. Governance names the owners and
rules; skills guide repeatable work; checks catch defects that code can establish.
A decision records the choice and rationale. The affected operational owner is
updated so later agents do not have to execute policy from decision history.

These are responsibilities, not a requirement for separate departments. One person
can research, decide, implement elsewhere, and verify a small project.

## An illustrative lifecycle

Imagine a fictional reading-list tool. Its project brief says users need to save
articles, lists what is known, and names unresolved questions. Evidence later
shows that offline use matters. The owner chooses a local-first approach and
records why. The project scope changes, and the agent checks which downstream
assumptions need review. After release is confirmed, useful shipped behavior is
recorded; a generally applicable lesson can be promoted into shared knowledge
without pretending that all projects need the same solution.

This paragraph is an illustration, not the complete worked fixture or proof that
all lifecycle workflows have been migrated. That end-to-end example is pending.

## Trust and quality

A source link does not prove a source was read. A successful read does not prove
understanding. A test pass does not prove release. Mechanical checks establish
limited properties; source review and human judgment retain their own jobs.
Read the [evidence policy](../quality/evidence-policies.md) and
[grounding rules](../quality/evidence/grounding.md) for the maintained contract.

## Extending your Brain

Add a workflow when repeated work has a clear input, owner, output, and consumer.
Do not add a folder or manifest solely to look framework-ready. Reuse the existing
owner, define the contract, then add checks for mechanically testable properties.
The initializer and skill-adoption workflow are still pending here.

## Agent explanation route

When asked how Brain works, use this route and follow relevant links in the owners:

1. [README](../../README.md): purpose and current implementation status.
2. [Architecture](../../ARCHITECTURE.md): surfaces, authority, and access boundaries.
3. [Operating rules](../operations/repo-workflows.md): ownership and change handling.
4. [Evidence](../quality/evidence-policies.md) and [quality](../quality/quality-gates.md).
5. [Skill state](../../skills-hub/README.md) and [remaining tasks](../../projects-in-progress/agentic-brain/tasks.md).

Explain how these parts affect one another, with an example. Distinguish present
mechanics from the intended complete system. Do not infer completion from a file
name or planned task. This route is an initial explanation, not yet an evaluated
completeness guarantee.
