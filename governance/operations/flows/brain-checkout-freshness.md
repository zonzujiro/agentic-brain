# Brain Checkout Freshness

## Before agent writes

Inspect the branch, status, worktrees and configured remote before editing. For
work based on the current default branch, fetch that branch and compare it with
HEAD. This repository uses `main`; do not assume a source repository's `master`.
A local remote-tracking ref without a successful refresh is not live evidence.

If the checkout is behind or diverged, inspect the difference and preserve local
work before choosing an update. Never pull, rebase, stash, or discard authored
files merely to make a freshness check pass. Use a suitable isolated worktree
when the current checkout has unrelated work. An unavailable remote leaves live
freshness unverified; report that limitation at delivery.

## Automation and limits

The adapted checker at `scripts/agent-policy/brain-checkout-freshness.mjs` is
mounted in both host configurations for structured writes and recognized delivery
commands. It compares HEAD with live `origin/main`, accepts a verified fetch less
than one minute old as a network fallback, and binds its cache to session, worktree,
HEAD and remote. Delivery forces a new check. It never pulls or modifies authored
files. Real disposable-repository tests cover current, stale, descendant and
network-failure cases.

Host trust and live event delivery remain separate from those tests. Arbitrary
shell writes, computed wrappers and old checkouts are outside this guard. A hook
failure or absent mount is a visible coverage gap, never proof of freshness.

## Rollout and rollback

The script, mounts and deterministic trials are implemented. Before claiming
host activation, verify actual trust and event delivery. Old clones cannot run code they do not
contain. Revert the mounts first to disable a faulty checker; no authored-file
restoration should be required. An up-to-date merge requirement is a separate
remote setting and must be verified independently.
