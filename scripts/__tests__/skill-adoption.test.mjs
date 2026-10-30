import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { adopt } from '../../skills-hub/hb-skills/hb-adopt-skill/scripts/adopt_skills.mjs';
import { parseSkillMetadata, validateSkillsHub } from '../validate_skills_hub.mjs';
import { rootPathViolation } from '../lib/hooks/surfaces.mjs';
function fixture(run) {
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'brain-adopt-')));
  const source = path.join(base, 'hb-example'), root = path.join(base, 'repo');
  fs.mkdirSync(source);
  fs.mkdirSync(path.join(root, 'skills-hub/hb-skills'), { recursive: true });
  fs.mkdirSync(path.join(root, '.agents/skills'), { recursive: true });
  fs.writeFileSync(path.join(source, 'SKILL.md'), '---\nname: hb-example\ndescription: |\n  Read an example when requested.\nmetadata:\n  version: 1\n---\n# Example\nKeep its source unchanged.\n');
  try { run({ base, source, root }); } finally { fs.rmSync(base, { recursive: true, force: true }); }
}
test('preview is read-only; apply preserves bytes and explicitly links a discoverable package', () => fixture(({ source, root }) => {
  const preview = adopt({ source, root, link: true });
  assert.equal(preview.status, 'preview');
  assert.equal(fs.readdirSync(path.join(root, 'skills-hub/hb-skills')).length, 0);
  const result = adopt({ source, root, apply: true, link: true, expectedDigest: preview.digest });
  assert.equal(result.status, 'imported');
  assert.deepEqual(fs.readFileSync(path.join(root, result.target, 'SKILL.md')), fs.readFileSync(path.join(source, 'SKILL.md')));
  assert.deepEqual(validateSkillsHub(root), []);
  assert.throws(() => adopt({ source, root }), /already exists/);
}));
test('unlinked adoption leaves the host index unchanged and reports missing discovery', () => fixture(({ source, root }) => {
  const preview = adopt({ source, root });
  adopt({ source, root, apply: true, expectedDigest: preview.digest });
  assert.deepEqual(fs.readdirSync(path.join(root, '.agents/skills')), []);
  assert.match(validateSkillsHub(root).join('\n'), /missing discovery/);
}));
test('changed source cannot be applied with an old review digest', () => fixture(({ source, root }) => {
  const preview = adopt({ source, root });
  fs.appendFileSync(path.join(source, 'SKILL.md'), '\nChanged instructions.\n');
  assert.throws(() => adopt({ source, root, apply: true, expectedDigest: preview.digest }), /differs/);
  assert.deepEqual(fs.readdirSync(path.join(root, 'skills-hub/hb-skills')), []);
}));
test('existing and broken discovery entries survive a refused import', () => fixture(({ source, root }) => {
  const link = path.join(root, '.agents/skills/hb-example');
  fs.symlinkSync('missing', link);
  assert.throws(() => adopt({ source, root, link: true }), /already exists/);
  assert.equal(fs.readlinkSync(link), 'missing');
}));
test('symlinks, hidden machinery and malformed metadata are refused before copying', () => fixture(({ source, root, base }) => {
  fs.symlinkSync(base, path.join(source, 'escape'));
  assert.throws(() => adopt({ source, root }), /regular files/);
  fs.unlinkSync(path.join(source, 'escape'));
  fs.writeFileSync(path.join(source, '.env'), 'not a real secret');
  assert.throws(() => adopt({ source, root }), /local machinery/);
  assert.deepEqual(fs.readdirSync(path.join(root, 'skills-hub/hb-skills')), []);
  for (const text of ['---\nname: x\nname: y\ndescription: ok\n---\nBody', '---\nname: x\ndescription: |\n---\nBody']) {
    assert.throws(() => parseSkillMetadata(text), /duplicate|missing description/);
  }
}));
test('root rules reject unknown surfaces and traversal without importing a format blacklist', () => {
  for (const file of ['../README.md', '/README.md', 'unknown/file.md', 'loose.md']) assert.ok(rootPathViolation(file));
  for (const file of ['README.md', 'scripts/local.mjs', 'projects-in-progress/example/context.json']) assert.equal(rootPathViolation(file), null);
});

test('reviewed mode survives umask and source-root symlinks are refused', () => fixture(({ source, root, base }) => {
  const helper = path.join(source, 'helper.txt');
  fs.writeFileSync(helper, 'example'); fs.chmodSync(helper, 0o775);
  const preview = adopt({ source, root });
  adopt({ source, root, apply: true, expectedDigest: preview.digest });
  assert.equal(fs.statSync(path.join(root, preview.target, 'helper.txt')).mode & 0o777, 0o775);
  const alias = path.join(base, 'alias'); fs.symlinkSync(source, alias);
  assert.throws(() => adopt({ source: alias, root }), /symlink/);
}));
