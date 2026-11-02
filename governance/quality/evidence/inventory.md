# Evidence Inventory

## Evidence Inventory

Every gated workflow should keep a compact evidence inventory. It can live in a
draft report, source package, PR body, or final document depending on the flow.
Evidence inventories stay human-readable; a source package is a workflow-specific
instance of the same record. This checkout has no connector-wide observed access
log. Record actual completed reads without pretending that the agent's inventory
is an independent machine receipt.

Minimum fields:

| Field | Required? | Description |
|---|---|---|
| Lane | Yes | Source family, such as active project docs, Figma, production features, implementation code, decisions, Jira, Drive, Slack, analytics. |
| Source | Yes | Durable locator: a URL reachable by teammates or a repo-relative path. A machine-local path may appear only in session-scoped working notes and must name its canonical origin. |
| Query / route | Yes for source recovery | Search query, connector/tool route, parent source, or local discovery path used to reach the source. |
| Access result | Yes | `accessible`, `blocked`, `rate-limited`, `not relevant`, or `deferred with user approval`. |
| Depth | Yes | `link-found`, `read`, `extracted`, `cross-checked`, `needs-deeper-source`, `blocked`, or `not needed`. |
| Read area | Yes for read/extracted/cross-checked sources | Section, heading, node, page, message, or local file area actually reviewed. |
| Extracted fact / gap | Yes for material sources | Fact, constraint, contradiction, or gap extracted from the source. |
| Supported claims | Yes | The claims this source supports, or `none yet` for discovery-only sources. |
| Section mapping | Conditional | Document sections the source can support, especially for template-driven workflows. |
| Cross-check | Conditional | Peer source used to verify or challenge the claim. |
| Gaps / notes | Yes | Missing access, stale source concern, conflict, or reason the source was not needed. |

Keep this inventory in the work report rather than copying its fields into
footnotes. Human reports record the person and actual statement, and explicitly
distinguish a source not independently inspected. Waivers record permission
scope separately from factual support under the [shared model](../evidence-policies.md#human-reports-and-waivers).
Reusing extracted Brain evidence does not establish a new external access or
verification date. Session-only citation advisories do not change that support;
resolve their actual source question without manufacturing access receipts.

If a source record cannot name the access result and read area, it cannot be
used as inspected evidence. If the workflow is a batch, keep these records per
target document; one aggregate source table cannot prove every target was
grounded.
