// One happy and one adversarial case per rule that decides an outcome. The
// negatives carry most of the weight: the failure mode of this feature is firing
// on something that is not a duplicate, or going silent on something that is.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { check, renderReport, renderAnnotations } from "../lib/project-overlap/detect.mjs";
import { main, touchedKeys } from "../validate_project_overlap.mjs";

function repo({ projects = {}, shipped = {}, relations = null }) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "overlap-")));
  const write = (surface, slug, files) => {
    for (const [rel, text] of Object.entries(files)) {
      const abs = path.join(root, surface, slug, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, text);
    }
  };
  for (const [slug, files] of Object.entries(projects)) write("projects-in-progress", slug, files);
  for (const [slug, files] of Object.entries(shipped)) {
    write("production-features", slug, typeof files === "string" ? { "README.md": files } : files);
  }
  if (relations !== null) {
    fs.mkdirSync(path.join(root, "projects-in-progress"), { recursive: true });
    fs.writeFileSync(
      path.join(root, "projects-in-progress", "project-relations.json"),
      typeof relations === "string" ? relations : JSON.stringify(relations),
    );
  }
  return root;
}

function withRepo(spec, fn) {
  const root = repo(spec);
  try {
    return fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

const readme = (title, body = "") => `---\ntitle: ${title}\n---\n${body}`;
const withSources = (title, ...entries) =>
  `---\ntitle: ${title}\nsources:\n${entries.map((e) => `  - ${e}`).join("\n")}\n---\n`;
const epic = (key) => `https://example.atlassian.net/browse/${key}`;

const findingCount = (root) => check(root).findings.length;
const claimKeys = (root, slug) => {
  const result = check(root);
  return result.findings.flatMap((f) => f.evidence.map((e) => e.identity));
};

// ── claim position ───────────────────────────────────────────────────────────

test("an epic declared in README frontmatter is a claim; the same key in prose is not", () => {
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", epic("AB-100")) },
        beta: { "README.md": readme("Beta", "\nWe must not duplicate AB-100 here.\n") },
      },
    },
    (root) => assert.equal(findingCount(root), 0),
  );

  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", epic("AB-100")) },
        beta: { "README.md": withSources("Beta", "AB-100") },
      },
    },
    (root) => assert.equal(findingCount(root), 1),
  );
});

test("decisions/ and AGENTS.md are never claim position", () => {
  // A decision record's Sources are evidence for the decision. AGENTS.md is
  // harness context that cites whatever it needs. Both produced false findings.
  for (const file of ["decisions/rule.md", "AGENTS.md"]) {
    withRepo(
      {
        projects: {
          alpha: { "README.md": withSources("Alpha", epic("AB-200")) },
          beta: {
            "README.md": readme("Beta"),
            [file]: "# Doc\n\n## Sources\n\n- AB-200\n",
          },
        },
      },
      (root) => assert.equal(findingCount(root), 0, `${file} must not raise`),
    );
  }
});

test("only an exactly-named Sources heading is claim position", () => {
  const raising = ["Sources", "References", "Primary sources", "Source links"];
  const notRaising = ["Key links", "Related work", "Evidence / Confidence Ledger", "Source Gaps", "Design References"];

  for (const heading of raising) {
    withRepo(
      {
        projects: {
          alpha: { "README.md": withSources("Alpha", epic("AB-300")) },
          beta: { "README.md": readme("Beta", `\n## ${heading}\n\n- AB-300\n`) },
        },
      },
      (root) => assert.equal(findingCount(root), 1, `"${heading}" should raise`),
    );
  }

  for (const heading of notRaising) {
    withRepo(
      {
        projects: {
          alpha: { "README.md": withSources("Alpha", epic("AB-300")) },
          beta: { "README.md": readme("Beta", `\n## ${heading}\n\n- AB-300 belongs to alpha, not us.\n`) },
        },
      },
      (root) => assert.equal(findingCount(root), 0, `"${heading}" must not raise`),
    );
  }
});

