# Pull Request Flows

## Prepare and review

1. Inspect the actual branch, base, diff and working-tree state. Preserve unrelated
   edits. Explain the concrete change and its consumers.
2. Finish applicable evidence, change-impact and semantic reviews. Run `npm test`
   and `npm run check`; distinguish deterministic results from semantic judgment.
3. Prepare the title and description from the final diff. Include relevant
   validation, remaining gaps, and any required current audit attestations.
4. Ask Ivan for approval for this specific PR creation. A draft PR is still a PR;
   preparing a branch or body is not authorization to create it.
5. After authorized creation, verify the remote branch and PR state. Read actual
   CI failures before deciding whether the problem is content, code, policy,
   infrastructure, or stale evidence.

## Review requests and comments

A review request should summarize only meaningful changes and their intent,
identify the exact PR and affected project/document, and resolve the destination
and people before sending. Show the exact proposed message when approval is
needed. Do not infer recipients from access, a project name, or an old roster.

Sending a message, posting or resolving a PR comment, or replying for the user
requires explicit authorization for that action. Draft suggestions in chat when
that authorization is absent. A failed send does not authorize a fallback DM,
new recipients, or a partial broadcast.

## Review follow-through

Inspect current findings against the actual reviewed revision. Classify each as
valid and in scope, already addressed, unsupported, or a genuine owner decision.
Repair authorized agent-owned defects and revalidate the affected behavior.
Keep evidence and reasoning for findings that should not be applied. Do not
silently resolve comments or count a passing schema check as review approval.

Background monitoring, automatic repair, native auto-merge, source-repo sync PRs,
notifications, and post-merge effect reconciliation are not installed workflows
in this extraction. Do not promise them or recreate their external actions from
a remembered source-repo convention.

## After merge

Verify the merged PR and commit before reporting success. Check the main checkout
for unrelated work, then update `main` from its remote when safe. Do not stash as
a cleanup shortcut. Remove temporary work only after confirming it is preserved
or obsolete. A merge is not evidence that a deployment or downstream effect ran.

The [delivery contract](../agent-hooks.md#delivery-binding) owns the current
bounded command checks and CI attestation binding. Human approval and source
truth remain separate from those checks.
