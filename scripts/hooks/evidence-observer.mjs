#!/usr/bin/env node
// Adapted source PostToolUse observer: access metadata, never source content.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { repoRoot, relativeInRepo } from './lib/adapter.mjs';
import { recordSourceEvidence } from '../lib/source-evidence.mjs';
import { SOURCE_ACCESS_TOOL_PATTERN } from '../lib/hooks/session.mjs';
export function observe(payload, root) {
  const tool = payload?.tool_name ?? '';
  if (!SOURCE_ACCESS_TOOL_PATTERN.test(tool)) return { recorded: false, reason: 'not-source-tool' };
  const input = payload.tool_input ?? {}, response = payload.tool_response;
  let target = input.url;
  if (!target && typeof input.file_path === 'string') target = relativeInRepo(root,input.file_path,payload.cwd ?? root);
  if (!target) { const entry=recordSourceEvidence({rootDir:root,tool,target:`tool:${tool}`,outcome:'unknown',coverage:{kind:'unmapped'},sessionId:payload.session_id}); return {recorded:true,sourceIdentified:false,reason:'source-identity-unavailable',entry}; }
  if (target.includes('://')) {
    const url = new URL(target);
    if (!['https:', 'http:'].includes(url.protocol)) return { recorded:false, reason:'unsupported-source-identity' };
    url.username='';url.password='';
    for (const key of [...url.searchParams.keys()]) if (/token|key|secret|auth|signature|credential/i.test(key)) url.searchParams.delete(key);
    target=url.href;
  }
  const status=response?.status ?? response?.status_code;
  const failed=payload.hook_event_name==='PostToolUseFailure' || response?.isError===true || response?.is_error===true || (Number.isInteger(status)&&status>=400);
  const outcome=[401,403].includes(status)?'blocked':failed?'error':(response?.isError===false || (Number.isInteger(status)&&status>=200&&status<300))?'ok':'unknown';
  const coverage={kind: /search|list/i.test(tool)?'discovery': input.offset || input.limit || response?.truncated || response?.has_more ? 'partial' : 'unspecified'};
  const entry=recordSourceEvidence({rootDir:root,tool,target,outcome,status,coverage,sessionId:payload.session_id});
  return {recorded:true,entry};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try { const payload=JSON.parse(fs.readFileSync(0,'utf8'));const root=repoRoot(payload); const expected=fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')); if(fs.realpathSync(root)!==expected) throw new Error('Event belongs to another repository'); const result=observe(payload,root);if(result.sourceIdentified===false || (!result.recorded&&result.reason!=='not-source-tool'))console.log(JSON.stringify({systemMessage:`Source access not recorded: ${result.reason}. Do not claim observed access.`})); }
  catch(e){console.error(`Evidence recording failed: ${e.message}`);process.exitCode=1;}
}
