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
  fs.writeFileSync(path.join(root,'ARCHITECTURE.md'), '# Source\n');
  fs.writeFileSync(path.join(root,'README.md'), '[Evidence](ARCHITECTURE.md)\n');
  assert.deepEqual(validateRepository(root), []);
  fs.unlinkSync(path.join(root,'ARCHITECTURE.md'));
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

test('the actual two-file onboarding sandbox uses document checks without root-layout checks', async () => {
  const { validateDocumentSandbox } = await import('../validate_repo.mjs');
  fixture(root => {
    const source = path.resolve('skills-hub/hb-skills/hb-onboard/references/reading-list');
    fs.cpSync(source, root, { recursive: true });
    assert.deepEqual(validateDocumentSandbox(root), []);
    fs.unlinkSync(path.join(root, 'source.md'));
    assert.match(validateDocumentSandbox(root).join('\n'), /does not resolve/);
  });
});

test('minimal project contract needs a README without imposing company metadata', () => fixture(root => {
  fs.mkdirSync(path.join(root,'projects-in-progress/example'),{recursive:true});
  assert.match(validateRepository(root).join('\n'),/README unavailable/);
  fs.writeFileSync(path.join(root,'projects-in-progress/example/README.md'),'# Example\n\n## Scope and responsibilities\nOwns a reading list.\n\n## Boundaries and dependencies\nDoes not own reading sources.\n');
  assert.deepEqual(validateRepository(root),[]);
  fs.writeFileSync(path.join(root,'projects-in-progress/project-relations.json'),'null');
  assert.match(validateRepository(root).join('\n'),/expected an object/);
}));
