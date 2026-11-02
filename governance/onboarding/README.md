# Agentic Brain Onboarding

This folder contains the repo-owned onboarding material for Agentic Brain.

The goal is simple:

- teach the real public Brain flows
- let the user practice inside an emulated sandbox
- apply the installed writer contract and available checks
- use mock data instead of canonical feature docs

One important framing note:

- the docs in this folder are training fixtures, not a real feature packet that
  Brain generated automatically
- in real work, each discipline enters Brain with real upstream context already
  available
- the fixture set exists only to make the flow safe and concrete during
  onboarding

## Walkthrough surface

Use `hb-onboard` for the installed fictional small-project exercise. It teaches
source-grounded context, user editing, visible gaps and a changed-evidence update
inside temporary storage. The original multi-discipline fixture set and the full
worked lifecycle have not been migrated; do not describe them as available.

Before editing, explain what context the selected workflow starts with, what the
user adds, and what its next consumer receives. A handoff file is an optional
index; evidence may come directly from the owning sources.

## Sandbox Practice Model

`hb-onboard` should not behave like a paginated document explanation.

Instead, it should:

- prepare fictional example material in a temporary sandbox
- feel like a teammate walking the user through the real flow, not a form
  wizard
- let the user edit or upload candidate content for the target doc
- apply those changes only inside the sandbox
- propose reasonable defaults for the main sections before asking for rewrites
- review the sandbox target against its actual writer and
  [shared standards](../artifacts/documentation-standards.md), then run the installed
  sandbox validator; do not claim absent specialized validators passed
- show pass/fail feedback and rerun until the sandbox doc is in good shape

## Guardrails

- Onboarding data is mock data only.
- Onboarding docs are examples, not canonical feature truth.
- The walkthrough must never write to real feature paths.
- The walkthrough must use a temporary sandbox copy rather than editing the
  fixture source tree in place.
- Existing authoring skills keep their real read/write behavior.
- If a user wants to work on a real feature, the walkthrough should hand off to
  the matching public skill instead of pretending to be the write flow.
