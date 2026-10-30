#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const SCAN_ROOTS = ["projects-in-progress", "production-features", "knowledge-hub", "governance", "skills-hub", "scripts"];
const TEXT_EXTENSIONS = new Set([".md", ".json", ".yaml", ".yml", ".txt", ".mjs"]);
const SKIP_DIRS = new Set([".git", "node_modules", "site", "reviews"]);
export const DURABLE_BEHAVIOR_EXACT_PATHS = new Set([
  "AGENTS.md", "ARCHITECTURE.md", "README.md", "package.json", ".nvmrc",
]);

export function normalizeRepoPath(value) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replaceAll("\\", "/").replace(/^\.\//, "");
  if (!normalized || normalized.startsWith("/") || normalized.split("/").includes("..")) return null;
  return normalized.replace(/\/$/, "");
}

export function isDurableBehaviorCandidate(value) {
  const file = normalizeRepoPath(typeof value === "string" ? value : value?.filename);
  if (!file) return false;
  if (DURABLE_BEHAVIOR_EXACT_PATHS.has(file)) return true;
  return file.startsWith("governance/") || file.startsWith("scripts/") ||
    file.startsWith(".github/") || file.startsWith("skills-hub/") ||
    file.startsWith("projects-in-progress/agentic-brain/decisions/");
}

function walkTextFiles(rootDir) {
  const files = [];
  const visit = (relativeDir) => {
    const absoluteDir = path.join(rootDir, relativeDir);
    if (!fs.existsSync(absoluteDir)) return;
    for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      const relative = path.posix.join(relativeDir, entry.name);
      if (entry.isDirectory()) visit(relative);
      else if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(relative);
    }
  };
  for (const root of SCAN_ROOTS) visit(root);
  for (const rootFile of ["AGENTS.md", "ARCHITECTURE.md", "README.md"]) {
    if (fs.existsSync(path.join(rootDir, rootFile))) files.push(rootFile);
  }
  return files.sort();
}

function readText(rootDir, relativePath) {
  try {
    const absolute = fs.realpathSync(path.join(rootDir, relativePath));
    const relative = path.relative(fs.realpathSync(rootDir), absolute);
    if (relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) return null;
    return fs.readFileSync(absolute, "utf8");
  } catch {
    return null;
  }
}

