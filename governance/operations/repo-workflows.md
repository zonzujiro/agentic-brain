# Operating rules

## Route work by its owner

Before writing, identify the artifact, its owner, its existing location, and its
consumer. Update an existing owner instead of adding a parallel source of truth.
Create only the directories needed for real content. Surface READMEs describe
the initial allowed contents; new durable shapes need an explicit proposal.

Repository evolution belongs in projects-in-progress/agentic-brain/. General
rules belong in governance/. Scripts implement mechanical behavior. Skills will
own repeatable workflows after their migration; none are active yet.

## Changes and authority

The accepted extraction scope authorizes adaptation within that boundary.
For a new durable rule or scope change, explain the problem, inspect affected
consumers, propose the change, and obtain the owner's approval before adopting it.
Do not turn an unimplemented proposal into an enforced requirement.

When a user supplies a fact they own and its document owner is unambiguous,
record it within the authorized scope. Preserve attribution when verification is
missing. Check whether the answer changes other documents; do not silently expand
scope to those consumers.

## Evidence and checks

Read the [evidence policy](../quality/evidence-policies.md) before source-grounded
work. Keep material gaps and conflicts visible. Run the applicable checks from
[quality gates](../quality/quality-gates.md). Mechanical success is not semantic
review or publication approval.

## Repository hygiene

Inspect status before edits. Preserve unrelated work. For source extraction, use
a pinned revision and record the copied paths and transformations. Update each
contract, its consumers, and its enforcement together. Review links after removing
an excluded capability. Do not rewrite source history or pull dirty checkouts.

Use DD.MM.YYYY for human-facing dates. Machine formats remain machine formats.
PR creation requires Ivan's explicit approval. Publishing this private repository
requires separate approval after licensing and content review.
