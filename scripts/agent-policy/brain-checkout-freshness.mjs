#!/usr/bin/env node
// Brain checkout freshness gate. Keep this file self-contained so the
// repo-local hook and any independently installed copy use the same logic.

import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";


const CACHE_AGE_MS = 60_000;
const GIT_TIMEOUT_MS = 10_000;
const GATE_VERSION = "1";

function git(cwd, args) {
  const result = spawnSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    timeout: GIT_TIMEOUT_MS,
    maxBuffer: 1024 * 1024,
  });
  return {
    ok: result.status === 0 && !result.error,
    status: result.status,
    stdout: String(result.stdout ?? "").trim(),
    stderr: String(result.stderr ?? result.error?.message ?? "").trim(),
  };
}

function ghMain() { return { ok: false }; }

function candidateDirectory(payload) {
  const input = payload?.tool_input;
  const cwd = typeof payload?.cwd === "string" ? payload.cwd : process.cwd();
  if (input && typeof input === "object") {
    if (typeof input.workdir === "string") return path.resolve(cwd, input.workdir);
    if (typeof input.file_path === "string") return path.dirname(path.resolve(cwd, input.file_path));
  }
  return cwd;
}

function nearestExistingDirectory(candidate) {
  let directory = path.resolve(candidate);
  while (!fs.existsSync(directory)) {
    const parent = path.dirname(directory);
    if (parent === directory) return directory;
    directory = parent;
  }
  return fs.statSync(directory).isDirectory() ? directory : path.dirname(directory);
}

function cacheFile(cacheDir, root, sessionId) {
  const key = crypto.createHash("sha256").update(`${root}\0${sessionId}`).digest("hex");
  return path.join(cacheDir, `${key}.json`);
}

function readCache(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function writeCache(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, file);
}

function reason(message) {
  return `${message}\nBrain files were not changed. Fetch origin/main, then use a worktree based on that commit or move only the intended edits. Do not pull or stash this checkout automatically.`;
}

function recentlyFetchedMain(root, runGit, now) {
  const remote = runGit(root, ["remote", "get-url", "origin"]);
  if (!remote.ok) return null;
  const location = runGit(root, ["rev-parse", "--git-path", "FETCH_HEAD"]);
  if (!location.ok) return null;
  const file = path.resolve(root, location.stdout);
  try {
    const age = now() - fs.statSync(file).mtimeMs;
    if (age < -2_000 || age >= CACHE_AGE_MS) return null;
    const line = fs.readFileSync(file, "utf8").split("\n")
      .find((entry) => /\s+branch 'main' of /.test(entry) && entry.split(" of " ).at(-1).replace(/\.git$/, '') === remote.stdout.replace(/\.git$/, ''));
    return line?.match(/^([0-9a-f]{40,64})\s+/)?.[1] ?? null;
  } catch {
    return null;
  }
}

