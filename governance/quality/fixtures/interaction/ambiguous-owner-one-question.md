# Fixture: Ambiguous Owner Asks One Question With A Recommendation

## Scenario

The user states an accepted technical decision. There is no active Technical RFC
creation session, and the routing tie-breaks leave two plausible owners: a
project decision record and an applicable `engineering/rfc-{rfc-slug}.md`.
The project and existing RFC are already identified: `projects-in-progress/atlas`
and `projects-in-progress/atlas/engineering/rfc-monitoring.md`. The accepted
answer concerns this feature; no repository-wide monitoring policy was stated.

## User message

> We agreed monitoring stays in the accepted monitoring provider for this feature.

## Evaluation criteria

Ask one focused routing question that names the plausible Decision and RFC homes
and includes an evidence-consistent recommendation. Preserve both files until
the owner answers. Evaluate any recorded question tool call, not just the final
message. A harness-generated declined answer does not create an additional
requirement to repeat the question, guess ownership or perform the write.

## Correct behavior

The agent applies the tie-breaks, finds the route still ambiguous, and asks
one targeted question naming both candidates with a recommendation:

> This can be recorded as a project decision (reusable policy) or folded into
> the applicable Technical RFC's Monitoring section through its external authoring tool.
> Since it sounds feature-local, I recommend the RFC update. Which do
> you want?

## Incorrect behavior

- Asking "do you want me to update this file?" without naming candidates or a
  recommendation.
- Silently picking one target and writing it without surfacing the fork.
- Asking a multi-part questionnaire about monitoring details the sources
  already answer.

## Gates involved

`surface-routing`, plus the question-discipline interaction guidance in
`governance/operations/repo-workflows.md`.

## Source fixtures

### `projects-in-progress/atlas/engineering/rfc-monitoring.md`

```markdown
# Atlas Monitoring RFC

Synthetic existing RFC for this feature's monitoring integration.

### Monitoring

Provider selection is awaiting the accepted answer's recording route.
The proposal covers only Atlas; no repository-wide monitoring policy is set.
```
