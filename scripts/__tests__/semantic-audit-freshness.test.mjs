import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const controller = fileURLToPath(new URL("../../skills-hub/hb-skills/hb-semantic-project-audit/scripts/semantic-project-audit.mjs", import.meta.url));

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "semantic-freshness-"));
  const git = (...args) => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
  };
  const write = (file, text) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), text); };
  const commit = message => { git("add", "."); git("commit", "-qm", message); };
  const run = (command = "plan", extra = []) => spawnSync(process.execPath, [controller, command, `--repo-root=${root}`, "--base=master", "--no-working-tree", ...extra], { encoding: "utf8" });
  const plan = () => { const r = run(); assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout); };
  git("init", "-q", "-b", "master"); git("config", "user.name", "Audit Test"); git("config", "user.email", "test@example.invalid");
  write("projects-in-progress/alpha/README.md", "# Alpha\n\nOwns alpha.\n");
  write("projects-in-progress/beta/README.md", "# Beta\n\nOwns beta.\n");
  commit("base"); git("switch", "-qc", "feature");
  write("projects-in-progress/alpha/README.md", "# Alpha\n\nOwns updated alpha.\n"); commit("feature");
  return { root, git, write, commit, run, plan };
}

test("content-equivalent commits, base advances, merges and rebases retain the audit digest", () => {
  const f = fixture();
  try {
    const digest = f.plan().audit_input;
    f.git("commit", "--allow-empty", "-qm", "metadata only");
    assert.equal(f.plan().audit_input, digest);
    f.git("switch", "master"); f.write("unrelated.txt", "outside semantic evidence\n"); f.commit("unrelated base change"); f.git("switch", "feature");
    assert.equal(f.plan().audit_input, digest);
    f.git("rebase", "master"); assert.equal(f.plan().audit_input, digest);
    f.git("switch", "master"); f.write("another.txt", "also outside evidence\n"); f.commit("another base change"); f.git("switch", "feature");
    f.git("merge", "--no-ff", "-m", "refresh master", "master");
    assert.equal(f.plan().audit_input, digest);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test("current master context enters the combined audit and invalidates an active review", () => {
  const f = fixture(); let session;
  try {
    const initial = f.plan().audit_input;
    const prepared = f.run("prepare"); assert.equal(prepared.status, 0, prepared.stderr);
    session = JSON.parse(prepared.stdout).session;
    f.git("switch", "master"); f.write("projects-in-progress/beta/README.md", "# Beta\n\nNow claims the alpha responsibility.\n"); f.commit("new competing scope"); f.git("switch", "feature");
    const objects = f.git("rev-parse", "--path-format=absolute", "--git-path", "objects");
    const beforeObjects = fs.readdirSync(objects, { recursive: true }).sort();
    assert.notEqual(f.plan().audit_input, initial);
    assert.deepEqual(fs.readdirSync(objects, { recursive: true }).sort(), beforeObjects, "combined planning must not write the checkout's object database");
    const stale = spawnSync(process.execPath, [controller, "advance", `--session=${session}`], { encoding: "utf8" });
    assert.notEqual(stale.status, 0); assert.match(stale.stderr, /input changed after prepare/);
    const fresh = JSON.parse(f.run("prepare").stdout);
    try { assert.match(fs.readFileSync(fresh.packet_path, "utf8"), /Now claims the alpha responsibility/); }
    finally { spawnSync(process.execPath, [controller, "cancel", `--session=${fresh.session}`]); }
    assert.doesNotMatch(fs.readFileSync(path.join(f.root, "projects-in-progress/beta/README.md"), "utf8"), /Now claims/);
  } finally {
    if (session) spawnSync(process.execPath, [controller, "cancel", `--session=${session}`]);
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test("combined-tree conflicts fail without mutating the branch or index", () => {
  const f = fixture();
  try {
    f.git("switch", "master"); f.write("projects-in-progress/alpha/README.md", "# Alpha\n\nConflicting base meaning.\n"); f.commit("conflict"); f.git("switch", "feature");
    const head = f.git("rev-parse", "HEAD"); const status = f.git("status", "--porcelain");
    const result = f.run(); assert.notEqual(result.status, 0); assert.match(result.stderr, /git .*merge --no-commit --no-ff.*failed/);
    assert.equal(f.git("rev-parse", "HEAD"), head); assert.equal(f.git("status", "--porcelain"), status);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test("default delivery refuses stale cached master when its refresh fails", () => {
  const f = fixture();
  try {
    f.git("remote", "add", "origin", path.join(f.root, "missing-remote"));
    f.git("update-ref", "refs/remotes/origin/main", f.git("rev-parse", "master"));
    const result = spawnSync(process.execPath, [controller, "prepare", `--repo-root=${f.root}`, "--no-working-tree"], { encoding: "utf8" });
    assert.notEqual(result.status, 0); assert.match(result.stderr, /Cannot refresh origin\/main/);
    assert.equal(result.stdout.trim(), "");
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});
