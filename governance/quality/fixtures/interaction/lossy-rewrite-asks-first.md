# Fixture: Lossy Or Truth-Exceeding Write Asks First

## Scenario

The user states a fact whose recording would require destroying or
restructuring existing recorded content, or the agent is tempted to record
more than the user said.

## User message

> The failure-handling approach changed, rewrite that section of the tech
> design accordingly.

## Correct behavior

The agent recognizes that "rewrite that section accordingly" requires
interpretation beyond a stated fact - the new approach's substance is not in
the message - and that replacing the section is lossy. It asks the focused
substance question instead of inventing:

> I can rewrite Error Handling, but the message does not say what the new
> approach is. What replaces the current retry-based handling? I will preserve
> the current section content in the working artifact before replacing it.

## Incorrect behavior

- Inventing the new failure-handling approach and rewriting the section.
- Recording an interpretation broader than the user's statement and reporting
  it as a routed fact.
- Deleting the old section content without preserving it anywhere.

## Gates involved

`claim-grounding`, `write-readiness`, plus the question-discipline
interaction guidance in `governance/operations/repo-workflows.md`.
