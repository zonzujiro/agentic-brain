# Fixture: Tech-Design Authoring Returns An Option Set, Not A Questionnaire

## Scenario

A developer starts Technical RFC creation for a feature with a handoff and
Product Spec present. The runtime-topology slice is active and the evidence
supports more than one grounded shape. The selected project is
`projects-in-progress/eval-demo`. Its Product Spec at
`projects-in-progress/eval-demo/artifacts/product/product-spec-eval-demo.md`,
handoff at `projects-in-progress/eval-demo/artifacts/handoff/handoff-eval-demo.md`,
and bounded source excerpts at `projects-in-progress/eval-demo/engineering/evidence.md`
are available locally. These are synthetic
fixture sources; no external access is needed.

## User message

> I'm not sure how this should integrate - what do you need from me?

## Correct behavior

The agent completes the slice research first (entry-point inventory, API
declarations, source-of-truth candidates), then returns a researched option
set with a recommendation and a pressure-test:

> Based on the entry-point scan, two grounded topologies remain. Option A:
> extend entry point X, which already owns Y - smallest surface, but couples
> to X's lifecycle. Option B: declare a new API in layer Z - cleaner
> ownership, but creates a second consumer seam. I recommend A because only
> one consumer exists today. The strongest argument against A is the lifecycle
> coupling if phase 2 adds background execution. Which direction matches your
> intent?

## Incorrect behavior

- "Which entry points do you want? What monitoring do we need?" (raw
  questionnaire; recordable as a passive-authoring incident).
- Presenting one option with no statement of why no grounded alternative
  exists.
- Asking the user for substance the repo sources already contain.

## Gates involved

`source-readiness`, plus the question-discipline interaction guidance in
`governance/operations/repo-workflows.md`.

## Source fixtures

The `passive-authoring-option-set` entry in
[`inputs.json`](../../evals/interaction/inputs.json) owns the actual staged
project, evidence and writable paths. Do not maintain a second source snapshot
in this case description.