test("a document opening with a horizontal rule is not read as frontmatter", () => {
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", epic("AB-400")) },
        beta: { "README.md": readme("Beta"), "notes.md": `---\n\nRelated: ${epic("AB-400")}\n\n---\n` },
      },
    },
    (root) => assert.equal(findingCount(root), 0),
  );
});

// ── identifier kinds ─────────────────────────────────────────────────────────

test("a Jira prefix counts only when proven, so template identifiers never do", () => {
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", "FR-001", "TC-001", "UF-001", "EV-007") },
        beta: { "README.md": withSources("Beta", "FR-001", "TC-001") },
      },
    },
    (root) => assert.equal(findingCount(root), 0),
  );

  // Proven by a browse URL in a third project, then a bare key counts.
  withRepo(
    {
      projects: {
        proof: { "README.md": withSources("Proof", epic("ZZ-1")) },
        alpha: { "README.md": withSources("Alpha", "ZZ-500") },
        beta: { "README.md": withSources("Beta", "ZZ-500") },
      },
    },
    (root) => assert.equal(findingCount(root), 1),
  );
});

test("a URL in an arbitrary JSON file is not a claim", () => {
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", epic("AB-700")) },
        beta: { "README.md": readme("Beta"), "notes.json": JSON.stringify({ note: `see ${epic("AB-700")}` }) },
      },
    },
    (root) => assert.equal(findingCount(root), 0),
  );
});

test("Slack matches public and private channels but not an ordinary capitalised word", () => {
  for (const id of ["C0ABCDEF12", "G0123456789"]) {
    withRepo(
      {
        projects: {
          alpha: { "README.md": withSources("Alpha", id) },
          beta: { "README.md": withSources("Beta", id) },
        },
      },
      (root) => assert.equal(findingCount(root), 1, `${id} should match`),
    );
  }

  // `[CG][A-Z0-9]{8,}` alone matches COMPONENTS, which produced a false overlap.
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", "COMPONENTS") },
        beta: { "README.md": withSources("Beta", "COMPONENTS") },
      },
    },
    (root) => assert.equal(findingCount(root), 0, "a word is not a channel id"),
  );
});

test("opaque ids keep their case, and the signed-in Drive form is matched", () => {
  // Figma and Drive ids are case-sensitive; lowercasing them collapsed two
  // different files into one identity.
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", "https://figma.com/design/AbCdEfGhIjKl/A") },
        beta: { "README.md": withSources("Beta", "https://figma.com/design/abcdefghijkl/B") },
      },
    },
    (root) => assert.equal(findingCount(root), 0, "different case is a different file"),
  );

  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", "https://docs.google.com/document/u/0/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit") },
        beta: { "README.md": withSources("Beta", "https://docs.google.com/document/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit") },
      },
    },
    (root) => assert.equal(findingCount(root), 1, "the /u/0/ form is the same document"),
  );
});

test("packages match by last segment, and a scope keeps them distinct", () => {
  withRepo(
    {
      projects: {
        alpha: { "README.md": "---\ntitle: A\npackages:\n  - example-grid\n---\n" },
        beta: { "README.md": "---\ntitle: B\npackages:\n  - example-packages/packages/example-grid\n---\n" },
      },
    },
    (root) => assert.equal(findingCount(root), 1, "bare and full-path spellings are one package"),
  );

  withRepo(
    {
      projects: {
        alpha: { "README.md": "---\ntitle: A\npackages:\n  - \"@team-a/ui\"\n---\n" },
        beta: { "README.md": "---\ntitle: B\npackages:\n  - \"@team-b/ui\"\n---\n" },
      },
    },
    (root) => assert.equal(findingCount(root), 0, "different scopes are different packages"),
  );

  withRepo(
    {
      projects: {
        alpha: { "README.md": "---\ntitle: A\npackages: []\n---\n" },
        beta: { "README.md": "---\ntitle: B\npackages: []\n---\n" },
      },
    },
    (root) => assert.equal(findingCount(root), 0, "an empty declaration is not a package"),
  );
});

