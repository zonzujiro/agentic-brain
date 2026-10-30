import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {discoverChangeImpact, isDurableBehaviorCandidate} from '../../skills-hub/hb-skills/hb-change-impact/scripts/discover-change-impact.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'brain-impact-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const put = (file, text) => { fs.mkdirSync(path.dirname(path.join(root, file)), {recursive: true}); fs.writeFileSync(path.join(root, file), text); };
  return {root, put};
}
test('impact discovery finds removed source consumers and exact references without claiming staleness', t => {
  const {root, put} = fixture(t);
  put('knowledge-hub/source.md', 'New claim');
  put('projects-in-progress/demo/README.md', 'See knowledge-hub/source.md');
  put('scripts/check.mjs', '// https://example.org/old-source');
  const result = discoverChangeImpact(root, ['knowledge-hub/source.md'], {baselineContentByPath: new Map([['knowledge-hub/source.md', 'https://example.org/old-source']])});
  assert.equal(result.changed[0].baselineAvailable, true);
  assert.deepEqual(result.candidates.map(x => x.path), ['projects-in-progress/demo/README.md', 'scripts/check.mjs']);
  assert.equal(result.candidates[0].reasons[0].kind, 'exact-path-reference');
  assert.equal(result.candidates[1].reasons[0].kind, 'shared-source-identifier');
  assert.equal(result.candidates[0].stale, undefined);
});
test('missing baseline stays visible and governance and shared scripts trigger durable review', t => {
  const {root, put} = fixture(t);
  put('governance/rule.md', 'Rule');
  const result = discoverChangeImpact(root, ['governance/rule.md'], {baselineContentByPath: new Map([['governance/rule.md', null]])});
  assert.equal(result.changed[0].baselineAvailable, false);
  assert.equal(result.changed[0].durableBehaviorCandidate, true);
  assert.equal(isDurableBehaviorCandidate('scripts/validate_repo.mjs'), true);
  assert.equal(isDurableBehaviorCandidate('knowledge-hub/reference.md'), false);
});
test('impact reads reject escaping paths and cannot inspect an external symlink target', t => {
  const {root, put} = fixture(t);
  const external = fs.mkdtempSync(path.join(os.tmpdir(), 'brain-external-'));
  t.after(() => fs.rmSync(external, {recursive: true, force: true}));
  fs.writeFileSync(path.join(external, 'private.md'), 'https://example.org/private');
  put('knowledge-hub/consumer.md', 'https://example.org/private');
  fs.symlinkSync(path.join(external, 'private.md'), path.join(root, 'knowledge-hub/link.md'));
  assert.throws(() => discoverChangeImpact(root, ['../private.md']), /inside the repository/);
  const result = discoverChangeImpact(root, ['knowledge-hub/link.md'], {baselineContentByPath: new Map([['knowledge-hub/link.md', null]])});
  assert.equal(result.changed[0].exists, false);
  assert.deepEqual(result.candidates, []);
});
