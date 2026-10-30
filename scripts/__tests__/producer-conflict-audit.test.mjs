import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {buildProducerPlan, run, validateProducerStage1} from '../../skills-hub/hb-skills/hb-change-impact/scripts/producer-conflict-audit.mjs';
const target='skills-hub/hb-skills/example/SKILL.md';
function fixture(t) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'brain-producer-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const git=args=>{const r=spawnSync('git',args,{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);};
 git(['init','-b','main']);git(['config','user.name','Fixture']);git(['config','user.email','fixture@example.invalid']);
 const put=(file,text)=>{fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),text);};
 put(target,'# Example\nCreates a reusable reference.\n');put('governance/artifacts/artifact-write-boundary.md','# Owner\nShared knowledge has one maintained owner.\n');git(['add','.']);git(['commit','-m','Fixture']);
 return {root,put};
}
test('producer review completes two stages with cited conflict and cleans its session',t=>{
 const {root}=fixture(t);
 const prepared=run(['prepare',`--repo-root=${root}`,'--base=HEAD',`--target=${target}`]);
 t.after(()=>{if(fs.existsSync(prepared.session))run(['cancel',`--session=${prepared.session}`]);});
 const packet=JSON.parse(fs.readFileSync(prepared.packet_path,'utf8'));const existing=packet.writer_map.path;
 fs.writeFileSync(prepared.result_path,JSON.stringify({targets:[{path:target,producer:'yes',outputs:['reference'],evidence:[{path:target,start_line:1,end_line:2}]}],candidate_pairs:[{target_path:target,existing_path:existing,reason:'Possible duplicate truth'}],coverage_gaps:[]}));
 const advanced=run(['advance',`--session=${prepared.session}`]);assert.equal(advanced.status,'stage2-required');
 fs.writeFileSync(advanced.result_path,JSON.stringify({comparisons:[{target_path:target,existing_path:existing,verdict:'conflict',reason:'Competing maintained rule',recommendation:'Use the existing owner',evidence:[{path:target,start_line:1,end_line:2},{path:existing,start_line:1,end_line:2}]}],coverage_gaps:[]}));
 const result=run(['finalize',`--session=${prepared.session}`]);assert.equal(result.status,'needs-user');assert.equal(result.conflicts.length,1);assert.equal(fs.existsSync(prepared.session),false);
});
test('producer review requires external evidence gaps and rejects stale inputs',t=>{
 const {root,put}=fixture(t);const plan=buildProducerPlan({repoRoot:root,base:'HEAD',targets:[target],outputLabels:['Shared reference']});
 const answer={targets:[{path:target,producer:'yes',outputs:['Shared reference'],evidence:[{path:target,start_line:1,end_line:2}]}],candidate_pairs:[],coverage_gaps:[]};
 assert.ok(validateProducerStage1(answer,plan).some(x=>x.includes('Missing external evidence')));
 const prepared=run(['prepare',`--repo-root=${root}`,'--base=HEAD',`--target=${target}`]);
 t.after(()=>{if(fs.existsSync(prepared.session))run(['cancel',`--session=${prepared.session}`]);});
 put(target,'# Example\nChanged output responsibility.\n');
 assert.throws(()=>run(['advance',`--session=${prepared.session}`]),/input changed/);
});
test('existing shared scripts are eligible producer evidence without test fixtures',t=>{
 const {root,put}=fixture(t);put('scripts/other-writer.mjs','// Maintains the same reference\n');put('scripts/__tests__/other.test.mjs','// Test-only content\n');
 const plan=buildProducerPlan({repoRoot:root,base:'HEAD',targets:[target]});
 assert.ok(plan.packet.existing_artifact_paths.includes('scripts/other-writer.mjs'));
 assert.ok(!plan.packet.existing_artifact_paths.includes('scripts/__tests__/other.test.mjs'));
});
