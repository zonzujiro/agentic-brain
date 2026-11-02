# Reference Architecture

This section explains the architecture someone could reuse when creating their
own Brain inspired by Agentic Brain. It is an orientation layer, not a second
copy of the repository's operating rules.

## The reusable idea

A Brain is a version-controlled context system in which:

1. work is routed to an explicit owner instead of accumulated in one folder;
2. mutable working context is separated from implementation evidence;
3. important outputs expose their evidence, gaps, validation state, and next
   consumer;
4. reusable workflows know which artifacts they may read and write;
5. durable behavior changes carry rationale and approval without forcing agents
   to reconstruct the current rule from decision history.

Agentic Brain implements this with repository surfaces, governing contracts,
skills, validators, hooks, and scoped decisions. The canonical implementation
model lives in [Architecture](../../ARCHITECTURE.md); the product
intent lives in
[accepted scope](../../projects-in-progress/agentic-brain/scope.md).

## Start with human-readable owners

A Brain is not coherent if it omits any of these maintained entrypoints:

- a `README.md` that explains its purpose and where to begin;
- an `ARCHITECTURE.md` that states what the Brain owns and, for every external
  system, separates access permission from source authority;
- an `AGENTS.md` that routes agents through the applicable rules without
  becoming the only human-readable copy of those rules; and
- explicit governing instructions for artifact ownership, evidence, gaps, and
  freshness.

A machine-readable manifest may project or configure this contract when a real
initializer, validator, or upgrade workflow consumes it. It does not replace
the human entrypoints and should not exist only to make the repository appear
framework-ready.

## Separate access from authority

Access says what the Brain may do to a system. Authority says which facts that
system owns. Read-only access does not transfer authority to the Brain.

| System | Typical Brain access | The system remains authoritative for |
|---|---|---|
| Brain repository | Read and write through review | Brain-owned synthesis, accepted decisions, and shared knowledge |
| Implementation repository | Read-only | Code, APIs, tests, and runtime behavior |
| Delivery system | Read-only | Ticket status and assignment |
| Design or document source | Read-only | The product or design claims maintained there |

The Brain may own a supported interpretation, accepted decision, or next action
without silently claiming ownership of the underlying implementation, delivery,
or design fact.

## Make knowledge trustworthy

A document-level review date says when someone revisited the file; it does not
mean every independently changing claim was reverified. For each material
claim or reusable lesson, preserve:

- its support state, such as source-verified, user-confirmed, or a visible gap;
- a durable source locator;
- the date checked when freshness matters; and
- its applicability boundary or unresolved gaps.

Moving a lesson from active work into shared knowledge does not make it durable
or generally applicable by itself.

## Preserve useful contracts and add machinery deliberately

Start from the reviewed reusable operating model. Adapt vendor-specific routes
and excluded products without compressing the remaining contracts into summaries.
Add automation when its consumer and invariant are clear. A simpler deployment
does not require weaker guidance; optional depth can remain available to readers.

## Continue according to your goal

- To compare reusable capabilities, read [capabilities](capabilities.md).
- To understand the parts through a worked explanation, read
  [How Brain works](./how-brain-works.md).
- To operate this repository, leave this explanatory section and use
  [`../README.md`](../README.md).

## Boundary

These pages explain reusable principles and capabilities. They do not authorize
a new artifact shape, override an owning contract, or claim that a standalone
Brain framework already exists.
