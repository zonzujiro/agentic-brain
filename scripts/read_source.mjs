#!/usr/bin/env node
// Sanctioned self-logging Git/URL read runner (decided:
// source-reads-register-through-sanctioned-transports). Performs a source read
// and appends the evidence entry for the canonical target it actually served,
// so shell-channel reads register in the session evidence log the same way
// Read/WebFetch accesses do. Entries are machine-written by this runner from
// the access it performed - never agent-authored.
//
//   node scripts/read_source.mjs --repo <org/repo> --ref <ref> --file <path> [--lines A-B]
//   node scripts/read_source.mjs --repo <org/repo> --ref <ref> --grep <pattern>   (local checkout only)
//   node scripts/read_source.mjs --repo <org/repo> --ref <ref> --ls <path>
//   node scripts/read_source.mjs --url <url>
//   Optional: --checkout <path> (local clone), --root <dir> (session-log root override)

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { recordSourceEvidence, recordSourceTargets } from "./lib/source-evidence.mjs";

const FULL_SHA = /^[0-9a-f]{40}$/;

// The blob/tree URL shape citations pin; the citation rule ignores a cited
// line anchor while requiring the same repository, revision and file.
export function buildTargetUrl({ orgRepo, sha, filePath, kind = "blob" }) {
  const suffix = filePath ? `/${filePath}` : "";
  return `https://github.com/${orgRepo}/${kind}/${sha}${suffix}`;
}

export function recordAccess(rootDir, { target, outcome, status, coverage }) {
  return recordSourceEvidence({
    rootDir,
    tool: "read-source",
    target,
    outcome,
    status,
    coverage,
  });
}