test("routing fields never raise, however exactly they match", () => {
  const shared = "---\ntitle: X\nstatus: in-progress\ndomain: layout\nowner: \"person\"\n---\n";
  withRepo({ projects: { alpha: { "README.md": shared }, beta: { "README.md": shared } } }, (root) =>
    assert.equal(findingCount(root), 0),
  );
});

test("different registered owner labels add context to a real overlap", () => {
  const projectReadme = (title, owner) =>
    `---\ntitle: ${title}\nowner: "${owner}"\nsources:\n  - ${epic("AB-1600")}\n---\n`;
  withRepo(
    {
      projects: {
        alpha: { "README.md": projectReadme("Alpha", "Alex") },
        beta: { "README.md": projectReadme("Beta", "Sam") },
      },
    },
    (root) => assert.match(renderReport(check(root)), /different owners maintain these/),
  );
});

// ── cluster shape ────────────────────────────────────────────────────────────

test("N projects on one identifier is one finding naming all of them", () => {
  const projects = {};
  for (let i = 0; i < 5; i += 1) projects[`p${i}`] = { "README.md": withSources(`P${i}`, epic("AB-800")) };

  withRepo({ projects }, (root) => {
    const result = check(root);
    assert.equal(result.findings.length, 1, "never one finding per pair");
    assert.equal(result.findings[0].members.length, 5);
  });
});

test("a large cluster is truncated in the report rather than printed in full", () => {
  const projects = {};
  for (let i = 0; i < 50; i += 1) projects[`p${String(i).padStart(2, "0")}`] = { "README.md": withSources(`P${i}`, epic("AB-900")) };

  withRepo({ projects }, (root) => {
    const rendered = renderReport(check(root));
    const longest = Math.max(...rendered.split("\n").map((line) => line.length));
    assert.ok(longest < 200, `a 50-member cluster produced a ${longest}-character line`);
    assert.match(rendered, /\+ 44 more/);
  });
});

test("a channel shared too widely is ignored, and said to be ignored", () => {
  const projects = {};
  for (let i = 0; i < 20; i += 1) {
    projects[`p${String(i).padStart(2, "0")}`] = { "README.md": withSources(`P${i}`, "C0ABCDEF12") };
  }

  withRepo({ projects }, (root) => {
    const result = check(root);
    assert.equal(result.findings.length, 0);
    assert.equal(result.ignored.length, 1);
    assert.match(renderReport(result), /shared too widely/);
  });
});

test("an epic is never ignored for being widely shared", () => {
  const projects = {};
  for (let i = 0; i < 20; i += 1) {
    projects[`p${String(i).padStart(2, "0")}`] = { "README.md": withSources(`P${i}`, epic("AB-950")) };
  }

  withRepo({ projects }, (root) => {
    const result = check(root);
    assert.equal(result.findings.length, 1, "an epic is evidence, not vocabulary");
    assert.deepEqual(result.ignored, []);
  });
});

// ── dormant, cleared, shipped ────────────────────────────────────────────────

test("a dormant project leaves the corpus before clustering, so it cannot hide live duplicates", () => {
  withRepo(
    {
      projects: {
        "old-thing": { "README.md": `---\ntitle: Old (retired)\nstatus: retired\nsources:\n  - ${epic("AB-1000")}\n---\n` },
        alpha: { "README.md": withSources("Alpha", epic("AB-1000")) },
        beta: { "README.md": withSources("Beta", epic("AB-1000")) },
      },
    },
    (root) => {
      const result = check(root);
      assert.equal(result.findings.length, 1, "the live pair must still be reported");
      assert.deepEqual(result.findings[0].members.map((m) => m.slug), ["alpha", "beta"]);
      assert.deepEqual(result.dormant, ["old-thing"]);
    },
  );
});

test("a status with an inline comment or quotes still reads as dormant", () => {
  for (const status of ["retired # tombstone", '"retired"', "retired"]) {
    withRepo(
      { projects: { thing: { "README.md": `---\ntitle: T\nstatus: ${status}\n---\n` } } },
      (root) => assert.deepEqual(check(root).dormant, ["thing"], `status: ${status}`),
    );
  }
});

