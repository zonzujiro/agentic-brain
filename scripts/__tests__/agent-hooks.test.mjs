import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { handle } from '../hooks/local-lifecycle.mjs';
import { installAgentHooks } from '../install-agent-hooks.mjs';
import { report } from '../lib/hooks/engine.mjs';
import { validateRepository } from '../validate_repo.mjs';
function fixture(run) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'brain-hooks-')));
  fs.mkdirSync(path.join(root, '.git'));
  try { run(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
const event = (root, name, command) => ({ cwd: root, hook_event_name: name, tool_name: 'apply_patch', tool_input: { command } });
test('structured writes use root rules; deletion and moving an invalid path out remain possible', () => fixture(root => {
  const bad = handle(event(root, 'PreToolUse', '*** Begin Patch\n*** Add File: loose.md\n+x\n*** End Patch'), root);
  assert.equal(bad.hookSpecificOutput.permissionDecision, 'deny');
  assert.deepEqual(handle(event(root, 'PreToolUse', '*** Begin Patch\n*** Delete File: loose.md\n*** End Patch'), root), {});
  assert.deepEqual(handle(event(root, 'PreToolUse', '*** Begin Patch\n*** Update File: loose.md\n*** Move to: knowledge-hub/topic.md\n@@\n-x\n+y\n*** End Patch'), root), {});
}));
test('subdirectory-relative targets and symlink parents are handled in their actual location', () => fixture(root => {
  fs.mkdirSync(path.join(root, 'knowledge-hub'));
  const payload = event(path.join(root, 'knowledge-hub'), 'PreToolUse', '*** Add File: topic.md\n+x');
  assert.deepEqual(handle(payload, root), {});
  fs.symlinkSync(os.tmpdir(), path.join(root, 'knowledge-hub/linked'));
  const escaped = handle(event(root, 'PreToolUse', '*** Add File: knowledge-hub/linked/topic.md\n+x'), root);
  assert.match(escaped.hookSpecificOutput.permissionDecisionReason, /symlink/);
}));
test('post-write and repository validation share findings; Stop sees shell-created files without rewriting', () => fixture(root => {
  fs.writeFileSync(path.join(root, 'README.md'), '# Example\n\nClaim.[^missing]\n');
  const before = fs.readFileSync(path.join(root, 'README.md'));
  const shared = report(root, 'README.md');
  const post = handle(event(root, 'PostToolUse', '*** Update File: README.md\n@@\n+x'), root);
  assert.ok(post.hookSpecificOutput.additionalContext.includes(shared[0].message));
  assert.ok(validateRepository(root).some(e => e.includes(shared[0].message)));
  fs.writeFileSync(path.join(root, 'loose.md'), '# Shell-created\n');
  assert.match(handle(event(root, 'Stop'), root).reason, /loose.md/);
  assert.deepEqual(fs.readFileSync(path.join(root, 'README.md')), before);
}));
test('session guidance makes no evidence observation claim and wrong repositories are skipped', () => fixture(root => {
  assert.match(handle(event(root, 'SessionStart'), root).hookSpecificOutput.additionalContext, /do not observe connectors/);
  fixture(other => assert.match(handle(event(other, 'SessionStart'), root).systemMessage, /another repository/));
}));
test('host installer previews, requires an explicit write and preserves existing configuration', () => fixture(root => {
  fs.mkdirSync(path.join(root, 'scripts/hooks'), { recursive: true });
  fs.writeFileSync(path.join(root, 'scripts/hooks/local-lifecycle.mjs'), '// fixture');
  assert.equal(installAgentHooks(root).status, 'preview');
  assert.ok(!fs.existsSync(path.join(root, '.codex')));
  assert.equal(installAgentHooks(root, { install: true }).status, 'written-not-trusted');
  const file = path.join(root, '.codex/hooks.json'), before = fs.readFileSync(file);
  assert.equal(installAgentHooks(root, { install: true }).status, 'preserved');
  assert.deepEqual(fs.readFileSync(file), before);
}));

test('Stop requests one repair pass then exposes the remaining gap without another continuation', () => fixture(root => {
  fs.writeFileSync(path.join(root,'loose.md'),'# Unowned\n');
  const first=handle(event(root,'Stop'),root);
  assert.equal(first.decision,'block');
  const second=handle({...event(root,'Stop'),stop_hook_active:true},root);
  assert.equal(second.decision,undefined);
  assert.match(second.systemMessage,/unresolved/);
}));
test('authoring advisories remain distinct from structural failures and scoped linked gaps', () => fixture(root => {
  fs.mkdirSync(path.join(root,'knowledge-hub'));
  fs.writeFileSync(path.join(root,'knowledge-hub/source.md'),'# Source\n\n## Known\nSupported.\n\n## Unknown\n_Gap: missing observation._\n');
  fs.writeFileSync(path.join(root,'knowledge-hub/topic.md'),'# Topic\n\n[Known](source.md#known)\n\n## Empty\n');
  const findings=report(root,'knowledge-hub/topic.md');
  assert.ok(findings.some(f=>f.rule==='consumer-contract/empty-section' && f.severity==='advisory'));
  assert.ok(!findings.some(f=>f.rule==='consumer-contract/gap-consumption'));
  assert.deepEqual(validateRepository(root),[]);
  fs.writeFileSync(path.join(root,'knowledge-hub/topic.md'),'# Topic\n\n[Unknown](source.md#unknown)\n');
  assert.ok(report(root,'knowledge-hub/topic.md').some(f=>f.rule==='consumer-contract/gap-consumption'));
}));
