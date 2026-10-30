# Local agent hooks and delivery checks

The repository provides Codex hook definitions in `.codex/hooks.json`. Writing
that file does not activate it: Codex requires project and hook trust. The
installer never changes trust or approval settings. Current live verification is
recorded in [T2 mechanics](../../projects-in-progress/agentic-brain/t2-mechanics.md).

## Review and enable

Read the definitions and the two scripts they invoke under `scripts/hooks/`.
In Codex opened in this repository, use `/hooks` to review and trust those exact
definitions. Changed definitions require review again. For another authorized
Brain checkout, `node scripts/install-agent-hooks.mjs` previews the configuration;
`--install` writes it only when no hook file exists. Existing hooks are preserved,
not merged or replaced. These steps follow the
[official Codex hook contract](https://learn.chatgpt.com/docs/hooks).

After trust, test in a disposable checkout: session guidance should appear; a
structured write to an unowned root should be denied; an allowed write should
run shared checks; and a failed final check should request one repair pass.
Verify actual tool outcomes, not merely the presence of configuration or generic
host event labels. Never use a hook-trust bypass to establish this acceptance.

## What the local adapter does

- `SessionStart` supplies current governing pointers without storing transcripts.
- `PreToolUse` checks surviving structured-write targets against root ownership,
  rejects writes through repository symlinks and leaves removal of invalid files
  possible. Paths are resolved from the event working directory. Outside targets
  are outside this repository's policy scope.
- `PostToolUse` runs the shared file engine. Footnotes, local links and selected
  private integration markers are structural findings. Empty sections, vague
  evidence wording, cited gaps and relevant peer documents are review advisories.
- `Stop` runs whole-working-tree checks, including files produced through shell
  commands. It requests at most one repair continuation using the host's
  `stop_hook_active` flag, then reports unresolved issues. It does not attribute
  pre-existing errors to this turn or authorize changing unrelated work.

Hooks do not rewrite authored content. Decision structure and lineage use the
existing repository validator during the final check. Hook exceptions report a
visible failure and may fail open; unsupported tools, shell programs and missing
trust are coverage gaps. This is not a security boundary or proof of semantic
quality. External connector observation and actions remain outside T2.

## Delivery binding

The direct-command adapter recognizes bounded literal `git push` and
`gh pr create` calls. Compound commands, working-directory/repository overrides,
unsupported flags and uncertain targets are refused within that recognized set.
Computed commands, scripts that invoke Git internally, alternate shells/clients
and controller `--push` calls are outside that interception. Ordinary Git hooks
still inspect the working tree only; they do not prove staged or pushed content.

For supported direct delivery, the adapter refreshes `origin/main`, resolves
explicit base/head commits, and rebuilds both semantic and producer audit plans.
Push requires a single matching current-branch upstream on origin. Its review
record is ignored local `.brain/delivery-review.md`; PR creation uses the supplied
literal `--body-file`, with `--title` and optional `--base main`. Under `## Quality
Gates`, preserve both controllers' current attestation lines and any actual
owner-resolved findings. Do not invent an approval or a completed review to satisfy
these checks. Their digests bind review text to audit input; they are not signatures.
Passing checks never supplies push or PR authorization.

The PR CI job reads the event's repository identity, base/head SHAs and body,
requires checkout HEAD to match that head, and regenerates committed-input plans.
PR-body edits rerun it. There is no inherited source-repository title exemption.
Tests exercise this guard locally; an actual hosted PR run remains unverified
until an authorized PR exists. Main-branch CI runs structural checks and tests.
