import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { checkDelivery, main, git } from '../delivery/check.mjs';
import { inspectDeliveryCommand } from '../hooks/pre-delivery.mjs';
import { validateProducerAuditAttestation } from '../delivery/producer-conflict-audit-guard.mjs';
function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'brain-delivery-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const args of [['init','-b','main'],['config','user.name','Fixture'],['config','user.email','fixture@example.invalid']]) git(root, args);
  const put = (file, content) => { fs.mkdirSync(path.dirname(path.join(root,file)), { recursive:true }); fs.writeFileSync(path.join(root,file),content); };
  put('README.md','# Fixture\n');
  put('projects-in-progress/example/README.md','# Example\nOwns a reading list.\n');
  put('governance/artifacts/artifact-write-boundary.md','# Owners\nSkill packages own workflows.\n');
  git(root,['add','.']);git(root,['commit','-m','base']);
  const base = git(root,['rev-parse','HEAD']);
  put('projects-in-progress/example/context.md','# Context\nA new independent claim.\n');
  put('skills-hub/hb-skills/example/SKILL.md','---\nname: example\ndescription: Example workflow.\n---\nMaintains a reference.\n');
  git(root,['add','.']);git(root,['commit','-m','head']);
  return { root, base, head:git(root,['rev-parse','HEAD']), put };
}
const bodyFor = plans => `## Quality Gates\nSemantic audit: completed\nAudit input: ${plans[0].audit_input}\nResult: No findings.\nProducer conflict audit: completed\nProducer audit input: ${plans[1].audit_input}\nProducer audit result: 0 conflict(s), 0 gap(s)\n`;
test('delivery checks both current commit inputs and rejects stale or hidden attestations', t => {
  const f = fixture(t);
  const missing = checkDelivery({ ...f, body:'' });
  assert.equal(missing.ok,false);
  const body=bodyFor(missing.plans);
  assert.equal(checkDelivery({ ...f, body }).ok,true);
  assert.equal(checkDelivery({ ...f, body: `<!--\n${body}\n-->` }).ok,false);
  assert.equal(checkDelivery({ ...f, body: '```\n'+body+'```' }).ok,false);
  f.put('projects-in-progress/example/context.md','# Context\nChanged after review.\n');
  git(f.root,['add','.']);git(f.root,['commit','-m','changed']);
  assert.throws(()=>checkDelivery({ ...f,body }),/HEAD differs/);
  assert.equal(checkDelivery({ ...f,head:git(f.root,['rev-parse','HEAD']),body }).ok,false);
});
test('CI refuses events for another repository before using their commits', t => {
  const f=fixture(t), file=path.join(f.root,'event.json');
  fs.writeFileSync(file,JSON.stringify({pull_request:{base:{repo:{full_name:'other/repo'},sha:f.base},head:{sha:f.head}}}));
  assert.throws(()=>main({env:{GITHUB_EVENT_PATH:file,GITHUB_REPOSITORY:'example/brain'}}),/another repository/);
});
test('bounded command parser rejects overrides and compound deliveries without executing them', () => {
  const payload=command=>({tool_name:'Bash',tool_input:{command}});
  assert.deepEqual(inspectDeliveryCommand(payload('git push')),{kind:'push'});
  for(const command of ['git -C /another push','git push origin main','git commit -am x && git push','gh pr create --title Example --body-file /tmp/body --base master','gh -R other/repo pr create --title Example --body-file /tmp/body']) assert.throws(()=>inspectDeliveryCommand(payload(command)));
  assert.equal(inspectDeliveryCommand(payload('node something.mjs')),null);
  assert.equal(inspectDeliveryCommand(payload('gh pr create --title Example --body-file /tmp/body --base main')).base,'main');
});
test('producer findings require a visible resolution and approving owner', () => {
  const planResult={status:'planned',audit_input:'sha256:'+'a'.repeat(64)};
  const body=`## Quality Gates\nProducer conflict audit: needs-user\nProducer audit input: ${planResult.audit_input}\nProducer audit result: 1 conflict(s), 0 gap(s)\n`;
  assert.equal(validateProducerAuditAttestation({planResult,prBody:body}).ok,false);
  assert.equal(validateProducerAuditAttestation({planResult,prBody:body+'Producer audit decision: Keep the existing owner.\nProducer audit approved by: Example owner\n'}).ok,true);
});

test('delivery rejects direct and wrapped workdir overrides instead of checking the session checkout', () => {
  assert.throws(()=>inspectDeliveryCommand({cwd:'/repo/a',tool_name:'Bash',tool_input:{cmd:'git push',workdir:'/repo/b'}}),/working-directory override/);
  assert.throws(()=>inspectDeliveryCommand({cwd:'/repo/a',tool_name:'functions.exec',tool_input:'await tools.exec_command({cmd: "git push", workdir: "/repo/b"})'}),/working-directory override/);
});
