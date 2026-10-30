# Evidence Grounding Standards

## Claim-Level Grounding Footnotes

Applicable source-grounded artifact Markdown must expose the source-to-statement
relationship where the reader encounters the statement. Follow the meanings in
[Statements, Evidence, And Precedents](../evidence-policies.md#statements-evidence-and-precedents).
The historical heading and anchor remain stable for existing callers.

For every applicable source-grounded artifact, use a direct source link beside
a material statement when the link alone gives sufficient support and context.
Use a footnote when the reader needs additional verification context: source
not inspected, human attribution, inference, conflicting evidence, meaningful
observation conditions or age, or a scoped waiver. This presentation rule
applies across Brain document writers, including active project documents,
shipped-feature knowledge, Knowledge Hub references, and other Brain-authored
Markdown outputs. Preserve an artifact's required sections and source fields;
they do not replace support beside a material statement. Existing
source-grounded documents are part of the migration: audit their material
statements and footnotes for obsolete source snapshots, unsupported shorthand,
and investigation-log prose.
Correct the statement and its support together, keep useful limitations, and
replace bloated examples with the concise form. Do not add a rationale to a
clear statement merely to satisfy the migration, and do not change a sound
source relationship only for uniform formatting.

Do not use claim-level grounding footnotes in governance documents: root or
surface `AGENTS.md`, repo workflow/gate/standards docs, source-repo skills, or
decision records. Governance rules must be self-contained in their operational
owner. Keep their evidence and approval trail in preflight analysis, decision
rationale, and the PR description; use ordinary stable links only when readers
need direct lineage.

The evidence inventory and claim ledger remain workflow records, not content to
copy into every document. Keep material limitations that change the statement's
meaning in the body. A footnote must not retract an apparently settled fact.
Keep operational instructions for agents in the review procedure and skills.

Use this shape:

```md
The proposed control's tooltip supplements its accessible name.[^close-control]

[^close-control]: The designer specified the tooltip text in this conversation;
    the Figma source was not inspected. The owner waived that source check for RFC
    review only; implementation wiring and release remain unverified.
```

Rules:

- Attach support beside externally grounded material statements in prose,
  table rows, and diagrams, using the shared rule above.
  Connective prose does not require a citation.
- One footnote may cover adjacent claims only when the same inspected source
  bundle and support state cover all of them. Split the claims or footnotes
  when their evidence differs.
  Reading facts from one page does not give them the same support state:
  reported key existence, inspected code wiring, and permission to defer a check
  remain separate relationships. Do not use a shared note to imply otherwise.
- Footnotes contain the exact source locator and the smallest useful explanation
  of support or its limits. Do not repeat the body or narrate the investigation.
  A leading evidence-kind/support-state label is optional; an old label remains
  valid but cannot replace a meaningful qualification. Use natural wording.
- Place the reference beside the supported statement and definitions at the end
  of the file. One note may cover multiple statements only when their source,
  support, and any permission scope genuinely match.
- Link to a durable URL or repo-relative path and include the closest useful
  heading, anchor, file, test, or code area. When a footnote identifies a source,
  make its locator a Markdown link; a backticked or prose path alone is not a
  linked source. A source already linked beside the statement need not be
  repeated in the footnote. Do not present a source that is only `link-found` or
  blocked as inspected support. An explicitly uninspected pointer
  may identify the outstanding check; it does not substantiate the statement.
- Pin GitHub file and tree links to the full commit SHA. Moving refs such as
  `master`, `main`, or another branch do not preserve the inspected source.
  Pull-request, issue, release, and commit URLs may be used when that artifact
  itself is the evidence. A PR URL identifies the proposal; it does not freeze
  its contents or establish accepted, merged, released, or current behavior.
  Pin inspected code and preserve a material lifecycle limitation in the body.
- For GitHub code evidence, make the link label the backticked named symbol and
  target the exact supporting line or tight line range in the file at that full
  commit SHA.
  Prefer the function or method that owns the behavior. When the source has no
  function, use the nearest honest named component, test, type, constant, RPC,
  declaration, or configuration section. Do not invent a function name.
- Do not use a repository, directory, moving branch, or bare filename as the
  code citation when a named symbol exists. GitHub tree links may describe a
  non-code source bundle, but they are not a substitute for symbol-level code
  evidence.
- Preserve the actual support state. A footnote does not upgrade `gap`,
  `conflict`, or `single-source` support into verified fact.
- Attribute human reports and relevant waivers under the shared policy; name
  the uninspected source or exact missing check when material. Do not invent a
  message/approval link. Human permission does not upgrade a fact's support.
- Use stable, descriptive footnote IDs. Every reference must have exactly one
  non-empty definition, and every definition must be referenced.

Apply this contract to newly written or materially revised source-grounded
artifact content. Governance documents retain the boundary above. Update a
living note's obsolete support instead of accumulating a history; preserve
still-relevant rationale, limitations, and approvals. Git retains prior text.

Footnote applicability is a semantic claim-grounding judgment made by the
author and reviewer under the existing quality gate. A document can correctly
contain no grounding footnotes when it makes no material claim derived from an
inspected source. The current validator checks footnote integrity, the durable,
symbol-level shape of GitHub code links in those notes, and changed or reused
local link resolution. Direct external links retain the same source-shape
contract under semantic review. Reviewers remain responsible for confirming that the named
symbol and line range actually support the claim. Validators must not infer that
footnotes are required from a document path, source links, or
evidence-access telemetry.
