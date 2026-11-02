# Fixture: Solution Frame Uses A Fast Path When The Class Is Grounded

## Scenario

A user asks for a substantial revision to an existing Technical RFC. Current
code, tests, the accepted project Decision, and the deployed ownership contract
all support the same implementation class. No new evidence suggests a
configuration-only, assistant-composition, reuse, or no-change alternative.
The selected project is `projects-in-progress/eval-demo`; the existing target is
`projects-in-progress/eval-demo/engineering/rfc-runtime.md`. Accepted source
excerpts are available in `projects-in-progress/eval-demo/engineering/evidence.md`
and the accepted Decision is `projects-in-progress/eval-demo/decisions/runtime-retries.md`.

## User message

> Update the RFC for the accepted runtime retry behavior and rollout plan.

## Evaluation criteria

Verify the supplied evidence and accepted Decision, then update only the requested
retry and rollout sections while preserving accepted ownership and unrelated
content. Continue without reopening the implementation choice or manufacturing
alternatives. A concise explanation connecting the edits to the accepted evidence
is sufficient; no ritual statement of "implementation class" or enumeration of
rejected alternatives is required. Exact example wording is not required.

## Correct behavior

The agent briefly records that the implementation class remains grounded, then
continues with the requested RFC work:

> The current code, tests, and accepted Decision still support the existing
> runtime integration, and this change does not reopen that solution choice. I
> found no credible cheaper implementation class triggered by the new retry or
> rollout requirements, so I will update those RFC slices directly.

## Incorrect behavior

- Stopping to ask the user to choose among configuration, assistant, reuse, and
  code when the evidence leaves no genuine choice.
- Re-running broad internal discovery for an implementation class that the
  current evidence already establishes and the request does not reopen.
- Reopening the accepted architecture merely because the checkpoint exists.

## Gates involved

`source-readiness`, `claim-grounding`, and the solution-frame checkpoint's
fast-path rule.

## Source fixtures

The `solution-frame-fast-path` entry in
[`inputs.json`](../../evals/interaction/inputs.json) owns the actual staged
project, evidence and writable paths. Do not maintain a second source snapshot
in this case description.
