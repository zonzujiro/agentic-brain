# Fictional decision: keep the first queue local

## Choice and rationale

Use browser-local persistence for the bounded single-browser need. Lee accepted
its loss-on-clear limitation in the supplied fictional record.[^choice]

## Alternatives

A server-backed account could support sharing and recovery, but those needs are
not established here. An ephemeral list would fail the reopen requirement. These
are scoped tradeoffs, not a claim that local storage is always best.

## Consequences and review trigger

The brief, failed-write acceptance case, user warning and feature knowledge must
agree on the storage boundary. Revisit the choice if sharing or recovery becomes
an accepted requirement. A later choice should preserve this rationale as history.

[^choice]: [Fictional choice evidence](source.md#fictional-decision-and-delivery-evidence).
