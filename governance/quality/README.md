# Quality Governance

This folder answers: **What makes Brain work trustworthy?**

- [Quality gates](quality-gates.md) owns review transitions, risk classes and waivers.
- [Evidence policy](evidence-policies.md) owns source depth and claim support.
- [Evidence details](evidence/inventory.md) defines the human-readable record.
- [Gate profiles](gates/gate-profiles.md) selects reusable agent review procedures.

Deterministic regression tests live under `scripts/__tests__/`. Portable host trials, retained interaction fixtures and incident review are
implemented. Model acceptance and live host coverage remain separately verified;
no model pass follows from deterministic tests. Root [AGENTS.md](../../AGENTS.md) owns boot routing. This folder owns
checks applied after a task has been classified.

## Restored review and feedback

- [Writer-independent document review](document-review.md)
- [Automatic access records and coverage](evidence/access-records.md)
- [Quality incident learning](quality-incidents.md)
- [Portable behavior evaluations](evals/README.md)
