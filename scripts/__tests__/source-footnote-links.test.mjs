import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateChangedSourceFootnoteLinks } from "../lib/markdown/footnotes.mjs";

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
