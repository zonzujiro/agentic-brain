# Automatic source access records

Access recording is required for source-grounded work. A record describes an
operation and its coverage; it is not a claim that the content is true or understood.
The shared writer appends metadata under ignored `.brain/session/evidence-log.jsonl`.
It stores time, tool, target, outcome, optional status, coverage and host session ID
when supplied. It does not store source bodies, transcripts or credentials.

## Implemented transports

`scripts/read_source.mjs` reads pinned repository files, line ranges, tree listings
and grep results, or a URL. Its receipts are written automatically through the
shared writer. Git reads bind to the resolved commit, not a moving branch label.
A file/range read is distinguishable from discovery results; grep and tree lists
cannot prove the whole file was inspected. URL responses are response coverage,
not an assertion that pagination or linked sources were exhausted.

The host observer accepts Read/WebFetch and matching MCP source operations. A
supplied URL or in-repository file path identifies the attempted source. Structured
HTTP or MCP error status is preserved; ambiguous output stays unknown. Pagination,
limits and truncation indicate partial coverage. Search/list operations indicate
discovery. Unmapped connector inputs produce an unknown tool-level event and an
explicit identity gap, never a fabricated source receipt. Tool-level events must
not satisfy a canonical source-access check.

## Failure and privacy boundaries

The shared writer strips URL credential fields and common secret query parameters.
Do not place secrets in source identifiers. Logs are local and ignored; do not
commit them as evidence or author synthetic receipts. Symlinked log locations are
refused, and append failures are surfaced. A failed logger leaves recording
unverified even when a read itself succeeded. Report that gap and preserve the
actual tool result; do not rewrite failure as successful observation.

## Host coverage

Both host configurations include the observer. Configuration and deterministic
adapter tests do not establish activation. Verify trust and a real event on each
host before claiming that channel is observed. Claude failure events have a separate
mount. Shell reads, nested orchestration, unsupported connector inputs and hosts
that omit events are not covered automatically by this observer. Prefer the
self-logging reader for supported source reads; investigate a concrete connector's
actual request/response before adding a mapping. Missing coverage remains required
work, not a waiver of access recording.

An access record never upgrades discovery, an unread link, partial output or an
unknown result into a full source read. The [document review](../document-review.md)
checks actual statement support, freshness, governing sources and precedent.
