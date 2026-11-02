# Agent Role Guidance

Agentic Brain supports two local interaction roles for the root agent:

- `Creator`
- `Builder`

The role controls how much technical detail the root agent puts in front of the
user during repo work. It does not change repo permissions, evidence rules,
quality gates, or write boundaries.

How much detail is appropriate is a role question. Whether that detail is
readable is not, and this document does not govern it — root `AGENTS.md` does, in
both roles and whether or not a role was resolved. Do not restate that contract
here or narrow it per role.

## Local Selector

The local selector is `AGENTS.local.md` at the repo root. It is untracked and
stores the user's preferred interaction role for this checkout.

The installed `post-checkout` Git hook copies the main checkout's saved preference
into a new linked worktree only when that worktree has no selector. Existing local
preferences are preserved. The helper validates Creator/Builder and refuses a
symlinked source. The optional Git-hook installer preserves custom configuration;
without that mount, run `node scripts/propagate-local-role.mjs` in the new worktree.
SessionStart supplies the saved role to either host; it does not grant permissions.
Check the target selector before claiming propagation occurred.

Use this exact shape:

```md
# Agentic Brain Local Role

Role: Creator
```

Allowed values are exactly:

- `Role: Creator`
- `Role: Builder`

Use the inline template above when saving a preference. Do not create or validate a
`CLAUDE.local.md` file for this workflow.

## Startup Flow

At the start of each Agentic Brain repo task, the root or primary agent must:

1. Check whether root `AGENTS.local.md` exists and contains a clear allowed
   role.
2. Read this file.
3. Apply the selected interaction mode.
4. Continue the normal Agentic Brain boot sequence and evidence workflow.

These rules apply only to the root or primary agent that talks to the user.
Subagents may use technical context internally; the root agent translates their
results according to the user's role.

### Missing Local Selector

If `AGENTS.local.md` is missing:

1. Use an interaction preference already stated by the user. Otherwise ask
   whether to use `Creator` or `Builder` when that distinction would help.
2. Use the selected role immediately.
3. Ask whether to save the preference for next time.
4. Create root `AGENTS.local.md` only if the user approves saving it.

If the user postpones or declines setup, continue in temporary Creator mode when
needed and keep the persistent setup unresolved. Do not repeatedly ask during
the same task.

### Invalid Local Selector

If `AGENTS.local.md` exists but the role is missing, invalid, or unclear:

1. Explain that the saved role is unclear.
2. Ask whether to use `Creator` or `Builder` for the current task.
3. Use the selected role immediately.
4. Ask whether to fix the local file.

If the user does not approve fixing it, continue with the selected role for the
current task and do not repeatedly ask during the same task.

## Creator Mode

Creator mode is for non-technical collaboration.

The root agent should shield Creators from technical mechanics. The agent should
run safe reads and checks directly, then explain the result in plain outcome
terms.

Do not ask Creators to choose implementation mechanisms, including:

- libraries
- file names
- script names
- command names
- code structure
- validation implementation

Choose those details using repo conventions and safe defaults. Ask Creators only
about product intent, workflow intent, user-facing outcomes, or approvals for
meaningful actions.

Mention command names and implementation mechanics as little as possible in
prose. Use file paths when needed for traceability, but explain why the change
matters rather than how the underlying command works.

Existing explicit authorization continues to apply. Obtain approval for an
unapproved action before:

- destructive actions
- publishing or external actions
- opening a PR
- user-visible changes outside the requested scope
- expanding work to additional repo surfaces

If a Creator asks for an edit, the agent may edit the requested scope. If the
agent wants to broaden the scope, ask approval in outcome terms before doing so.

## Builder Mode

Builder mode is normal technical collaboration.

The root agent may discuss code, files, commands, scripts, validation details,
git state, trade-offs, and implementation structure directly. The agent should
still do available work directly instead of asking the user to perform steps
when the harness can do them safely.

Builder mode does not bypass Agentic Brain evidence, quality-gate, preflight,
or boundary rules.
