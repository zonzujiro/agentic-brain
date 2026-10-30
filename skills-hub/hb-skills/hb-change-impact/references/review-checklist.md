# Change Impact Review Checklist

Use this only after deterministic candidate discovery. It is a semantic review,
not a second detector.

- State the exact claim before and after the change.
- When an accepted answer closes an open question, state which question was
  resolved and whether the answer is local or may affect another artifact. If
  the answer is not yet recorded, confirm that any required impact check runs
  before its first canonical write.
- Confirm which artifact owns that claim.
- When durable behavior changes, name the behavior class and define the affected
  population before judging impact. Record the bounded repo query or inventory
  method and its count.
- Treat the deterministic detector as an explicit-signal shortlist. Add
  existing contract instances, writers, readers, templates, generators,
  validators, indexes, fixtures, bypasses, in-flight uses, and ownership
  consumers as manual candidates when the changed behavior makes them part of
  the population.
- For every candidate, quote or summarize the claim that consumes the changed
  context; do not infer impact from proximity alone.
- Give every material consumer exactly one disposition: `update now`,
  `unaffected` with evidence, `intentionally retained`, `migrate separately`,
  `route to owner`, or `blocked`.
- Distinguish `stale`, `contradictory`, `unaffected`, and `evidence blocked` in
  the overall result.
- If two sources conflict, show both claims. Ask the current user which governs
  only when their grounded scope covers that choice; otherwise route an owner
  review or handoff and keep the conflict blocked.
- If durable Brain behavior changes, state the current rule, intended end state,
  affected operational owner, decision lineage, population, migration,
  rollout, rollback, and in-flight compatibility.
- For every material follow-up, resolve the affected project, artifact owner,
  response discipline, and the current user's explicitly grounded scope.
- Treat an agent role, repository access, project membership alone, and
  unresolved ownership labels as insufficient authority evidence.
- Treat an explicit statement that work is coordinated with the relevant owner,
  delegated to the current user by that owner, or owned by the current user as
  confirmed scope for the named response. A bare request to change another
  discipline or project, participation, team membership, or a request for
  information is not equivalent authorization.
- Route another discipline's or project's response outside confirmed scope as
  an owner review or handoff. For explicitly coordinated work inside scope,
  proceed through the owning writer rather than forcing a redundant handoff.
- Propose only real evidence-backed actions, including `no further action` when
  appropriate, and explain the expected project effect of each material option.
- Translate the result into friendly user-facing prose with blank lines between
  paragraphs; do not expose the internal authority or routing schema by
  default.
- Route approved edits to existing owning writers and validators.
- Rerun explicit discovery and the population inventory after edits.
- Perform a distinct read-only final review from the diff and original claim.
  Rebuild the population, challenge every disposition, and block completion if
  a material consumer, owner route, migration step, or rollback path is missing.
- Report the inventory method and count plus every updated, unaffected,
  retained, separately migrated, owner-routed, and blocked consumer.
- Confirm that approval happened only after the user saw the material effects
  and remaining population; never infer approval from a request that preceded
  that disclosure.
