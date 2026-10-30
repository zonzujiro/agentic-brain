import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateRepository } from '../validate_repo.mjs';
import { validateFootnotes } from '../lib/markdown/footnotes.mjs';

function fixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agentic-brain-test-'));
  try { run(root); } finally { fs.rmSync(root, {recursive:true, force:true}); }
}
test('repository check accepts supported source links and rejects missing targets', () => fixture(root => {
  fs.writeFileSync(path.join(root,'source.md'), '# Source\n');
  fs.writeFileSync(path.join(root,'README.md'), '[Evidence](source.md)\n');
  assert.deepEqual(validateRepository(root), []);
  fs.unlinkSync(path.join(root,'source.md'));
  assert.match(validateRepository(root).join('\n'), /does not resolve/);
}));
test('repository check rejects private package markers', () => fixture(root => {
  fs.writeFileSync(path.join(root,'package.json'), JSON.stringify({dependencies:{['@'+'wix'+'/private-package']:'1'}}));
  assert.match(validateRepository(root).join('\n'), /private integration/);
}));
test('source footnotes distinguish valid, missing and unreferenced support', () => {
  assert.deepEqual(validateFootnotes('Claim.[^a]\n\n[^a]: Scoped evidence.'), []);
  assert.match(validateFootnotes('Claim.[^a]').join(' '), /Missing footnote/);
  assert.match(validateFootnotes('[^a]: Unused evidence.').join(' '), /Unreferenced/);
});
test('local evidence links cannot escape through a symlink', () => fixture(root => {
  fs.symlinkSync(os.tmpdir(), path.join(root,'outside'));
  fs.writeFileSync(path.join(root,'README.md'), '[outside](outside/)\n');
  assert.match(validateRepository(root).join('\n'), /outside the repository|leaves repository/);
}));
