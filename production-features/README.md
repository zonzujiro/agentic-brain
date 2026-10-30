# Delivered-work knowledge

Store knowledge about delivered work only when delivery is confirmed. Do not
infer release from a merge, a folder move or passing tests. An owner's report
may establish confirmation within their authority; retain attribution when no
independent deployment source was inspected.

[Feature knowledge authoring](../skills-hub/hb-skills/hb-create-feature-doc/SKILL.md)
owns `production-features/{feature}/feature-knowledge.md` and its evidence/template
contract. This is the current supported behavior, not an implementation dump.

[Project archive](../skills-hub/hb-skills/hb-archive-project/SKILL.md) preserves
one delivered project at a new feature root, or at `changes/{change}/` under an
existing feature. It preserves the tree and historical Decision IDs, checks
incoming links and then invokes the feature writer. Existing targets cannot be
silently merged or overwritten. Moved evidence may remain historical; the move
does not make every assertion current. Archive safety validation still runs if
the feature-knowledge handoff is blocked.
