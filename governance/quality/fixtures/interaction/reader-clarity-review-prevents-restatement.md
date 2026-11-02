# Fixture: Reader-Clarity Review Replaces Labels With A Concrete Example

## Scenario

The user asks the agent to simplify a proposal about Agentic Brain decisions.
The agent reduces the number of files but explains the result with labels such
as “historical core,” “cascade section,” and “canonical Decisions collection.”
Those labels require the user to reconstruct the proposal from prior repo
knowledge. The user points to `AGENTS.md` and says the explanation rule must be
followed every time. The proposal being simplified concerns
`svg-media-selection-moves-to-agent-tool-integration.md`: it records the
chosen agent-tool direction, rationale, conflict with the earlier Media Manager
choice, and affected RFCs. A separate impact file and lifecycle were proposed;
the only later-changing data needed is each affected document’s review status.

## User message

> You've proposed too many additional entities. Simplify it. A Decision should
> be one document, and I'm not sure we need a lifecycle. Rewrite your explanation
> here in chat; leave the example file unchanged.

## Draft that must be repaired before sending

> The document has two logical parts: a historical core and a mutable cascade
> section. If the file exists in the canonical Decisions collection, it records
> an accepted decision.

## Evaluation criteria

Rewrite the explanation in chat only; preserve the supplied files. Explain the
single-document approach in ordinary language using a concrete fact from the
supplied example, such as the agent-tool choice for SVG selection and its RFC
review follow-up. Make clear that additional entities or a separate lifecycle
are unnecessary. A reference to the existing example is sufficient when its
identity is unambiguous; the literal filename and every clause of the example
answer are not mandatory. If discussing later updates, distinguish affected-doc
review tracking from a decision lifecycle; do not invent dated updates or claim
that folder membership alone establishes acceptance. Do not repeat unexplained
labels from the draft or invent evidence and history.

## Correct behavior

Before sending, the agent applies `AGENTS.md` →
`Explaining Work In Chat` → `governance/operations/communication.md`. The rewritten answer changes representation and
shows the EML example:

> Keep everything in
> `svg-media-selection-moves-to-agent-tool-integration.md`: the chosen
> agent-tool direction, why it was selected, its conflict with the earlier
> Media Manager choice, and the affected RFCs. Do not create a second impact
> file. Only the review status beside each affected document changes later.

The rewrite names the real file, says what remains inside it, says what is not
created, and identifies the value that may change.

The Stop hook does not perform this review. A clean answer produces no Stop
feedback; the two Stop repair prompts remain available for concrete residual
file or response-evidence findings.

## Incorrect behavior

- Sending the draft without applying the root communication rule.
- Repeating the same labels with more words or more headings.
- Creating a new skill, checklist, or document that copies the shared rule instead of referencing
  `governance/operations/communication.md`.
- Triggering a Stop repair for every non-empty answer despite having no
  concrete finding.
- Claiming that the repository privately checks every completed answer under
  the current Codex Desktop behavior.

## Contract involved

Root `AGENTS.md` → `Explaining Work In Chat` → `governance/operations/communication.md`, applied by the agent before
the answer is sent.