export function checkFreshness(payload, {
  runGit = git,
  runGh = ghMain,
  now = () => Date.now(),
  cacheDir = path.join(os.tmpdir(), "agentic-brain-freshness"),
  remoteMatches = (url) => Boolean(url),
  force = false,
} = {}) {
  const directory = nearestExistingDirectory(candidateDirectory(payload));
  const top = runGit(directory, ["rev-parse", "--show-toplevel"]);
  if (!top.ok) return { status: "outside-brain" };
  const root = path.resolve(top.stdout);
  const remote = runGit(root, ["remote", "get-url", "origin"]);
  const brainMarkers = ["projects-in-progress/agentic-brain/scope.md", "skills-hub/README.md"];
  if (!remoteMatches(remote.stdout) &&
      !brainMarkers.some((marker) => fs.existsSync(path.join(root, marker)))) {
    return { status: "outside-brain" };
  }
  if (!remote.ok || !remoteMatches(remote.stdout)) {
    return { status: "blocked", root,
      message: reason(`Brain origin is missing or does not point to configured origin: ${remote.stdout || remote.stderr || "unknown origin"}.`) };
  }

  const head = runGit(root, ["rev-parse", "HEAD"]);
  if (!head.ok || !/^[0-9a-f]{40,64}$/.test(head.stdout)) {
    return { status: "blocked", root, message: reason("Could not identify this Brain worktree's HEAD.") };
  }

  const sessionId = typeof payload?.session_id === "string" && payload.session_id
    ? payload.session_id : "no-session-id";
  const file = cacheFile(cacheDir, root, sessionId);
  const cached = sessionId === "no-session-id" ? null : readCache(file);
  if (!force && cached?.head === head.stdout && cached?.root === root && cached?.remote === remote.stdout &&
      Number.isFinite(cached.checkedAt) && now() - cached.checkedAt >= 0 &&
      now() - cached.checkedAt < CACHE_AGE_MS) {
    return { status: "fresh", root, head: head.stdout, main: cached.main, cached: true };
  }

  const queried = runGit(root, ["ls-remote", "origin", "refs/heads/main"]);
  let mainSha = queried.ok ? queried.stdout.match(/^([0-9a-f]{40,64})\s+refs\/heads\/main$/)?.[1] : null;
  if (!mainSha) {
    const fallback = runGh();
    mainSha = fallback.ok && /^[0-9a-f]{40,64}$/.test(fallback.stdout) ? fallback.stdout : null;
    if (!mainSha) {
      mainSha = recentlyFetchedMain(root, runGit, now);
      if (!mainSha) {
        return { status: "blocked", root,
          message: reason(`Could not read live Brain main from origin or GitHub${queried.stderr ? `: ${queried.stderr}` : "."}`) };
      }
    }
  }
  const currentHead = runGit(root, ["rev-parse", "HEAD"]);
  if (!currentHead.ok || !/^[0-9a-f]{40,64}$/.test(currentHead.stdout)) {
    return { status: "blocked", root, message: reason("Could not compare this checkout with live Brain main.") };
  }
  const ancestry = runGit(root, ["merge-base", "--is-ancestor", mainSha, currentHead.stdout]);
  if (!ancestry.ok) {
    return { status: "blocked", root, head: currentHead.stdout, main: mainSha,
      message: reason(`Brain checkout is behind or diverged from live main. Checkout HEAD: ${currentHead.stdout}; live main: ${mainSha}.`) };
  }

  if (sessionId !== "no-session-id") {
    writeCache(file, { root, remote: remote.stdout, head: currentHead.stdout, main: mainSha, checkedAt: now() });
  }
  return { status: "fresh", root, head: currentHead.stdout, main: mainSha, cached: false };
}

function deny(message) {
  process.stdout.write(`${JSON.stringify({ hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "deny",
    permissionDecisionReason: message,
  } })}\n`);
}

export function isDeliveryCommand(payload) {
  const command = [payload?.tool_input?.command, payload?.tool_input?.cmd]
    .find((value) => typeof value === "string") ?? "";
  return /(?:^|\s)(?:git\s+(?:commit|push)|gh\s+pr\s+create)(?:\s|$)/.test(command);
}

export function shouldCheck(payload) {
  const shellNames = new Set(["Bash", "Shell", "shell", "exec_command", "functions.exec"]);
  return !shellNames.has(payload?.tool_name) || isDeliveryCommand(payload);
}

async function main() {
  if (process.argv.includes("--version")) {
    process.stdout.write(`${GATE_VERSION}\n`);
    return;
  }
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    deny("Brain freshness check could not read the agent tool request.");
    return;
  }
  try {
    if (!shouldCheck(payload)) return;
    const expected = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'));
    const top = git(nearestExistingDirectory(candidateDirectory(payload)), ['rev-parse', '--show-toplevel']);
    if (!top.ok || fs.realpathSync(top.stdout) !== expected) return;
    const result = checkFreshness(payload, { force: isDeliveryCommand(payload) });
    if (result.status === "blocked") deny(result.message);
  } catch (error) {
    deny(reason(`Brain freshness check failed: ${error.message}`));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
