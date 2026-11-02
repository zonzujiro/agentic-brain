# Worked lifecycle: a personal reading queue

Every person, observation, decision and delivery result here is fictional. These
files are training inputs and examples, not verified product or release evidence.
Copy this directory to a new temporary sandbox before editing. The flat fixture
layout is not a canonical project layout; the steps below explain real routing.

## Scope and responsibilities

A small reading queue preserves saved links and the reader's completion state.
It owns those two behaviors and the user's ability to reopen an unread item.
It does not summarize articles, sync accounts or operate the linked websites.

## Boundaries and dependencies

Browser local storage is the fictional persistence boundary. Link availability
belongs to the destination website. No server, external connector or publication
is needed for the exercise. Cross-device sync is outside this example's decision.

## 1. Inspect sources and state the need

Read [the observations](source.md), including what was not tested. In a real Brain,
start an active project with `hb-start-project`, resolve overlap and write its
semantic capsule before expanding the [brief](brief.md). Explain why a request to
“add a database” is a proposed mechanism, not the user outcome.

Practice: identify two supported claims and one tempting unsupported claim. Do
not manufacture an external access receipt for this supplied fictional source.

## 2. Make a bounded choice

Read [the decision](decision.md). In a real project, `hb-add-decision` owns the
record under `decisions/`. Check the alternatives and the applicability of the
observation. Read relevant precedent when available; absence of precedent is a
visible gap, not permission to call the choice universal.

Practice: change the requirement to shared family access. Identify which boundary
and decision would need revisiting; preserve the original rationale as history.

## 3. Propagate the consequence

Read [delivery and verification](delivery.md). The accepted local-only choice
must be reflected in requirements, test scope and user expectations. Use
`hb-change-impact` to enumerate those consumers and `hb-resolve-decision-impact`
for an actual Decision's downstream work list. A decision record alone does not
silently update the operating document.

Practice: introduce a storage-write failure and identify the missing acceptance
case. Add the case to the sandbox before claiming readiness.

## 4. Verify and preserve shipped knowledge

The supplied delivery note is a fictional release confirmation. In a real project,
confirm actual shipped status before invoking `hb-archive-project`, preserve the
whole project tree and let `hb-create-feature-doc` own the feature document.
[Feature knowledge](feature.md) records durable behavior and limitations, not a
copy of volatile implementation status.

Practice: explain why a passed local test is insufficient evidence of deployment.
Do not move the sandbox into this repository's production features.

## 5. Extract and challenge a reusable lesson

Read [the lesson](lesson.md). Use `hb-add-knowledge-hub-doc` only when the insight
is independently useful and its applicability is supported. Introduce the second
observation from the source: it narrows the lesson without erasing the first.

Practice: revise the scope of the lesson. Identify an incident only if a real
workflow failure occurred; the synthetic challenge itself is not a real incident.

## Review and finish

Run `validateDocumentSandbox` against the copied directory for links and footnotes.
Then apply the document review procedure to claims, evidence, precedent and
consumer needs. Explain each handoff in plain language. Completion means the
learner can show the changed passage, its support, its limitation and the actual
check result. Do not equate completing a tour with demonstrating that ability.
