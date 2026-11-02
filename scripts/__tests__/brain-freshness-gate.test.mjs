import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { checkFreshness, isDeliveryCommand, shouldCheck } from "../agent-policy/brain-checkout-freshness.mjs";

const script = fileURLToPath(new URL("../agent-policy/brain-checkout-freshness.mjs", import.meta.url));

function git(cwd, ...args) {
  return execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8" }).trim();
}

function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "hb-freshness-test-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const remote = path.join(base, "remote.git");
  const seed = path.join(base, "seed");
  const checkout = path.join(base, "checkout");
  const peer = path.join(base, "peer");
  fs.mkdirSync(seed);
  git(base, "init", "--bare", "--initial-branch=main", remote);
  git(seed, "init", "--initial-branch=main");
  for (const marker of ["AGENTS.md", "projects-in-progress/agentic-brain/prd.md", "skills-hub/README.md"]) {
    const file = path.join(seed, marker);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, "fixture\n");
  }
  git(seed, "add", ".");
  git(seed, "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "initial");
  git(seed, "remote", "add", "origin", remote);
  git(seed, "push", "-u", "origin", "main");
  git(base, "clone", remote, checkout);
  git(base, "clone", remote, peer);
  return { base, remote, checkout, peer, cacheDir: path.join(base, "cache") };
}

