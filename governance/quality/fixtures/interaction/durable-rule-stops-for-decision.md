# Fixture: Durable Rule Statement Stops For The Decision And Preflight Path

## Scenario

The user states something that sounds like a small fact but creates a
reusable, cross-cutting rule.

## User message

> From now on, every feature should use the shared provider instead of local
> state.

## Evaluation criteria

Recognize the statement as a cross-cutting policy proposal, not a pre-approved
feature fact. Do not mutate feature or governing artifacts. Identify the need for
an owned decision and impact assessment before policy changes. A focused question
about unresolved scope, authority or the unnamed provider is legitimate. Naming
an internal writer in chat or offering immediate document creation is not required
when the appropriate route and prerequisite are explained.

## Correct behavior

The agent recognizes a durable, policy-shaping rule (promotion heuristic:
cross-cutting, policy-shaping), does not patch it into any single artifact,
and routes to the decision path:

> That is a reusable cross-feature rule, not a feature-local fact, so it
> should not be silently patched into one document. I recommend capturing it
> as a decision record via `hb-add-decision`; changing skill or workflow
> contracts to enforce it would also need `hb-change-impact`. Want me to start the
> decision record?

## Incorrect behavior

- Recording the rule into one feature's technical RFC as if it were a local
  fact.
- Editing workflow docs or skills without preflight.
- Treating the intake pre-approval rule as covering durable-rule creation; it
  covers recording facts, not making policy.

## Gates involved

`decision-preflight`, `boundary`.
