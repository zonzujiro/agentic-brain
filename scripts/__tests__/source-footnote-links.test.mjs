import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateChangedSourceFootnoteLinks } from "../lib/markdown/footnotes.mjs";
import { report } from "../lib/hooks/engine.mjs";

// Exercise the migrated shared engine rather than the retired rule module.
function sourceFootnoteLinkRule({ root, file, content }) {
  return report(root, file, { content }).filter(entry => entry.rule === "grounding/local-link");
}

function withFixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "brain-footnote-links-"));
  try {
    const doc = "projects-in-progress/demo/engineering/rfc-demo.md";
    const source = path.join(root, "projects-in-progress/demo/sources/revert/PromptBox.tsx");
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.writeFileSync(source, "export function PromptBox() {}\n");
    run({ root, doc });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

const plainPath = "Behavior changed.[^revert]\n\n[^revert]: `../sources/revert/PromptBox.tsx` supports this.";

test("new plain-path source footnote is flagged", () => withFixture(({ root, doc }) => {
  const errors = validateChangedSourceFootnoteLinks(plainPath, { filePath: doc, repoRoot: root });
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /without a link to that source/);
}));

test("a document-relative source link resolves", () => withFixture(({ root, doc }) => {
  const linked = "Behavior changed.[^revert]\n\n[^revert]: [PromptBox source](../sources/revert/PromptBox.tsx) supports this.";
  assert.deepEqual(validateChangedSourceFootnoteLinks(linked, { filePath: doc, repoRoot: root }), []);
}));

test("broken and escaping source links are flagged", () => withFixture(({ root, doc }) => {
  const broken = "Behavior changed.[^revert]\n\n[^revert]: [source](../sources/revert/Missing.tsx).";
  const escaping = "Behavior changed.[^revert]\n\n[^revert]: [source](../../../../outside.tsx).";
  assert.match(validateChangedSourceFootnoteLinks(broken, { filePath: doc, repoRoot: root })[0].message, /does not resolve/);
  assert.match(validateChangedSourceFootnoteLinks(escaping, { filePath: doc, repoRoot: root })[0].message, /leaves the repository/);
}));

test("unchanged legacy definitions are not rechecked", () => withFixture(({ root, doc }) => {
  const changedBody = `${plainPath}\n\nAn unrelated section changed.`;
  assert.deepEqual(validateChangedSourceFootnoteLinks(changedBody, {
    baselineMarkdown: plainPath,
    filePath: doc,
    repoRoot: root,
  }), []);
}));

test("a direct source link needs no footnote", () => withFixture(({ root, doc }) => {
  const direct = "[PromptBox source](../sources/revert/PromptBox.tsx) supports this.";
  assert.deepEqual(validateChangedSourceFootnoteLinks(direct, { filePath: doc, repoRoot: root }), []);
}));

for (const doc of [
  "projects-in-progress/demo/README.md",
  "projects-in-progress/demo/artifacts/project-brief-demo.md",
  "projects-in-progress/demo/artifacts/product/product-spec-demo.md",
  "projects-in-progress/demo/quality/test-plan.md",
  "projects-in-progress/demo/quality/e2e-plan/plan.md",
  "projects-in-progress/demo/analytics/bi-requirements.md",
  "projects-in-progress/demo/artifacts/handoff/handoff-demo.md",
  "production-features/demo/README.md",
  "production-features/demo/feature-knowledge.md",
  "knowledge-hub/product/demo.md",
  "knowledge-hub/ux/demo.md",
  "knowledge-hub/ba/demo.md",
]) {
  test(`direct support and contextual notes work for ${doc}`, () => withFixture(({ root }) => {
    const direct = "The feature uses [the inspected source](https://example.test/source).";
    const contextual = `${direct}[^scope]\n\n[^scope]: Observed only for the tested account.`;
    const missingLink = "The feature changed.[^source]\n\n[^source]: `PromptBox.tsx` shows the behavior.";
    for (const content of [direct, contextual]) {
      assert.deepEqual(sourceFootnoteLinkRule({
        root, file: doc, content, baselineContent: "# Earlier document\n",
      }), []);
    }
    const findings = sourceFootnoteLinkRule({
      root, file: doc, content: missingLink, baselineContent: "# Earlier document\n",
    });
    assert.equal(findings.length, 1);
    assert.equal(findings[0].rule, "grounding/local-link");
  }));
}


