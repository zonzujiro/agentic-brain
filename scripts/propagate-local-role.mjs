#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
export function propagateRole(root) {
  const run = args => spawnSync('git',args,{cwd:root,encoding:'utf8'});
  if (!fs.lstatSync(path.join(root,'.git')).isFile()) return 'main-checkout';
  const result=run(['rev-parse','--path-format=absolute','--git-common-dir']);if(result.status!==0)throw new Error('Cannot resolve common checkout');
  const source=path.join(path.dirname(result.stdout.trim()),'AGENTS.local.md'),target=path.join(root,'AGENTS.local.md');
  try { fs.lstatSync(target);return 'preserved'; } catch(e){if(e.code!=='ENOENT')throw e;}
  if(!fs.existsSync(source))return 'no-preference';
  if(!fs.lstatSync(source).isFile())throw new Error('Role source must be a regular file');
  const text=fs.readFileSync(source,'utf8');if(!/^Role: (Creator|Builder)$/m.test(text))throw new Error('Invalid saved role; copy refused');
  fs.writeFileSync(target,text,{flag:'wx',mode:0o600});return 'copied';
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{console.log(propagateRole(process.cwd()));}catch(e){console.error(e.message);process.exitCode=1;}}
