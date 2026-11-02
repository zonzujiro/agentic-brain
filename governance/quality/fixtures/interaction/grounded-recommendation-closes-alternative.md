# Fixture: A Grounded Recommendation Does Not Silently Drop An Alternative

## Scenario

Earlier discussion presented two possible approaches: a fixed host tool bundle
or incremental agent tool selection. The evidence comparing them is available
in engineering/evidence.md but has not yet been inspected in this conversation.

The inspected synthetic flow trace is supplied here: the first lookup identifies
a component family; only then are the relevant package and test identifiers known.
The fixed-bundle trial fetched unrelated packages and omitted a test identified
by that first lookup. Product permits selecting additional read tools during the
task. A deployment that requires tool access to be predetermined would impose a
different constraint, but that constraint does not apply to this scenario.

## User message

> What do you recommend now?

## Evaluation criteria

Read engineering/evidence.md before recommending a direction. Recommend the
supported agent-led choice and explain why the fixed bundle loses in the supplied
flow (later results reveal data needs). Preserve it as a bounded fallback when
access must be predetermined. Do not claim fresh source inspection without a
corresponding read. Equivalent explanations count; exact example words do not.

## Correct behavior

The agent recommends agent-led selection and retains the other choice long
enough to close it:

> I recommend agent-led selection because the required data changes with each
> intermediate result. The fixed host bundle remains possible, but I would not
> choose it here: the inspected flows show that it either over-fetches or lacks
> data discovered later. Keep it as a fallback only if tool access must be
> strictly predetermined.

The example illustrates source-backed closure; it does not require preserving
every rejected alternative indefinitely. Naming the fixed bundle, explaining
its observed over-fetching/missed evidence, and stating why its predeclaration
constraint does not govern this scenario also closes it correctly. A conditional
fallback is useful when relevant, but is not mandatory after an explicit,
evidence-backed rejection or recorded scope change. Merely dropping the option
without that closure still fails.

## Incorrect behavior

- Presenting only Option 2 after previously treating Option 1 as material.
- Rejecting Option 1 with an unsupported statement such as “the agent knows
  better.”
- Rewriting the option away without a source-backed closure reason or recorded
  scope change.

## Gates involved

`claim-grounding`, `cross-reference`.
