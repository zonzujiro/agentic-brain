# Reusable workflows

Workflow source lives under `hb-skills/{skill}/`. Read a skill in this checkout
and resolve repository paths from this repository root. Copying a skill directory
alone does not carry its governance dependencies. No host discovery or hooks are
installed; this increment supports explicitly reading the workflow instructions.

## Adapted source

- [Resolve artifact write](hb-skills/hb-resolve-artifact-write/SKILL.md): read-only
  routing before a material write. Determines owner, path, maturity, existing-file
  handling, and remaining checks. It neither writes artifacts nor validates their
  truth. Its contract is [artifact write boundary](../governance/artifacts/artifact-write-boundary.md).

The other fourteen candidates remain pending. See the
[scope](../projects-in-progress/agentic-brain/scope.md) and
[tasks](../projects-in-progress/agentic-brain/tasks.md). Host integration and model
behavior evaluations remain separate work; a source file is not an installed hook.
