// Shared writer for deterministic source-transport evidence. Hooks and
// sanctioned transports append to the same uncommitted session log; authored
// artifacts never write or curate these entries.

import { spawnSync } from "node:child_process";
import { appendEvidence } from "./hooks/session.mjs";

export function resolveEvidenceRoot(explicitRoot) {
  if (explicitRoot) return explicitRoot;
  const result = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim() : process.cwd();
}

export function recordSourceEvidence({ rootDir, tool, target, outcome, status, coverage, sessionId }) {
  if (typeof target !== "string" || !target.trim()) return null;
  if (/^https?:\/\//i.test(target)) {
    const url = new URL(target); url.username='';url.password='';
    for (const key of [...url.searchParams.keys()]) if (/token|key|secret|auth|signature|credential/i.test(key)) url.searchParams.delete(key);
    target=url.href;
  }
  const entry = {
    ts: new Date().toISOString(),
    tool,
    ...(sessionId ? {sessionId} : {}),
    target: target.trim(),
    outcome,
    ...(coverage ? { coverage } : {}),
    ...(status ? { status } : {}),
  };
  try {
    appendEvidence(resolveEvidenceRoot(rootDir), entry);
    return entry;
  } catch (error) {
    throw new Error(`Source access recording failed; do not claim recorded evidence: ${error.message}`);
  }
}

export function recordSourceTargets({ rootDir, tool, targets, outcome, status, coverage, sessionId }) {
  const unique = [
    ...new Set(
      (targets ?? []).filter((target) => typeof target === "string" && target.trim()),
    ),
  ];
  return unique.map((target) =>
    recordSourceEvidence({ rootDir, tool, target, outcome, status, coverage, sessionId }),
  );
}