function run(command, args) {
  const r = spawnSync(command, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return { status: r.status ?? 1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

function sessionRoot(explicit) {
  if (explicit) return explicit;
  const r = run("git", ["rev-parse", "--show-toplevel"]);
  return r.status === 0 ? r.stdout.trim() : process.cwd();
}

export function githubRepoFromRemote(remoteUrl) {
  const value = String(remoteUrl ?? "").trim().replace(/\.git\/?$/, "");
  const scp = value.match(/^(?:[^@]+@)?github\.com:([^/]+)\/([^/]+)$/i);
  if (scp) return `${scp[1]}/${scp[2]}`;
  try {
    const parsed = new URL(value);
    if (parsed.hostname.toLowerCase() !== "github.com") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.length === 2 ? `${parts[0]}/${parts[1]}` : null;
  } catch {
    return null;
  }
}

export function remoteMatchesRepo(remoteUrl, orgRepo) {
  return githubRepoFromRemote(remoteUrl)?.toLowerCase() === String(orgRepo).toLowerCase();
}

function checkoutRemote(checkout) {
  const result = run("git", ["-C", checkout, "remote", "get-url", "origin"]);
  return result.status === 0 ? result.stdout.trim() : null;
}

function isCheckout(checkout) {
  return run("git", ["-C", checkout, "rev-parse", "--is-inside-work-tree"]).stdout.trim() === "true";
}

export function resolveCheckout(
  orgRepo,
  explicit,
  rootDir,
  { remoteFor = checkoutRemote, checkoutFor = isCheckout } = {},
) {
  const repo = orgRepo.split("/")[1];
  const candidates = explicit
    ? [explicit]
    : [path.join(rootDir, "..", repo)];
  return candidates.find((dir) =>
    fs.existsSync(dir) && checkoutFor(dir) && remoteMatchesRepo(remoteFor(dir), orgRepo),
  ) ?? null;
}

function resolveSha(orgRepo, ref) {
  if (FULL_SHA.test(ref)) return ref;
  // A branch or abbreviated ref in a local checkout can lag behind GitHub.
  // Resolve remotely before reading the exact immutable object; never serve
  // a cached branch as the requested current source after a remote failure.
  const r = run("gh", ["api", `repos/${orgRepo}/commits/${ref}`, "--jq", ".sha"]);
  if (r.status === 0 && FULL_SHA.test(r.stdout.trim())) return r.stdout.trim();
  throw new Error(`cannot resolve ref ${ref} for ${orgRepo} remotely (gh api failed; cached local refs are not used)`);
}

function readRepoFile(orgRepo, sha, filePath, checkout) {
  if (checkout) {
    const r = run("git", ["-C", checkout, "show", `${sha}:${filePath}`]);
    if (r.status === 0) return r.stdout;
    throw new Error(r.stderr.trim() || `git show failed for ${sha}:${filePath}`);
  }
  const r = run("gh", [
    "api",
    `repos/${orgRepo}/contents/${encodeURI(filePath)}?ref=${sha}`,
    "--jq",
    ".content",
  ]);
  if (r.status !== 0) throw new Error(r.stderr.trim() || `gh api contents failed for ${filePath}`);
  return Buffer.from(r.stdout.replace(/\n/g, ""), "base64").toString("utf8");
}

function sliceLines(content, lines) {
  if (!lines) return content;
  const m = lines.match(/^(\d+)-(\d+)$/);
  if (!m || Number(m[1]) < 1 || Number(m[2]) < Number(m[1])) throw new Error(`--lines expects ordered positive A-B, got ${lines}`);
  return content.split("\n").slice(Number(m[1]) - 1, Number(m[2])).join("\n");
}

// GitHub HTML URLs are unreadable to an unauthenticated fetch for private
// repos, so a cited PR, issue, or blob answered 404 and looked like a dead
// link. Repo reads already go through authenticated `gh api`; this maps a
// github.com URL onto the same path so URL reads get the same access. The
// evidence entry keeps the URL the caller asked for, so a citation still
// matches what the document cites.
export function githubApiPath(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname === "api.github.com") {
    return `${parsed.pathname.replace(/^\//, "")}${parsed.search}`;
  }
  if (parsed.hostname !== "github.com") return null;
  const parts = parsed.pathname.replace(/^\//, "").split("/");
  const [org, repo, kind, ...rest] = parts;
  if (!org || !repo || !kind) return null;
  const orgRepo = `${org}/${repo}`;
  if (kind === "pull" && /^\d+$/.test(rest[0] ?? "")) {
    return `repos/${orgRepo}/pulls/${rest[0]}`;
  }
  if (kind === "issues" && /^\d+$/.test(rest[0] ?? "")) {
    return `repos/${orgRepo}/issues/${rest[0]}`;
  }
  if ((kind === "blob" || kind === "tree") && rest.length >= 2) {
    const [ref, ...filePath] = rest;
    return `repos/${orgRepo}/contents/${encodeURI(filePath.join("/"))}?ref=${ref}`;
  }
  if (kind === "commit" && rest[0]) {
    return `repos/${orgRepo}/commits/${rest[0]}`;
  }
  return null;
}

// Separates "gh cannot run or is logged out" from "gh ran and the resource is
// genuinely unreadable". Only the first makes an anonymous 404 ambiguous.
export function githubAuthState(runner = run) {
  const r = runner("gh", ["auth", "status"]);
  return { ok: r.status === 0 };
}

export function grepEvidenceTargets(orgRepo, sha, stdout) {
  const targets = [];
  for (const line of String(stdout).split("\n")) {
    const match = line.match(/^[^:]+:(.+?):\d+:/);
    if (match) targets.push(buildTargetUrl({ orgRepo, sha, filePath: match[1] }));
  }
  return [...new Set(targets)];
}

function urlOutcome(status) {
  if ([301, 302, 303, 307, 308, 401, 403].includes(status)) return "blocked";
  return status >= 200 && status < 300 ? "ok" : "error";
}

function parseArgs(argv) {
  const args = {};
  const flags = ["repo", "ref", "file", "lines", "grep", "ls", "url", "checkout", "root"];
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i].replace(/^--/, "");
    if (!argv[i].startsWith("--") || !flags.includes(name)) throw new Error(`unknown argument: ${argv[i]}`);
    args[name] = argv[++i];
    if (!args[name] || args[name].startsWith("--")) throw new Error(`missing value for --${name}`);
  }
  const modes = [args.url, args.file, args.grep, args.ls].filter(Boolean);
  if (modes.length !== 1 || (!args.url && !(args.repo && args.ref))) {
    throw new Error("need --url, or --repo with --ref and one of --file/--grep/--ls");
  }
  if (args.repo && !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(args.repo)) throw new Error('invalid repository');
  for (const name of ['file', 'ls']) if (args[name] && (args[name].startsWith('/') || args[name].startsWith('-') || args[name].split('/').includes('..'))) throw new Error('unsafe source path');
  if (args.url) { const u = new URL(args.url); if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password) throw new Error('unsupported URL'); }
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const rootDir = sessionRoot(args.root);

  if (args.url) {
    const apiPath = githubApiPath(args.url);
    let ghNote = "";
    if (apiPath) {
      const r = run("gh", ["api", apiPath]);
      if (r.status === 0) {
        console.log(r.stdout);
        recordAccess(rootDir, { target: args.url, outcome: "ok", status: 200, coverage: { kind: "response" } });
        return 0;
      }
      // The fallback below is anonymous, and GitHub answers 404 rather than 403
      // for private resources. Without this note a missing token is
      // indistinguishable from a deleted page, which is how a readable PR was
      // once recorded as a blocked source. Name the cause instead.
      ghNote = githubAuthState().ok
        ? " (gh is authenticated but could not read this path)"
        : " (gh unavailable or unauthenticated, so this read was anonymous:" +
          " a 404 here may mean private, not absent)";
    }
    let response = null;
    try {
      response = await fetch(args.url, { redirect: "follow", signal: AbortSignal.timeout(30000) });
    } catch (error) {
      recordAccess(rootDir, { target: args.url, outcome: "error" });
      console.error(`read_source: fetch failed: ${error.message}${ghNote}`);
      return 1;
    }
    const outcome = urlOutcome(response.status);
    let responseText;
    try { responseText = await response.text(); } catch(error) {
      recordAccess(rootDir,{target:args.url,outcome:'error',status:response.status,coverage:{kind:'partial'}});
      throw new Error(`Response body read failed: ${error.message}`);
    }
    if(outcome === 'ok') console.log(responseText);
    recordSourceTargets({
      rootDir,
      tool: "read-source",
      targets: [args.url, response.url],
      outcome,
      status: response.status,
      coverage: { kind: "response" },
    });
    if (outcome !== "ok") {
      console.error(
        `read_source: ${args.url} answered HTTP ${response.status} (${outcome})${ghNote}`,
      );
      return 1;
    }
    return 0;
  }

  const checkout = resolveCheckout(args.repo, args.checkout, rootDir);
  let sha;
  try {
    sha = resolveSha(args.repo, args.ref);
  } catch (error) {
    recordAccess(rootDir, { target: `https://github.com/${args.repo}`, outcome: "error" });
    console.error(`read_source: ${error.message}`);
    return 1;
  }

  if (args.file) {
    const target = buildTargetUrl({ orgRepo: args.repo, sha, filePath: args.file });
    try {
      const content = readRepoFile(args.repo, sha, args.file, checkout);
      const selected = sliceLines(content, args.lines);
      console.error(`# ${target}`);
      console.log(selected);
      recordAccess(rootDir, { target, outcome: "ok", coverage: args.lines ? { kind: "lines", range: args.lines } : { kind: "file" } });
      return 0;
    } catch (error) {
      recordAccess(rootDir, { target, outcome: "error" });
      console.error(`read_source: ${error.message}`);
      return 1;
    }
  }

  if (args.grep) {
    if (!checkout) {
      recordAccess(rootDir, { target: buildTargetUrl({ orgRepo: args.repo, sha, kind: "tree" }), outcome: "blocked" });
      console.error(`read_source: --grep needs a local checkout of ${args.repo}`);
      return 1;
    }
    const target = buildTargetUrl({ orgRepo: args.repo, sha, kind: "tree" });
    const r = run("git", ["-C", checkout, "grep", "-n", "-e", args.grep, sha]);
    // git grep exits 1 on no matches: an answered query, not a failure.
    recordSourceTargets({
      rootDir,
      tool: "read-source",
      targets: [target, ...grepEvidenceTargets(args.repo, sha, r.stdout)],
      outcome: r.status <= 1 ? "ok" : "error",
      coverage: { kind: "discovery" },
    });
    if (r.status > 1) {
      console.error(`read_source: ${r.stderr.trim()}`);
      return 1;
    }
    console.error(`# ${target}`);
    console.log(r.stdout);
    return 0;
  }

  const target = buildTargetUrl({ orgRepo: args.repo, sha, filePath: args.ls, kind: "tree" });
  try {
    let listing;
    if (checkout) {
      const r = run("git", ["-C", checkout, "ls-tree", "--name-only", sha, `${args.ls.replace(/\/$/, "")}/`]);
      if (r.status !== 0) throw new Error(r.stderr.trim() || `git ls-tree failed for ${args.ls}`);
      listing = r.stdout;
    } else {
      const r = run("gh", ["api", `repos/${args.repo}/contents/${encodeURI(args.ls)}?ref=${sha}`, "--jq", ".[].name"]);
      if (r.status !== 0) throw new Error(r.stderr.trim() || `gh api contents failed for ${args.ls}`);
      listing = r.stdout;
    }
    recordAccess(rootDir, { target, outcome: "ok", coverage: { kind: "discovery" } });
    console.error(`# ${target}`);
    console.log(listing);
    return 0;
  } catch (error) {
    recordAccess(rootDir, { target, outcome: "error" });
    console.error(`read_source: ${error.message}`);
    return 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { process.exitCode = await main(); } catch (error) { console.error(`read_source: ${error.message}`); process.exitCode = 1; }
}
