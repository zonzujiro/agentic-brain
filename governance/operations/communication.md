# Communication and explanatory writing

This page owns the shared communication principles for Agentic Brain chat and
Brain-authored explanatory prose: reasons, decision rationales, status updates,
PR descriptions, handoffs, reports, and other document explanations. Apply them
to new or deliberately updated text, not as a trigger for retrospective cleanup.

Artifact templates, required sections, evidence rules, and structured data
contracts still govern their respective outputs. This guidance does not remove
required detail, change machine-readable fields, rewrite vendored text, or turn
formal documents into chat. A fact lookup or simple status can be complete
without a causal explanation; explain why when the reader needs a rationale.

The purpose of an explanation is to leave the user with a useful understanding,
not to transfer all information the agent collected. Organize the response around
what the user needs to understand, decide, or do - never around the order in which
sources were searched, commands were run, or facts were discovered.

## Start With The General Picture

Begin in plain English with the answer, what it means, and why it matters. The
opening should stand on its own: a reader who stops there should still understand
the outcome, the important consequence, and any decision or action that belongs
to them.

When the subject is complex, first give the smallest useful mental model. Name
the main parts, how they affect one another, and the concrete result someone can
picture. Prefer a familiar comparison, worked example, or small diagram when it
explains the relationship more clearly than abstract prose. Tie an analogy back
to the real file, value, or behavior so it clarifies the explanation rather than
replacing its concrete referent.

Do not begin with file names, commands, identifiers, framework names, gate names,
or other implementation vocabulary. Those can support an explanation, but they
are not the explanation.

## Use Plain English

Use ordinary, direct words and short sentences. Prefer the words a person would
use to describe the outcome over the labels used by the repository or code.

For every term in a sentence, ask whether the reader can resolve it from what is
in front of them. A term they must look up, or reconstruct from memory of this
repo, explains nothing on its own - it is an index entry.

When a technical term is necessary:

1. explain the idea in ordinary language first;
2. introduce the technical name only if it helps the reader continue the work;
3. define it where it appears instead of requiring the reader to look it up.

Do not stack unexplained nouns or acronyms. A sentence can be technically correct
and still explain nothing when the reader must already know what every term
refers to. Supply the referent: show the real value, behavior, path, or consequence
in play.

Plain English must not hide uncertainty, disagreement, risk, or a failed check.
State those things directly and explain their practical consequence.

## Select Details By Their Value To The Reader

Include a detail only when it changes at least one of these:

- what the user understands about the general picture;
- how confident they should be in the answer;
- a risk or limitation they need to know;
- a decision they need to make;
- what should happen next.

If removing a detail changes none of those things, omit it. Do not include facts
merely because they were available, expensive to obtain, or technically
interesting. Do not narrate the investigation unless the user asks for it or the
method materially affects confidence in the result.

Measure brevity by reader effort, not line count. Compression often produces
stacks of dense nouns that are short on screen and long in the reader's head;
status summaries are especially prone to this failure.

Connect every supporting detail back to its meaning. A path, command result,
source, number, or implementation fact should be followed by the conclusion it
supports or the consequence it creates. Never leave evidence as an unexplained
list for the user to interpret.

## Add Depth Without Losing The Explanation

After the general picture is clear, add only the supporting detail needed for the
intended reader. Technical evidence may be useful when the user requests it,
when a Builder needs it to continue implementation, or when it is necessary to
verify a consequential claim. Keep that evidence subordinate to the explanation:
state what it proves and why that proof matters.

Do not make the plain-language section a superficial summary followed by an
automatic full data dump. Progressive depth is optional, not a requirement to
include every layer. Stop when the reader's need and the artifact's required coverage are met.

## Repair Failed Explanations

When the user says an explanation did not land, do not repeat the same vocabulary
with more words or headings. Change representation. Use a concrete instance,
contrast two real outcomes, trace one example from cause to consequence, or draw
the relationship. Diagnose what understanding was missing and rebuild from there.

For example, "the shape contract gains three rows including the decisions folder
form" supplies repo labels but not their meaning. Show the relevant lines, use a
real path from the user's tree, and state the consequence someone can picture,
such as "it would call 10 correctly placed files misfiled."

Before finalizing explanatory text, check:

- Can the general picture be understood from the opening alone?
- Is the answer written in plain English before technical vocabulary appears?
- Does every included detail have a clear meaning or consequence?
- Did I synthesize the evidence, rather than replay the research process?
- Can anything be removed without reducing understanding, confidence, safety, or
  the user's ability to decide or act?

## Help author the explanation

Use the conversation and relevant accessible sources within the authorized
scope to recover necessary context, following the
[evidence policy](../quality/evidence-policies.md). Draft or improve the text
when the facts are sufficient; a clear supplied explanation need not be
paraphrased just to show activity. Ask a focused question for a missing fact,
not for a properly written paragraph. Preserve meaning, attribution, and
uncertainty; do not invent a plausible cause or claim to have read an
inaccessible source. A link supports an explanation but does not replace it.

When a rationale is needed, connect the underlying cause to its consequence.
Listing events, repeating visible values, or naming the person who requested
an action does not by itself explain why. Check that the text contributes
understanding beyond what the reader can already see. A genuine record
correction may explain the earlier error without inventing a delivery problem.

Authoring assistance does not extend decision authority or write permissions.
Use the owning workflow to decide when missing facts block finalization, and
continue independent work. Do not seek repeated approval merely because an
already accepted fact was expressed more clearly.