function baselineText(rootDir, relativePath, baselineRef) {
  const result = spawnSync("git", ["show", `${baselineRef}:${relativePath}`], {
    cwd: rootDir,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return result.status === 0 ? result.stdout : null;
}

function extractSharedSourceIdentifiers(content) {
  if (!content) return new Set();
  const identifiers = new Set();
  for (const match of content.matchAll(/https?:\/\/[^\s<>()\]"']+/g)) {
    identifiers.add(match[0].replace(/[.,;:!?]+$/, ""));
  }
  for (const match of content.matchAll(/\b[A-Z][A-Z0-9]{1,9}-\d{1,7}\b/g)) identifiers.add(match[0]);
  return identifiers;
}

function frontmatter(content) {
  if (!content.startsWith("---\n")) return "";
  const end = content.indexOf("\n---", 4);
  return end === -1 ? "" : content.slice(4, end);
}

function parseAffectedDocs(relativePath, content) {
  if (!relativePath.includes("/decisions/") || !relativePath.endsWith(".md")) return [];
  const docs = [];
  let inAffected = false;
  for (const line of frontmatter(content).split(/\r?\n/)) {
    if (/^affected_docs:\s*$/.test(line)) {
      inAffected = true;
      continue;
    }
    if (inAffected && /^\S/.test(line)) break;
    const match = inAffected ? line.match(/^\s+-\s+path:\s+(.+?)\s*$/) : null;
    if (match) {
      const target = normalizeRepoPath(match[1].replace(/^['"]|['"]$/g, ""));
      if (target) docs.push(target);
    }
  }
  return docs;
}

function targetCoversChange(target, changedPath) {
  return changedPath === target || changedPath.startsWith(`${target}/`);
}

function addCandidate(candidateMap, candidatePath, reason) {
  if (!candidatePath || candidatePath === reason.changedPath) return;
  const reasons = candidateMap.get(candidatePath) ?? [];
  const key = `${reason.kind}\u0000${reason.changedPath}\u0000${reason.via ?? ""}`;
  if (!reasons.some((item) => `${item.kind}\u0000${item.changedPath}\u0000${item.via ?? ""}` === key)) reasons.push(reason);
  candidateMap.set(candidatePath, reasons);
}

export function discoverChangeImpact(rootDir, changedValues, options = {}) {
  const started = performance.now();
  const baselineRef = options.baselineRef ?? "HEAD";
  const normalized = changedValues.map(normalizeRepoPath);
  if (normalized.some(value => value === null)) throw new Error("Changed paths must stay inside the repository");
  const changedPaths = [...new Set(normalized)].sort();
  if (changedPaths.length === 0) return {
    changed: [], candidates: [], metrics: { scannedFiles: 0, elapsedMs: 0 },
  };
  const textFiles = walkTextFiles(rootDir);
  const contents = new Map(textFiles.map((file) => [file, readText(rootDir, file) ?? ""]));
  const affectedByDecision = [];
  for (const [file, content] of contents) {
    for (const target of parseAffectedDocs(file, content)) affectedByDecision.push({ decision: file, target });
  }

  const candidateMap = new Map();
  const changed = [];
  for (const changedPath of changedPaths) {
    const current = readText(rootDir, changedPath);
    const baseline = options.baselineContentByPath?.has(changedPath)
      ? options.baselineContentByPath.get(changedPath)
      : baselineText(rootDir, changedPath, baselineRef);
    const sharedIds = new Set([...extractSharedSourceIdentifiers(current), ...extractSharedSourceIdentifiers(baseline)]);
    changed.push({ path: changedPath, exists: current !== null, baselineAvailable: baseline !== null, durableBehaviorCandidate: isDurableBehaviorCandidate(changedPath) });

    for (const entry of affectedByDecision) {
      if (entry.decision === changedPath) {
        addCandidate(candidateMap, entry.target, { kind: "decision-affected-doc", changedPath, via: entry.decision });
      } else if (targetCoversChange(entry.target, changedPath)) {
        addCandidate(candidateMap, entry.decision, { kind: "affected-by-decision", changedPath, via: entry.target });
      }
    }
    for (const [file, content] of contents) {
      if (file === changedPath) continue;
      if (content.includes(changedPath)) addCandidate(candidateMap, file, { kind: "exact-path-reference", changedPath, via: changedPath });
      const shared = [...sharedIds].filter((identifier) => content.includes(identifier));
      if (shared.length > 0) addCandidate(candidateMap, file, { kind: "shared-source-identifier", changedPath, via: shared.slice(0, 3).join(", ") });
    }
  }

  return {
    changed,
    candidates: [...candidateMap.entries()].map(([candidatePath, reasons]) => ({ path: candidatePath, reasons })).sort((a, b) => a.path.localeCompare(b.path)),
    metrics: { scannedFiles: textFiles.length, elapsedMs: Math.round((performance.now() - started) * 10) / 10 },
  };
}

export function renderChangeImpactCandidates(result) {
  const lines = ["Change-impact candidates (semantic review required):"];
  for (const item of result.changed) {
    if (!item.baselineAvailable) lines.push(`- ${item.path}: baseline unavailable; removed source identifiers may be missed`);
    if (item.durableBehaviorCandidate) lines.push(`- ${item.path}: run the durable-behavior check`);
  }
  for (const candidate of result.candidates) {
    const reasons = candidate.reasons.map((reason) => `${reason.kind} via ${reason.via}`).join("; ");
    lines.push(`- ${candidate.path}: ${reasons}`);
  }
  if (lines.length === 1) lines.push("- none found by deterministic signals");
  lines.push(`Scanned ${result.metrics.scannedFiles} text files in ${result.metrics.elapsedMs} ms.`);
  return lines.join("\n");
}

function parseArgs(argv) {
  const options = { rootDir: process.cwd(), changed: [], json: false, baselineRef: "HEAD" };
  const args = [...argv];
  while (args.length > 0) {
    const arg = args.shift();
    if (arg === "--changed") options.changed.push(args.shift());
    else if (arg === "--root") options.rootDir = path.resolve(args.shift());
    else if (arg === "--baseline") options.baselineRef = args.shift();
    else if (arg === "--json") options.json = true;
    else throw new Error(`Unexpected argument: ${arg}`);
  }
  if (options.changed.some((value) => value === undefined)) throw new Error("--changed requires a repo-relative path");
  if (options.changed.length === 0) {
    const diff = spawnSync("git", ["diff", "--name-only", "HEAD"], { cwd: options.rootDir, encoding: "utf8" });
    if (diff.status !== 0) throw new Error(diff.stderr.trim() || "Unable to discover changed files");
    options.changed = diff.stdout.split(/\r?\n/).filter(Boolean);
  }
  return options;
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  const result = discoverChangeImpact(options.rootDir, options.changed, { baselineRef: options.baselineRef });
  process.stdout.write(`${options.json ? JSON.stringify(result, null, 2) : renderChangeImpactCandidates(result)}\n`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
