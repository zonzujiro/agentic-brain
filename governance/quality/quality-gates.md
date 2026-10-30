# Quality gates for the initial extraction

## Review before delivery

For a material change, establish the owning surface, relevant sources, supported
claims, unresolved contradictions, downstream consumers, and validation scope.
Inspect source contents before treating them as evidence. Preserve missing checks
as gaps. Stop when a required decision or essential source is unresolved; do not
convert a waiver into evidence.

For code or extraction changes, run `npm test` and `npm run check`. Inspect the
diff and describe what the tests establish. This initial checker validates local
Markdown targets, source footnotes and Decision structure/lineage, and rejects selected private integration
markers. It does not validate heading anchors, every Markdown syntax, remote URLs,
secret absence, provenance rights, source truth, or connector behavior.

The fuller gate profiles, semantic overlap review, and host enforcement remain
pending migration. They are not silently satisfied by this smaller check.

## User-feedback exemption

Record attributed user feedback without demanding independent verification of
the report. Implementing a proposed fix or reusing the report as verified truth
requires the appropriate source review. Recording feedback does not approve its
proposed remedy.

## Publication boundary

Before a public release, verify the selected license and permission to distribute
retained material, inspect content for private information, run the complete
release acceptance checks, and obtain explicit publication approval. The current
private extraction has not completed that review.

## Decision and impact checks

`npm run check` includes stable Decision paths, required metadata, valid dot dates,
impact-entry shape, lineage targets and supersession cycles. It cannot determine
whether an answer was approved, evidence is sufficient, a summary matches the
answer, or every affected file has been identified. Apply the Decision review
workflow for those questions. The shared parser supports the documented block
metadata subset, not arbitrary YAML.

The change-impact scanner returns candidates from explicit references and shared
source identifiers. Review the full affected population separately. Missing
baselines, external sources, hidden host configuration and semantic relationships
limit automatic discovery; no result is a proof that nothing else is affected.
