// The sanctioned Git/URL reader's provenance and log contract (decided:
// source-reads-register-through-sanctioned-transports).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import {
  buildTargetUrl,
  githubRepoFromRemote,
  githubApiPath,
  githubAuthState,
  grepEvidenceTargets,
  recordAccess,
  remoteMatchesRepo,
  resolveCheckout,
} from "../read_source.mjs";

const SHA = "2aeeb557897c8eaa5e0c3bbc185f3f65338c7f94";

// Real local Git objects; remote resolution is stubbed so stale-checkout tests
// cannot contact GitHub or depend on the developer's authentication.
function sourceFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "read-source-revisions-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const checkout = path.join(root, "checkout");
  fs.mkdirSync(checkout);
  const git = (...args) => execFileSync("git", ["-C", checkout, ...args], { encoding: "utf8" }).trim();
  git("init", "-q", "--initial-branch=master");
  git("config", "user.name", "Source test");
  git("config", "user.email", "source-test@example.invalid");
  git("remote", "add", "origin", "https://github.com/org/repo.git");
  fs.writeFileSync(path.join(checkout, "file.ts"), "committed old content\n");
  git("add", "file.ts");
  git("commit", "-qm", "old source");
  const oldSha = git("rev-parse", "HEAD");
  fs.writeFileSync(path.join(checkout, "file.ts"), "uncommitted content\n");
  const bin = path.join(root, "bin");
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, "gh"), `#!${process.execPath}\n
if (process.argv.slice(2).join(" ") !== "api repos/org/repo/commits/master --jq .sha") process.exit(2);
if (!process.env.HB_TEST_REMOTE_SHA) process.exit(1);
console.log(process.env.HB_TEST_REMOTE_SHA);
`, { mode: 0o755 });
  const read = (ref, remoteSha = "") => {
    const logRoot = fs.mkdtempSync(path.join(root, "session-"));
    const result = spawnSync(process.execPath, [
      path.resolve("scripts/read_source.mjs"), "--repo", "org/repo", "--ref", ref,
      "--file", "file.ts", "--checkout", checkout, "--root", logRoot,
    ], {
      encoding: "utf8",
      env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, HB_TEST_REMOTE_SHA: remoteSha },
    });
    const evidence = fs.readFileSync(path.join(logRoot, ".brain/session/evidence-log.jsonl"), "utf8")
      .trim().split("\n").map((line) => JSON.parse(line));
    return { ...result, evidence };
  };
  return { read, oldSha };
}

test("a pinned local read uses the committed revision, never the dirty working tree", (t) => {
  const { read, oldSha } = sourceFixture(t);
  const result = read(oldSha, "b".repeat(40));
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "committed old content");
  assert.equal(result.evidence[0].outcome, "ok");
  assert.equal(result.evidence[0].target, `https://github.com/org/repo/blob/${oldSha}/file.ts`);
});

test("an unavailable pinned revision fails without substituting local HEAD", (t) => {
  const { read } = sourceFixture(t);
  const missing = "b".repeat(40);
  const result = read(missing);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.evidence[0].outcome, "error");
  assert.equal(result.evidence[0].target, `https://github.com/org/repo/blob/${missing}/file.ts`);
});

test("master resolves remotely even when the local branch is older", (t) => {
  const { read } = sourceFixture(t);
  const remoteSha = "b".repeat(40);
  const result = read("master", remoteSha);
  assert.equal(result.status, 1, "the remotely resolved commit is absent locally");
  assert.equal(result.stdout, "", "old local master must not be served");
  assert.deepEqual(result.evidence.map(({ target, outcome }) => ({ target, outcome })), [
    { target: `https://github.com/org/repo/blob/${remoteSha}/file.ts`, outcome: "error" },
  ]);
});

test("remote resolution failure does not fall back to a cached branch", (t) => {
  const { read } = sourceFixture(t);
  const result = read("master");
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /cannot resolve ref master/);
  assert.ok(result.evidence.every((entry) => entry.outcome === "error"));
});

test("a remotely resolved branch reads the exact commit when it is available locally", (t) => {
  const { read, oldSha } = sourceFixture(t);
  const result = read("master", oldSha);
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "committed old content");
  assert.equal(result.evidence[0].target, `https://github.com/org/repo/blob/${oldSha}/file.ts`);
  assert.equal(result.evidence[0].outcome, "ok");
});

test("buildTargetUrl produces the pinned blob shape citations use", () => {
  assert.equal(
    buildTargetUrl({ orgRepo: "sample-org/implementation", sha: SHA, filePath: "packages/a/b.ts" }),
    `https://github.com/sample-org/implementation/blob/${SHA}/packages/a/b.ts`,
  );
});

test("buildTargetUrl produces tree URLs for grep and listing reads", () => {
  assert.equal(
    buildTargetUrl({ orgRepo: "org/repo", sha: SHA, kind: "tree" }),
    `https://github.com/org/repo/tree/${SHA}`,
  );
  assert.equal(
    buildTargetUrl({ orgRepo: "org/repo", sha: SHA, filePath: "pkg", kind: "tree" }),
    `https://github.com/org/repo/tree/${SHA}/pkg`,
  );
});