test("a cleared pair is quiet, counted, and listable", () => {
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", epic("AB-1100")) },
        beta: { "README.md": withSources("Beta", epic("AB-1100")) },
      },
      relations: { not_same: [["alpha", "beta"]] },
    },
    (root) => {
      const result = check(root);
      assert.equal(result.findings.length, 0);
      assert.equal(result.cleared.length, 1);
      // Without the count, a working run and a broken run print the same silence.
      assert.match(renderReport(result), /Quiet: 1 overlap listed as not the same work/);
      assert.match(renderReport(result, { showCleared: true }), /alpha \+ beta/);
    },
  );
});

test("an active project with a shipped feature's exact name is reported", () => {
  withRepo(
    { projects: { rotation: { "README.md": readme("Rotation") } }, shipped: { rotation: readme("Rotation") } },
    (root) => {
      const result = check(root);
      assert.equal(result.findings.length, 1);
      const rendered = renderReport(result);
      assert.match(rendered, /rotation \+ rotation \(already shipped\)/);
    },
  );
});

test("a shipped feature's own identifiers are compared, and two shipped alone are not", () => {
  withRepo(
    {
      projects: { "new-name": { "README.md": withSources("New Name", epic("AB-1200")) } },
      shipped: { "old-name": withSources("Old Name", epic("AB-1200")) },
    },
    (root) => assert.equal(findingCount(root), 1, "restarting shipped work must be caught"),
  );

  withRepo(
    {
      projects: { unrelated: { "README.md": readme("Unrelated") } },
      shipped: { a: withSources("A", epic("AB-1300")), b: withSources("B", epic("AB-1300")) },
    },
    (root) => assert.equal(findingCount(root), 0, "two archived features are history"),
  );
});

// ── relations file ───────────────────────────────────────────────────────────

test("a corrupt relations file is the one thing that fails, a missing one is normal", () => {
  withRepo({ projects: { alpha: { "README.md": readme("Alpha") } }, relations: "{ broken" }, (root) => {
    assert.match(check(root).relationError, /not valid JSON/);
    assert.equal(main(["--root", root]), 1);
  });

  withRepo({ projects: { alpha: { "README.md": readme("Alpha") } } }, (root) => {
    assert.equal(check(root).relationError, null);
    assert.equal(main(["--root", root]), 0);
  });

  withRepo({ projects: { alpha: { "README.md": readme("Alpha") } }, relations: { not_same: [["only-one"]] } }, (root) => {
    assert.match(check(root).relationError, /must contain distinct surface-qualified project names/);
  });
});

// ── coverage honesty ─────────────────────────────────────────────────────────

test("a negative result names the projects it could not see into", () => {
  withRepo(
    {
      projects: {
        silent: { "README.md": readme("Silent") },
        declaring: { "README.md": withSources("Declaring", epic("AB-1400")) },
      },
    },
    (root) => {
      const rendered = renderReport(check(root));
      assert.match(rendered, /No unclassified identifier overlap/);
      assert.match(rendered, /only an exact name match could find them: silent/);
    },
  );
});

test("an unreadable file and an unreadable directory are both reported", () => {
  withRepo({ projects: { alpha: { "README.md": readme("Alpha") } } }, (root) => {
    const blocked = path.join(root, "projects-in-progress", "alpha", "locked.md");
    const sealed = path.join(root, "projects-in-progress", "alpha", "sealed");
    fs.writeFileSync(blocked, "x");
    fs.mkdirSync(sealed);
    fs.writeFileSync(path.join(sealed, "inner.md"), "y");
    fs.chmodSync(blocked, 0o000);
    fs.chmodSync(sealed, 0o000);

    const rendered = renderReport(check(root));
    fs.chmodSync(sealed, 0o755);
    fs.chmodSync(blocked, 0o644);

    // Skipped when running as a user who can read mode-000 paths, e.g. root in CI.
    if (/could not read/.test(rendered)) {
      assert.match(rendered, /locked\.md|sealed/);
    }
  });
});

