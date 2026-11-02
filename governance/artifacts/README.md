# Artifact Governance

This folder answers: **What may be written, where does it belong, and which
workflow owns it?**

Use these documents in order:

1. [`artifact-write-boundary.md`](./artifact-write-boundary.md) resolves the
   artifact type, target surface and path, maturity, owner, existing artifact,
   and later gates before writing.
2. [`artifact-writer-map.md`](./artifact-writer-map.md) identifies the canonical
   writer or finalizer for known artifact types.
3. [`documentation-standards.md`](./documentation-standards.md) defines the
   consumer-facing contract for execution documents.

Repository routing belongs in [`../operations/`](../operations/). Evidence and
validation semantics belong in [`../quality/`](../quality/).