test("repository identity accepts canonical GitHub remotes and rejects a same-named repo", () => {
  assert.equal(
    githubRepoFromRemote("git@github.com:sample-org/agentic-brain.git"),
    "sample-org/agentic-brain",
  );
  assert.equal(
    githubRepoFromRemote("https://github.com/sample-org/agentic-brain.git"),
    "sample-org/agentic-brain",
  );
  assert.equal(
    githubRepoFromRemote("ssh://git@github.com/sample-org/agentic-brain.git"),
    "sample-org/agentic-brain",
  );
  assert.equal(
    githubRepoFromRemote("https://notgithub.com/sample-org/agentic-brain.git"),
    null,
  );
  assert.equal(
    remoteMatchesRepo("git@github.com:sample-org/agentic-brain.git", "sample-org/agentic-brain"),
    true,
  );
  assert.equal(
    remoteMatchesRepo("git@github.com:other-org/agentic-brain.git", "sample-org/agentic-brain"),
    false,
  );
});

test("resolveCheckout refuses an explicit checkout whose origin is another repository", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "read-source-checkout-"));
  const checkout = path.join(root, "agentic-brain");
  fs.mkdirSync(path.join(checkout, ".git"), { recursive: true });

  assert.equal(
    resolveCheckout("sample-org/agentic-brain", checkout, root, {
      remoteFor: () => "git@github.com:other-org/agentic-brain.git",
      checkoutFor: () => true,
    }),
    null,
  );
  assert.equal(
    resolveCheckout("sample-org/agentic-brain", checkout, root, {
      remoteFor: () => "git@github.com:sample-org/agentic-brain.git",
      checkoutFor: () => true,
    }),
    checkout,
  );
  fs.rmSync(root, { recursive: true, force: true });
});

test("grep evidence includes the exact blob targets for matched files", () => {
  assert.deepEqual(
    grepEvidenceTargets(
      "org/repo",
      SHA,
      `${SHA}:pkg/a.ts:4:first\n${SHA}:pkg/a.ts:9:second\n${SHA}:pkg/b.ts:2:third\n`,
    ),
    [
      `https://github.com/org/repo/blob/${SHA}/pkg/a.ts`,
      `https://github.com/org/repo/blob/${SHA}/pkg/b.ts`,
    ],
  );
});

test("recordAccess appends one evidence entry per access with the real outcome", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "read-source-"));
  const target = buildTargetUrl({ orgRepo: "org/repo", sha: SHA, filePath: "pkg/file.ts" });
  recordAccess(root, { target, outcome: "ok" });
  recordAccess(root, { target: "https://example.com/blocked", outcome: "blocked", status: 403 });

  const lines = fs
    .readFileSync(path.join(root, ".brain/session", "evidence-log.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));

  assert.equal(lines.length, 2);
  assert.deepEqual(
    lines.map(({ tool, target: t, outcome, status }) => ({ tool, target: t, outcome, status })),
    [
      { tool: "read-source", target, outcome: "ok", status: undefined },
      { tool: "read-source", target: "https://example.com/blocked", outcome: "blocked", status: 403 },
    ],
  );
  assert.ok(lines.every((entry) => typeof entry.ts === "string" && entry.ts.length > 0));
  fs.rmSync(root, { recursive: true, force: true });
});

// URL reads used an anonymous fetch, and GitHub answers 404 rather than 403 for
// private resources, so a readable PR was once recorded as a blocked source.
// GitHub URLs now resolve through the same authenticated `gh api` path the
// repo reads already use.

test("githubApiPath maps pull request URLs onto the authenticated API path", () => {
  assert.equal(
    githubApiPath("https://github.com/sample-org/editor-ai-services/pull/14"),
    "repos/sample-org/editor-ai-services/pulls/14",
  );
});

test("githubApiPath maps issue URLs", () => {
  assert.equal(
    githubApiPath("https://github.com/org/repo/issues/7"),
    "repos/org/repo/issues/7",
  );
});

test("githubApiPath maps pinned blob URLs to contents at that ref", () => {
  assert.equal(
    githubApiPath(`https://github.com/org/repo/blob/${SHA}/packages/a/b.ts`),
    `repos/org/repo/contents/packages/a/b.ts?ref=${SHA}`,
  );
});

test("githubApiPath maps commit URLs", () => {
  assert.equal(
    githubApiPath(`https://github.com/org/repo/commit/${SHA}`),
    `repos/org/repo/commits/${SHA}`,
  );
});

test("githubApiPath passes api.github.com paths through", () => {
  assert.equal(
    githubApiPath("https://api.github.com/repos/org/repo/pulls/3"),
    "repos/org/repo/pulls/3",
  );
});

test("githubApiPath returns null for non-GitHub and unmappable URLs", () => {
  assert.equal(githubApiPath("https://example.com/a/b"), null);
  assert.equal(githubApiPath("https://github.com/org/repo"), null);
  assert.equal(githubApiPath("not a url"), null);
});

test("githubAuthState separates a usable gh from a missing or logged-out one", () => {
  assert.equal(githubAuthState(() => ({ status: 0, stdout: "", stderr: "" })).ok, true);
  assert.equal(githubAuthState(() => ({ status: 1, stdout: "", stderr: "" })).ok, false);
});
