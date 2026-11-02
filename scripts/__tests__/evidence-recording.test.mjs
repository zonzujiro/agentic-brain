import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { observe } from '../hooks/evidence-observer.mjs';
import { recordSourceEvidence } from '../lib/source-evidence.mjs';
import { readEvidence } from '../lib/hooks/session.mjs';
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'brain-evidence-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;}
test('observer records success, error, partial coverage; never response content or secrets',t=>{const root=fixture(t);observe({tool_name:'WebFetch',tool_input:{url:'https://example.test/doc?token=private'},tool_response:{status:200,text:'confidential source',truncated:true}},root);const e=readEvidence(root);assert.equal(e[0].outcome,'ok');assert.equal(e[0].coverage.kind,'partial');assert.ok(!JSON.stringify(e).includes('private'));assert.ok(!JSON.stringify(e).includes('confidential'));observe({tool_name:'WebFetch',tool_input:{url:'https://example.test/doc'},tool_response:{isError:true}},root);assert.equal(readEvidence(root)[1].outcome,'error');});
test('missing response and unmapped connectors cannot establish successful observed reads',t=>{const root=fixture(t);observe({tool_name:'Read',tool_input:{file_path:path.join(root,'doc.md')}},root);assert.equal(readEvidence(root)[0].outcome,'unknown');assert.equal(observe({tool_name:'mcp__drive__read',tool_input:{id:'123'},tool_response:{}},root).sourceIdentified,false);});
test('recording failure is visible and symlink escapes refused',t=>{const root=fixture(t);fs.symlinkSync(os.tmpdir(),path.join(root,'.brain'));assert.throws(()=>recordSourceEvidence({rootDir:root,target:'https://example.test/doc',tool:'read-source',outcome:'ok'}),/recording failed/);});
