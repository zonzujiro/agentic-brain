# Skill Metadata

Brain-owned skills declare their artifact ownership in `SKILL.md`
frontmatter. This metadata is the machine-readable replacement for a manual
skill inventory.

The metadata answers one narrow question: what role does this skill play in
Brain-owned repo artifacts? It does not replace the skill body, the artifact
writer map, documentation standards, or quality gates.

## Migration status

Current Brain packages declare ownership using JSON flow syntax under `metadata`
(valid YAML). The package validator checks declared classes, invocation flags,
writer artifacts and named profiles. It accepts foreign package metadata without
rewriting it; adoption review must resolve missing ownership before treating a
foreign package as a Brain canonical writer. Nested block examples below explain
the same contract, but the current parser checks the JSON flow representation.

Vendored source bodies remain upstream-owned. Local policy belongs in explicit
local extensions, adoption metadata, governance or validators rather than silent
rewrites of vendor content.

## Retained metadata shape

```yaml
metadata:
  brain:
    ownership_class: canonical-writer | companion | validator-helper | legacy
    user_invocation: direct | internal | helper
    governed_by:
      - governance/artifacts/artifact-writer-map.md
      - governance/skills/skill-metadata.md
    artifacts:
      - id: technical-rfc
        role: final-writer
        paths:
          - projects-in-progress/{project}/engineering/rfc-{rfc-slug}.md
        validators:
          - the applicable artifact validator
```

`artifacts` is required for `canonical-writer` skills. It is optional for
companions and helpers when their role is broader than one artifact.

## Ownership Classes

| Class | Meaning |
|---|---|
| `canonical-writer` | Creates, materially updates, imports, exports, or refreshes a canonical Brain artifact. Direct edits must satisfy the same governing contract. |
| `companion` | Helps discover, shape, analyze, or enrich work but does not own final canonical truth. |
| `validator-helper` | Reviews, validates, resolves, or routes work without owning the artifact being checked. |
| `legacy` | Historical or superseded workflow. It must not be the active canonical writer for new work. |

## Invocation Values

| Value | Meaning |
|---|---|
| `direct` | User-facing entrypoint. |
| `helper` | Supporting workflow that may be called by agents or other skills but is not the default user entrypoint. |
| `internal` | Hidden helper. Must set `disable-model-invocation: true` and `user-invocable: false`. |

## Validation

The ownership validator covers declared metadata:

- Maintained Brain-owned skills declare `metadata.brain`; review catches omissions
- `ownership_class` and `user_invocation` use known values
- `governed_by` includes `governance/artifacts/artifact-writer-map.md`
- canonical writers declare at least one artifact with `role: final-writer`
- legacy skills are not direct user-facing entrypoints
- internal skills align frontmatter visibility flags

This validation is intentionally about ownership and routing. It does not try
to infer whether every artifact list is semantically complete.