function advancePeer(peer) {
  fs.appendFileSync(path.join(peer, "AGENTS.md"), "advance\n");
  git(peer, "add", "AGENTS.md");
  git(peer, "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "advance");
  git(peer, "push", "origin", "main");
}

test("fresh checkout and descendant branch pass; stale checkout blocks without changing files", (t) => {
  const { checkout, peer, cacheDir } = fixture(t);
  let clock = 1_000_000;
  const payload = { cwd: checkout, session_id: "session-one", tool_input: { file_path: "AGENTS.md" } };
  const options = { cacheDir, now: () => clock, remoteMatches: () => true };
  const first = checkFreshness(payload, options);
  assert.equal(first.status, "fresh");
  assert.equal(first.cached, false);
  assert.equal(checkFreshness(payload, options).cached, true);

  const originalHead = git(checkout, "rev-parse", "HEAD");
  const originalText = fs.readFileSync(path.join(checkout, "AGENTS.md"), "utf8");
  fs.writeFileSync(path.join(checkout, "local-notes.md"), "uncommitted work\n");
  advancePeer(peer);
  clock += 60_001;
  const stale = checkFreshness(payload, options);
  assert.equal(stale.status, "blocked");
  assert.match(stale.message, /behind or diverged/);
  const newFile = { ...payload, tool_input: { file_path: "new/deep/document.md" } };
  assert.equal(checkFreshness(newFile, options).status, "blocked");
  assert.equal(git(checkout, "rev-parse", "HEAD"), originalHead);
  assert.equal(fs.readFileSync(path.join(checkout, "AGENTS.md"), "utf8"), originalText);
  assert.equal(fs.readFileSync(path.join(checkout, "local-notes.md"), "utf8"), "uncommitted work\n");

  git(checkout, "fetch", "origin", "main");
  git(checkout, "merge", "--ff-only", "FETCH_HEAD");
  git(checkout, "switch", "-c", "feature");
  fs.writeFileSync(path.join(checkout, "feature.md"), "work\n");
  git(checkout, "add", "feature.md");
  git(checkout, "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "feature");
  assert.equal(checkFreshness(payload, options).status, "fresh");
});

test("GitHub API fallback supplies the live SHA when Git transport is blocked", (t) => {
  const { checkout, cacheDir } = fixture(t);
  const sha = git(checkout, "rev-parse", "HEAD");
  const runGit = (cwd, args) => {
    if (args[0] === "ls-remote") return { ok: false, status: 128, stdout: "", stderr: "network blocked" };
    const result = spawnSync("git", ["-C", cwd, ...args], { encoding: "utf8" });
    return { ok: result.status === 0, status: result.status,
      stdout: String(result.stdout ?? "").trim(), stderr: String(result.stderr ?? "").trim() };
  };
  const result = checkFreshness({ cwd: checkout, session_id: "fallback", tool_input: { command: "git status" } },
    { cacheDir, remoteMatches: () => true, runGit, runGh: () => ({ ok: true, stdout: sha, stderr: "" }) });
  assert.equal(result.status, "fresh", result.message);
  assert.equal(result.main, sha);
});

test("canonical origin identifies an old or sparse checkout without current markers", (t) => {
  const { checkout, cacheDir } = fixture(t);
  fs.rmSync(path.join(checkout, "projects-in-progress"), { recursive: true });
  fs.rmSync(path.join(checkout, "skills-hub"), { recursive: true });
  const result = checkFreshness({ cwd: checkout, tool_input: { command: "git status" } },
    { cacheDir, remoteMatches: (url) => url.endsWith("/remote.git") });
  assert.equal(result.status, "fresh");
});

test("remote failure and wrong origin block a Brain checkout", (t) => {
  const { checkout, cacheDir } = fixture(t);
  const payload = { cwd: checkout, session_id: "session-two", tool_input: { command: "git status" } };
  git(checkout, "remote", "set-url", "origin", "/missing/brain-remote.git");
  assert.match(checkFreshness(payload, { cacheDir }).message, /Could not read live Brain main/);
  const unavailable = checkFreshness(payload, { cacheDir, remoteMatches: () => true,
    runGh: () => ({ ok: false, stdout: "", stderr: "offline" }) });
  assert.equal(unavailable.status, "blocked");
  assert.match(unavailable.message, /Could not read live Brain main/);
});

test("a recent explicit fetch permits editing when the hook has no network", (t) => {
  const { checkout, cacheDir } = fixture(t);
  git(checkout, "fetch", "origin", "main");
  const result = checkFreshness({ cwd: checkout, session_id: "fetched", tool_input: { file_path: "AGENTS.md" } },
    { cacheDir, remoteMatches: () => true,
      runGh: () => ({ ok: false, stdout: "", stderr: "offline" }),
      runGit: (cwd, args) => {
        if (args[0] === "ls-remote") return { ok: false, stdout: "", stderr: "offline" };
        const run = spawnSync("git", ["-C", cwd, ...args], { encoding: "utf8" });
        return { ok: run.status === 0, stdout: String(run.stdout ?? "").trim(), stderr: String(run.stderr ?? "").trim() };
      } });
  assert.equal(result.status, "fresh", result.message);
});

test("the hook denies malformed requests", () => {
  const version = spawnSync(process.execPath, [script, "--version"], { encoding: "utf8" });
  assert.equal(version.status, 0);
  assert.match(version.stdout, /^1\n$/);
  const malformed = spawnSync(process.execPath, [script], { input: "{", encoding: "utf8" });
  assert.equal(malformed.status, 0);
  assert.equal(JSON.parse(malformed.stdout).hookSpecificOutput.permissionDecision, "deny");
});

test("Codex exec_command cmd forces a live recheck before delivery", (t) => {
  const { checkout, peer, cacheDir } = fixture(t);
  const payload = { cwd: checkout, session_id: "delivery", tool_input: { cmd: "git push origin feature" } };
  const options = { cacheDir, remoteMatches: () => true };
  assert.equal(checkFreshness(payload, options).status, "fresh");
  advancePeer(peer);
  assert.equal(isDeliveryCommand(payload), true);
  assert.equal(checkFreshness(payload, { ...options, force: isDeliveryCommand(payload) }).status, "blocked");
  assert.equal(isDeliveryCommand({ ...payload, tool_input: { command: "git commit -m test" } }), true);
  assert.equal(isDeliveryCommand({ ...payload, tool_input: { cmd: "git status" } }), false);
  assert.equal(shouldCheck({ ...payload, tool_name: "Bash", tool_input: { cmd: "git fetch origin main" } }), false);
  assert.equal(shouldCheck({ ...payload, tool_name: "Bash" }), true);
  assert.equal(shouldCheck({ ...payload, tool_name: "apply_patch" }), true);
});