test("shared hook engine reports a newly written plain-path footnote", () => withFixture(({ root, doc }) => {
  const findings = sourceFootnoteLinkRule({
    root,
    file: doc,
    content: plainPath,
    baselineContent: "# Earlier RFC\n",
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "grounding/local-link");
  assert.equal(findings[0].line, 3);
}));


test("a statement-level source link can carry a contextual footnote", () => withFixture(({ root, doc }) => {
  const linkedStatement = "[PromptBox source](../sources/revert/PromptBox.tsx) supports this.[^revert]\n\n[^revert]: `PromptBox.tsx` was inspected only for the collapse branch.";
  assert.deepEqual(validateChangedSourceFootnoteLinks(linkedStatement, { filePath: doc, repoRoot: root }), []);
}));


test("the mounted hook engine reports the citation without session telemetry", () => withFixture(({ root, doc }) => {
  const findings = report(root, doc, {
    content: plainPath,
    baselineContent: "# Earlier RFC\n",
    evidence: null,
  });
  assert.equal(findings.filter((entry) => entry.rule === "grounding/local-link").length, 1);
}));

test("a symlink cannot make an outside file count as an in-repo source", () => withFixture(({ root, doc }) => {
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "brain-outside-source-"));
  try {
    fs.writeFileSync(path.join(outside, "source.tsx"), "export const source = true;\n");
    fs.symlinkSync(path.join(outside, "source.tsx"), path.join(root, "projects-in-progress/demo/sources/revert/linked.tsx"));
    const linked = "Behavior.[^source]\n\n[^source]: [source](../sources/revert/linked.tsx).";
    assert.match(validateChangedSourceFootnoteLinks(linked, { filePath: doc, repoRoot: root })[0].message, /outside the repository/);
  } finally {
    fs.rmSync(outside, { recursive: true, force: true });
  }
}));


test("an unrelated link does not support a named source path", () => withFixture(({ root, doc }) => {
  const unrelated = "Behavior.[^revert]\n\n[^revert]: [Decision](#decision) and `../sources/revert/PromptBox.tsx`.";
  assert.match(validateChangedSourceFootnoteLinks(unrelated, { filePath: doc, repoRoot: root })[0].message, /without a link/);
}));

test("plain prose paths and non-code sources need links", () => withFixture(({ root, doc }) => {
  const prose = "Behavior.[^source]\n\n[^source]: The source is sources/revert/report.pdf and data/events.csv.";
  const messages = validateChangedSourceFootnoteLinks(prose, { filePath: doc, repoRoot: root }).map((entry) => entry.message);
  assert.equal(messages.length, 2);
  assert.ok(messages.every((message) => /without a link/.test(message)));
}));

test("broken direct links and reused links in changed claims are checked", () => withFixture(({ root, doc }) => {
  const direct = "[Source](../sources/revert/Missing.tsx) changed behavior.";
  assert.match(validateChangedSourceFootnoteLinks(direct, { filePath: doc, repoRoot: root })[0].message, /does not resolve/);
  const baseline = "Old wording.[^source]\n\n[^source]: [source](../sources/revert/Missing.tsx).";
  const updated = baseline.replace("Old wording", "New wording");
  assert.match(validateChangedSourceFootnoteLinks(updated, {
    baselineMarkdown: baseline, filePath: doc, repoRoot: root,
  })[0].message, /does not resolve/);
}));

