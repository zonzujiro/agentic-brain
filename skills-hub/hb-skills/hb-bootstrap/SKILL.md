---
name: hb-bootstrap
description: Set up or check a local Agentic Brain checkout. Use on a fresh clone or when asked to bootstrap the environment; verifies local prerequisites and offers optional repository Git checks without configuring connectors or credentials.
metadata: {"brain":{"ownership_class":"companion","user_invocation":"direct","governed_by":["governance/artifacts/artifact-writer-map.md","governance/skills/skill-metadata.md"]}}
---

# Bootstrap

Run from the checkout root. Keep setup idempotent: inspect first, preserve existing
configuration, and report actual results instead of inferring readiness from files.

## 1. Establish the checkout and authority

Read root instructions, README, architecture and operating rules. Inspect Git
status, branch and remotes. Do not replace a remote, switch a dirty checkout,
remove files or install a global tool as a setup shortcut. Resolve a wrong
checkout before changing it. The source extraction repository stays read-only.

## 2. Check the runtime

Read `package.json` and `.nvmrc`, then run `node --version` and `npm --version`.
The current mechanics require Node.js 24 or newer and have no npm dependencies.
Do not run a package installer merely because this is a fresh checkout. If the
runtime is missing or unsupported, explain the required version and continue
independent read-only orientation. Do not claim checks passed without running them.

## 3. Run the current checks

Run `npm test` and `npm run check`. Report failures with their concrete cause.
These commands validate structure and deterministic behavior. They do not prove
source truth, user approval, delivery, privacy clearance or publication rights.

## 4. Read the workflow catalog

Read `skills-hub/README.md`. Workflow source paths resolve against this checkout;
copying a skill alone omits its governance dependencies. Explicitly reading a
workflow works in the current agent session. Automatic host discovery is not
installed by this command and must not be inferred from a SKILL.md filename.

## 5. Offer optional local Git checks

Inspect with `node scripts/install-git-hooks.mjs`. Install only when the user's
request includes enabling these local hooks, using `--install`. The installer
preserves an existing hook path and custom hook files; a refusal is not permission
to overwrite them. Configuration changes apply to linked worktrees as Git defines,
so explain that scope before installation. The installer prints the previous
setting and exact removal command when it installs.

The post-checkout hook propagates the saved role. The other hooks run repository tests and checks at commit and push. A failed hook blocks
that Git operation; fix the failure rather than disabling a hook to deliver.
They check the current working tree, not an isolated staged or pushed snapshot;
hosted CI checks the committed revision separately. They do not observe external reads or writes, and do not enforce PR approval or
semantic truth. Host-disabled hooks still require CI and agent review.

## 6. Inspect optional agent hooks

Read `governance/operations/agent-hooks.md` and inspect
`node scripts/install-agent-hooks.mjs`. Repository configuration is provided;
other checkouts can use the non-overwriting installer within setup authorization.
A written configuration is not trusted or active. The user must review the exact
hook definitions through the selected host’s `/hooks`; do not change trust or use bypass flags
on their behalf. Exercise actual events in a disposable checkout after trust.
Report skipped/unverified events separately from passing fixture tests.

## 7. Resolve interaction preference

Read `governance/operations/roles/agent-role-guidance.md`. Apply an existing
Creator/Builder selector or the user's stated preference. If neither is available,
explain the modes when useful; continue in temporary Creator mode if setup is
postponed. Save `AGENTS.local.md` only when the user wants the preference saved.
Role choice changes explanation depth, never permissions. The installed Git post-checkout hook copies the preference into linked
worktrees without replacing their existing selectors; verify the actual target.

## 8. Establish the next useful action

Ask only for missing intent: orient to existing work, start one small project,
record a choice, or inspect evidence. No persistent role setup, notification channel or
external login is required. Connector investigation remains deferred until an
actual host and connector are selected and connected.

## Report

State runtime and check results, whether optional hooks are active or preserved,
which workflow source can be read next, and any remaining setup gap. Do not claim
an initializer, connector, model evaluation or full publication readiness merely
because local checks passed.
