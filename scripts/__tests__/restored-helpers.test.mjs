import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {propagateRole} from '../propagate-local-role.mjs';
import {syncSkillIndexes} from '../sync_skill_indexes.mjs';
import {inspectIncidents} from '../check_quality_incidents.mjs';
import {artifactFormatViolation} from '../lib/hooks/surfaces.mjs';
import {validateSurfaces} from '../validate_surfaces.mjs';
import {hookConfiguration,installAgentHooks} from '../install-agent-hooks.mjs';
import {validateOwnership,parseSkillMetadata} from '../validate_skills_hub.mjs';
import {runTrial} from '../evals/run.mjs';
const temp=t=>{const p=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'brain-helpers-')));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p;};
test('role follows real worktree creation and existing preference stays intact',t=>{
 const base=temp(t),root=path.join(base,'repo'),work=path.join(base,'work');fs.mkdirSync(root);
 const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:'pipe',env:{...process.env,GIT_CONFIG_GLOBAL:'/dev/null',GIT_CONFIG_NOSYSTEM:'1'}});
 git('init');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-m','fixture');
 fs.writeFileSync(path.join(root,'AGENTS.local.md'),'Role: Creator\n');git('worktree','add','--detach',work);
 assert.equal(propagateRole(work),'copied');assert.equal(fs.readFileSync(path.join(work,'AGENTS.local.md'),'utf8'),'Role: Creator\n');
 fs.writeFileSync(path.join(work,'AGENTS.local.md'),'Role: Builder\n');assert.equal(propagateRole(work),'preserved');
 assert.equal(propagateRole(root),'main-checkout');
});
test('both discovery indexes are idempotent and custom entries are preserved',t=>{
 const root=temp(t),skill=path.join(root,'skills-hub/hb-skills/example');fs.mkdirSync(skill,{recursive:true});fs.writeFileSync(path.join(skill,'SKILL.md'),'fixture');
 assert.equal(syncSkillIndexes(root).length,2);assert.equal(fs.existsSync(path.join(root,'.agents')),false);
 syncSkillIndexes(root,{check:false});assert.deepEqual(syncSkillIndexes(root),[]);
 fs.writeFileSync(path.join(root,'.claude/skills/custom'),'preserve');assert.throws(()=>syncSkillIndexes(root,{check:false}),/custom/);
 assert.equal(fs.readFileSync(path.join(root,'.claude/skills/custom'),'utf8'),'preserve');
});
test('host configurations mount freshness and observation without granting trust',t=>{
 const root=temp(t);fs.mkdirSync(path.join(root,'scripts/hooks'),{recursive:true});fs.writeFileSync(path.join(root,'scripts/hooks/local-lifecycle.mjs'),'');
 const result=installAgentHooks(root,{host:'claude',install:true});assert.match(result.file,/settings.json$/);
 const config=hookConfiguration();assert.ok(JSON.stringify(config.hooks.PreToolUse).includes('brain-checkout-freshness'));assert.ok(JSON.stringify(config.hooks.PostToolUse).includes('evidence-observer'));
 assert.equal(installAgentHooks(root,{host:'claude',install:true}).status,'preserved');
});
test('format checks cover shell-created files and retain admitted mechanics',()=>{
 assert.ok(artifactFormatViolation('knowledge-hub/nested/result.json'));assert.ok(artifactFormatViolation('projects-in-progress/demo/run.py'));
 assert.equal(artifactFormatViolation('scripts/run.mjs'),null);assert.equal(artifactFormatViolation('governance/quality/evals/interaction/cases.json'),null);
});
test('project capsule cannot be replaced with fenced examples or empty headings',t=>{
 const root=temp(t),dir=path.join(root,'projects-in-progress/demo');fs.mkdirSync(dir,{recursive:true});const file=path.join(dir,'README.md');
 fs.writeFileSync(file,'# Demo\n```md\n## Scope and responsibilities\nOwned.\n## Boundaries and dependencies\nBounded.\n```\n');assert.equal(validateSurfaces(root).length,2);
 fs.writeFileSync(file,'# Demo\n## Scope and responsibilities\n\n## Boundaries and dependencies\nBounded.\n');assert.equal(validateSurfaces(root).length,1);
});
test('incident feedback is accepted even when repair evidence is absent',()=>{
 assert.ok(inspectIncidents('## Incident Records\n## 02.11.2026 - Example\n| Status | fixed |\n').some(s=>s.includes('repair verification')));
});
test('successful trial execution remains ungraded and grading key is not supplied',t=>{
 const root=temp(t);for(const f of ['AGENTS.md','README.md','ARCHITECTURE.md','governance','skills-hub','scripts'])fs.cpSync(path.resolve(f),path.join(root,f),{recursive:true});
 const result=runTrial(root,'blocked-source-keeps-conclusion-provisional','codex',{run:(_host,_args,opts)=>{assert.ok(!opts.input.includes('## Correct behavior'));return {status:0,stdout:'synthetic harness response',stderr:''};}});
 assert.equal(result.execution,'completed');assert.equal(result.grade,'ungraded');
 const record=JSON.parse(fs.readFileSync(result.file));fs.rmSync(record.workspace,{recursive:true,force:true});
});

test('ownership validation rejects hidden helpers exposed as public and incomplete writers',()=>{
 const fields=new Map([['metadata',JSON.stringify({brain:{ownership_class:'canonical-writer',user_invocation:'internal',governed_by:[],gate_profile:'invented'}})]]);
 const errors=validateOwnership(fields);for(const expected of ['writer map','final-writer','visibility','gate profile'])assert.ok(errors.some(e=>e.includes(expected)));
 const actual=parseSkillMetadata(fs.readFileSync('skills-hub/hb-skills/hb-add-decision/SKILL.md','utf8'));assert.deepEqual(validateOwnership(actual),[]);
});
test('post-checkout hook automatically copies the saved role into a new worktree',t=>{
 const base=temp(t),root=path.join(base,'repo'),work=path.join(base,'work');fs.mkdirSync(root);
 const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:'pipe',env:{...process.env,GIT_CONFIG_GLOBAL:'/dev/null',GIT_CONFIG_NOSYSTEM:'1'}});
 git('init');fs.mkdirSync(path.join(root,'scripts/githooks'),{recursive:true});
 fs.copyFileSync('scripts/githooks/post-checkout',path.join(root,'scripts/githooks/post-checkout'));fs.chmodSync(path.join(root,'scripts/githooks/post-checkout'),0o755);
 fs.copyFileSync('scripts/propagate-local-role.mjs',path.join(root,'scripts/propagate-local-role.mjs'));git('add','scripts');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','fixture');
 fs.writeFileSync(path.join(root,'AGENTS.local.md'),'Role: Creator\n');git('config','core.hooksPath','scripts/githooks');git('worktree','add','--detach',work);
 assert.equal(fs.readFileSync(path.join(work,'AGENTS.local.md'),'utf8'),'Role: Creator\n');
});