test("a source link and footnote marker may occupy different lines of a paragraph", () => withFixture(({ root, doc }) => {
  const wrapped = "[PromptBox source](../sources/revert/PromptBox.tsx) supports this\nstatement.[^source]\n\n[^source]: `PromptBox.tsx` was inspected for this branch.";
  assert.deepEqual(validateChangedSourceFootnoteLinks(wrapped, { filePath: doc, repoRoot: root }), []);
}));

test("a broken multiline footnote link yields one finding", () => withFixture(({ root, doc }) => {
  const multiline = "Behavior.[^source]\n\n[^source]:\n    [source](../sources/revert/Missing.tsx).";
  const findings = report(root, doc, {
    content: multiline,
    baselineContent: "# Earlier RFC\n",
    evidence: null,
  }).filter((entry) => entry.rule === "grounding/local-link");
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /does not resolve/);
}));

test("a reused unchanged direct link is checked when its paragraph changes", () => withFixture(({ root, doc }) => {
  const baseline = "[Source](../sources/revert/Missing.tsx)\nOld material claim.";
  const updated = baseline.replace("Old material claim", "New material claim");
  const findings = validateChangedSourceFootnoteLinks(updated, {
    baselineMarkdown: baseline, filePath: doc, repoRoot: root,
  });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /does not resolve/);
}));

test("a duplicated old link in a new paragraph is checked", () => withFixture(({ root, doc }) => {
  const baseline = "[Source](../sources/revert/Missing.tsx)\n\nEarlier context.";
  const updated = `${baseline}\n\n[Source](../sources/revert/Missing.tsx)`;
  const findings = validateChangedSourceFootnoteLinks(updated, {
    baselineMarkdown: baseline, filePath: doc, repoRoot: root,
  });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /does not resolve/);
}));

test("a backticked claim subject is not treated as a source path", () => withFixture(({ root, doc }) => {
  const claim = "The file is absent.[^ticket]\n\n[^ticket]: [Ticket](https://example.test/T-1) reports that `output.json` is absent.";
  assert.deepEqual(validateChangedSourceFootnoteLinks(claim, { filePath: doc, repoRoot: root }), []);
}));

test("reference-style Markdown source links resolve", () => withFixture(({ root, doc }) => {
  const claim = "Behavior.[^source]\n\n[^source]: `../sources/revert/PromptBox.tsx` is [implementation][impl].\n\n[impl]: ../sources/revert/PromptBox.tsx";
  assert.deepEqual(validateChangedSourceFootnoteLinks(claim, { filePath: doc, repoRoot: root }), []);
}));

test("a footnote continuation after a blank line is checked once", () => withFixture(({ root, doc }) => {
  const multiline = "Behavior.[^source]\n\n[^source]: Context.\n\n    [source](../sources/revert/Missing.tsx).";
  const findings = report(root, doc, {
    content: multiline,
    baselineContent: "# Earlier RFC\n",
    evidence: null,
  }).filter((entry) => entry.rule === "grounding/local-link");
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /does not resolve/);
}));

test("a basename that identifies the source still requires a link", () => withFixture(({ root, doc }) => {
  const claim = "Collapse changed.[^source]\n\n[^source]: `PromptBox.tsx` shows the collapse branch.";
  assert.match(validateChangedSourceFootnoteLinks(claim, { filePath: doc, repoRoot: root })[0].message, /without a link/);
}));

test("reference definitions inside fenced examples are ignored", () => withFixture(({ root, doc }) => {
  const example = "```md\n[source]: ../sources/revert/Missing.tsx\nUse [example][source]\n```";
  assert.deepEqual(validateChangedSourceFootnoteLinks(example, { filePath: doc, repoRoot: root }), []);
}));


test("a cited ticket may discuss a filename as the claim subject", () => withFixture(({ root, doc }) => {
  const claim = "The key is absent.[^ticket]\n\n[^ticket]: [Ticket](https://example.test/T-1) reports the key is absent in `output.json`.";
  assert.deepEqual(validateChangedSourceFootnoteLinks(claim, { filePath: doc, repoRoot: root }), []);
}));
