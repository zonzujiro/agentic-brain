# Brain Capabilities

This is a decomposition of Agentic Brain for someone designing a related
system. “Required” means required for the smallest coherent Brain, not required
for every repository in general. The principles behind the required
capabilities live in the [reference-architecture overview](./README.md).

| Capability | Small Brain | This extraction | Why it exists |
|---|---|---|---|
| Clear entrypoint | Required | Root `README.md` | Lets a person or agent discover the system without first knowing its vocabulary. |
| Architecture boundary | Required | Root `ARCHITECTURE.md` | States what the Brain owns and distinguishes external access from authority. |
| Governing instructions | Required | `governance/` | Gives rules maintained human-readable owners while `AGENTS.md` routes agents to them. |
| Evidence and freshness | Required | Evidence policies and quality gates | Keeps support, gaps, applicability, and freshness visible at the claim or source that can change. |
| Active workspaces | Usually required | `projects-in-progress/` | Keeps developing context together while it is changing. |
| Durable decisions | Recommended | Project-scoped `decisions/` | Preserves rationale and approval while current rules live with their owners. |
| Shared reference knowledge | Optional | `knowledge-hub/` | Avoids rediscovering supported, applicable cross-project context. |
| Shipped-feature knowledge | Optional | `production-features/` | Separates stable product knowledge from active delivery work. |
| Reusable agent workflows | Optional, useful for repeated work | `skills-hub/` | Makes repeated work executable and reviewable. |
| Machine-readable Brain configuration | Optional, after a consumer exists | No generic manifest today | Gives an initializer, validator, upgrade flow, or other named consumer stable fields. |
| Mechanical enforcement | Add as scale grows | `scripts/`, hooks, CI | Detects broken paths, invalid shapes, and drift cheaply. |

The capability categories describe responsibilities and optional use, not a
license to drop substantive source guidance during migration. Preserve reusable
contracts and make optional workflows discoverable. Excluded internal products
stay listed in the extraction scope; missing automation stays in the task list.
