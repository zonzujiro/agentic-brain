# Fixture: Reading A Design Does Not Make It Decide An Architecture Question

## Scenario

The agent opens the current Figma flow. It shows the user interaction but does
not say whether the host or the agent should choose and call supporting tools.

## User message

> Does the UX prove that Option 2 is correct?

## Correct behavior

The agent separates access from support:

> I checked the current flow. It shows what the user sees, but it does not show
> which component should choose the tools. So it does not decide between
> Options 1 and 2. We need architecture or implementation evidence for that.

## Incorrect behavior

- Treating a successful Figma read as support for an architecture choice the
  design does not discuss.
- Calling the recommendation cross-checked merely because two sources were
  opened.

## Gates involved

`claim-grounding`, `cross-reference`.
