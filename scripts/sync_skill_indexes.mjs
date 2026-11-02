#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
export function syncSkillIndexes(root, { check = true } = {}) {
  const hub = path.join(root, 'skills-hub/hb-skills');
  const names = fs.readdirSync(hub).filter(name => fs.existsSync(path.join(hub, name, 'SKILL.md')));
  const changes = [], pending = [];
  for (const name of names) if (!fs.lstatSync(path.join(hub,name)).isDirectory() || fs.lstatSync(path.join(hub,name)).isSymbolicLink()) throw new Error('Canonical skill must be a regular directory');
  for (const host of ['.agents', '.claude']) {
    const directory = path.join(root, host, 'skills');
    for (const ancestor of [path.join(root, host), directory]) if (fs.existsSync(ancestor) && fs.lstatSync(ancestor).isSymbolicLink()) throw new Error('Refusing symlinked discovery directory');
    for (const name of names) {
      const dest = path.join(directory, name), target = `../../skills-hub/hb-skills/${name}`;
      let stat; try { stat = fs.lstatSync(dest); } catch (e) { if(e.code !== 'ENOENT') throw e; }
      if (stat && (!stat.isSymbolicLink() || fs.readlinkSync(dest) !== target)) throw new Error(`Preserve conflicting discovery entry: ${host}/skills/${name}`);
      if (!stat) { changes.push(`${host}/skills/${name}`); pending.push({directory,target,dest}); }
    }
    if (fs.existsSync(directory)) for (const name of fs.readdirSync(directory)) if (!names.includes(name)) throw new Error(`Review stale or custom discovery entry: ${host}/skills/${name}`);
  }
  if (!check) for (const {directory,target,dest} of pending) { fs.mkdirSync(directory,{recursive:true}); fs.symlinkSync(target,dest); }
  return changes;
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try { const args=process.argv.slice(2);if(args.some(a=>!['--check','--apply'].includes(a)))throw new Error('Use --check or --apply');const changes=syncSkillIndexes(process.cwd(),{check:!args.includes('--apply')});console.log(JSON.stringify({changes}));if(changes.length&&!args.includes('--apply'))process.exitCode=1; }
  catch(e){console.error(e.message);process.exitCode=1;}
}