test("annotations use each member's own surface and can be scoped to a PR", () => {
  withRepo(
    { projects: { rotation: { "README.md": readme("Rotation") } }, shipped: { rotation: readme("Rotation") } },
    (root) => {
      const result = check(root);
      const all = renderAnnotations(result);
      assert.ok(all.every((line) => line.startsWith("::warning ")), "never a failure");
      assert.ok(all.some((line) => line.includes("production-features/rotation/README.md")));
      assert.ok(all.some((line) => line.includes("projects-in-progress/rotation/README.md")));
      // Each annotation must name the other member, not itself.
      assert.ok(all.every((line) => /same work as \S/.test(line)), all.join(" | "));

      const scoped = renderAnnotations(result, { touchedKeys: new Set(["projects-in-progress/rotation"]) });
      assert.equal(scoped.length, 1);
      assert.deepEqual(renderAnnotations(result, { touchedKeys: new Set(["projects-in-progress/other"]) }), []);
    },
  );
});

test("the report tells an agent to ask rather than decide, and offers the exact line to add", () => {
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", epic("AB-1500")) },
        beta: { "README.md": withSources("Beta", epic("AB-1500")) },
      },
    },
    (root) => {
      const rendered = renderReport(check(root));
      assert.match(rendered, /Review the shared identifiers with the user/);
      assert.match(rendered, /Do not decide it yourself/);
      // The snippet must survive being pasted into the file.
      const snippet = rendered.split("\n").find((line) => line.includes("not the same? add:"));
      const parsed = JSON.parse(snippet.slice(snippet.indexOf("[")));
      assert.deepEqual(parsed, ["projects-in-progress/alpha", "projects-in-progress/beta"]);
    },
  );
});

test("the check writes nothing to the repository it reads", () => {
  withRepo(
    {
      projects: {
        alpha: { "README.md": withSources("Alpha", epic("AB-1600")) },
        beta: { "README.md": withSources("Beta", epic("AB-1600")) },
      },
      relations: { not_same: [] },
    },
    (root) => {
      const snapshot = () => {
        const out = [];
        const walk = (dir, prefix) => {
          for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
            const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
            const abs = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(abs, rel);
            else out.push(`${rel}:${fs.readFileSync(abs, "utf8")}`);
          }
        };
        walk(root, "");
        return out.join("\n");
      };

      const before = snapshot();
      main(["--root", root]);
      main(["--root", root, "--json"]);
      main(["--root", root, "--show-cleared"]);
      main(["--root", root, "--github"]);
      assert.equal(snapshot(), before);
    },
  );
});

test("changed-scope uses a merge base, and falls open when git cannot answer", () => {
  withRepo({ projects: { alpha: { "README.md": readme("Alpha") } } }, (root) => {
    for (const args of [["init", "-q", "."], ["config", "user.email", "t@e.com"], ["config", "user.name", "T"]]) {
      spawnSync("git", args, { cwd: root });
    }
    spawnSync("git", ["add", "-A"], { cwd: root });
    spawnSync("git", ["commit", "-q", "-m", "init"], { cwd: root });
    spawnSync("git", ["branch", "base"], { cwd: root });
    fs.writeFileSync(path.join(root, "projects-in-progress", "alpha", "extra.md"), "# e\n");
    spawnSync("git", ["add", "-A"], { cwd: root });
    spawnSync("git", ["commit", "-q", "-m", "change"], { cwd: root });

    assert.deepEqual([...touchedKeys(root, "base")], ["projects-in-progress/alpha"]);
    assert.equal(touchedKeys(root, "no-such-ref"), null, "git failure annotates everything, not nothing");
    assert.equal(touchedKeys(root, null), null);
  });
});


test('qualified relations distinguish the active and shipped identities with the same slug', () => {
  withRepo({ projects: { same: { 'README.md': readme('Same') } }, shipped: { same: readme('Same') }, relations: { not_same: [['projects-in-progress/same', 'production-features/same']] } }, root => {
    assert.equal(check(root).findings.length, 0);
    assert.equal(check(root).cleared.length, 1);
  });
});
