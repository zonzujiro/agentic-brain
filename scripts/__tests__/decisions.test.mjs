import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validateDecisionRecord, validateDecisions} from '../validate_decisions.mjs';
import {buildDecisionCatalog} from '../decision/decision-catalog.mjs';
import {normalizeRepoDate} from '../lib/repo-date.mjs';
import {parseFrontmatter} from '../lib/markdown/frontmatter.mjs';
const record = (slug, extra = '', body = 'No choice has been made.') => `---\nid: DEC-${slug}\ndate: 30.10.2026\nsummary: The choice remains open.\nparticipants:\n  - Example Owner\n${extra}---\n# Example\n\n## Decision\n\n${body}\n`;
const validate = (s) => validateDecisionRecord({markdown: s, filePath: 'projects-in-progress/example/decisions/storage.md'});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'brain-decisions-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const project = path.join(root, 'projects-in-progress/example');
  fs.mkdirSync(path.join(project, 'decisions'), {recursive: true});
  return {root, project, put: (name, s) => fs.writeFileSync(path.join(project, 'decisions', name+'.md'), s)};
}
test('an unresolved Decision is valid without lifecycle fields or affected documents', () => {
  assert.deepEqual(validate(record('storage')), []);
  assert.ok(validate(record('storage', 'status: approved\n')).some(x => x.includes('obsolete')));
});
test('decision parser preserves block lists and affected objects with normalized line endings', () => {
  const s = record('storage', 'affected_docs:\n  - path: README.md\n    status: blocked\n    note: Missing owner confirmation.\n');
  const meta = parseFrontmatter('\uFEFF'+s.replaceAll('\n','\r\n'));
  assert.deepEqual(meta.participants, ['Example Owner']);
  assert.equal(meta.affected_docs[0].status, 'blocked');
  assert.equal(meta.affected_docs[0].note, 'Missing owner confirmation.');
});
test('invalid dates, incomplete participant identity and duplicate sections fail', () => {
  assert.equal(normalizeRepoDate('29.02.2024'), '29.02.2024');
  for (const value of ['29.02.2025','31.04.2026','30/10/2026','00.10.2026']) assert.equal(normalizeRepoDate(value), null);
  assert.ok(validate(record('storage').replace('  - Example Owner','  - ""')).some(x => x.includes('participants')));
  assert.ok(validate(record('storage')+'\n## Decision\nSecond answer').some(x => x.includes('exactly one')));
});
test('impact metadata rejects escaping paths, duplicate targets and false completion dates', () => {
  const extra = 'affected_docs:\n  - path: ../outside.md\n    status: blocked\n    resolved_at: 30.10.2026\n  - path: ../outside.md\n    status: pending\n';
  const errors = validate(record('storage', extra));
  assert.ok(errors.some(x => x.includes('safe repo-relative')));
  assert.ok(errors.some(x => x.includes('duplicates')));
  assert.ok(errors.some(x => x.includes('must not carry')));
});
test('supersession validates both files and catalog derives reverse relationships', t => {
  const {root, project, put} = fixture(t);
  put('old', record('old')+'\n## Supersession\nReplaced by DEC-new.\n');
  put('new', record('new', 'supersedes:\n  - DEC-old\n'));
  assert.deepEqual(validateDecisions(root), []);
  const catalog = buildDecisionCatalog(project);
  assert.deepEqual(catalog.find(x => x.id==='DEC-old').relationships.superseded_by, ['DEC-new']);
  put('old', record('old'));
  assert.ok(validateDecisions(root).some(x => x.includes('must name DEC-new')));
});
test('missing lineage and cycles cannot validate', t => {
  const {root, put} = fixture(t);
  put('a', record('a', 'supersedes:\n  - DEC-b\n')+'\n## Supersession\nDEC-b\n');
  assert.ok(validateDecisions(root).some(x => x.includes('missing Decision')));
  put('b', record('b', 'supersedes:\n  - DEC-a\n')+'\n## Supersession\nDEC-a\n');
  assert.ok(validateDecisions(root).some(x => x.includes('cycle')));
});
test('unsupported metadata scalar styles fail rather than losing retrieval text', () => {
  assert.ok(validate(record('storage').replace('summary: The choice remains open.', 'summary: |\n  The choice remains open.')).some(x => x.includes('unsupported metadata syntax')));
  assert.ok(validate(record('storage', 'summary: Different answer\n')).some(x => x.includes('duplicate metadata')));
});
test('project catalog shows reverse supersession from another project', t => {
  const {root, project, put} = fixture(t);
  put('old', record('old')+'\n## Supersession\nReplaced by DEC-new.\n');
  const other = path.join(root, 'projects-in-progress/other/decisions');
  fs.mkdirSync(other, {recursive: true});
  fs.writeFileSync(path.join(other, 'new.md'), record('new', 'supersedes:\n  - DEC-old\n'));
  assert.deepEqual(validateDecisions(root), []);
  assert.deepEqual(buildDecisionCatalog(project)[0].relationships.superseded_by, ['DEC-new']);
});
