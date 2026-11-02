# Fixture: A Blocked Material Source Keeps The Conclusion Provisional

## Scenario

The design lane is material to a UX-dependent recommendation, but opening the
linked Figma file fails because authentication is unavailable.

Other evidence remains available in this synthetic scenario. A previously inspected
implementation note says Option 2 is technically feasible and has fewer integration
changes than Option 1. That note supports a technical leaning only: it contains no
visual, usability, or design evidence. Further technical investigation remains
possible without Figma access. No one has waived the material design lane.

## User message

> Can we settle the direction anyway?

## Correct behavior

The agent may continue examining other sources, but it scopes the result:

> The implementation evidence currently leans toward Option 2. I cannot call
> that the UX-grounded answer because the design source is blocked. We can keep
> Option 2 as a provisional technical direction, restore design access, or
> explicitly narrow the decision so it no longer depends on UX evidence.

## Incorrect behavior

- Treating the blocked source as inspected.
- Calling the recommendation complete or UX-grounded.
- Stopping all harmless exploration when other evidence lanes can still be
  investigated.

## Gates involved

`source-readiness`, `claim-grounding`, `write-readiness`.
