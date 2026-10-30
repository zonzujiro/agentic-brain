#!/usr/bin/env node
// Adapted from source adoption discovery/copy mechanics. No renaming, metadata
// stripping, script execution or implicit host installation.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateSkillPackage, parseSkillMetadata } from '../../../../scripts/validate_skills_hub.mjs';

function safeDirectory(dir) {
  let current = path.resolve(dir);
  while (true) {
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`symlink ancestor: ${current}`);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  if (!fs.statSync(dir).isDirectory()) throw new Error(`not a directory: ${dir}`);
}
function exists(file) {
  try { fs.lstatSync(file); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}
export function inspectPackage(source) {
  if (fs.lstatSync(source).isSymbolicLink()) throw new Error("source package must not be a symlink");
  source = fs.realpathSync(source);
  const errors = validateSkillPackage(source);
  if (errors.length) throw new Error(errors.join('\n'));
  const files = [];
  function walk(dir, relative = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.name.startsWith('.') || entry.name === 'node_modules') throw new Error(`unreviewed local machinery: ${name}`);
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(absolute, name);
      else if (entry.isFile()) files.push({ name, bytes: fs.readFileSync(absolute), mode: fs.statSync(absolute).mode & 0o777 });
      else throw new Error(`unsupported package entry: ${name}`);
    }
  }
  walk(source);
  const digest = crypto.createHash('sha256');
  for (const file of files) digest.update(JSON.stringify([file.name, file.mode, file.bytes.length])).update(file.bytes);
  const name = parseSkillMetadata(files.find(f => f.name === 'SKILL.md').bytes.toString('utf8')).get('name');
  return { name, digest: digest.digest('hex'), files };
}
export function adopt({ source, root, apply = false, expectedDigest, link = false }) {
  const packet = inspectPackage(source);
  root = fs.realpathSync(root);
  const hub = path.join(root, 'skills-hub/hb-skills');
  safeDirectory(hub);
  const target = path.join(hub, packet.name);
  if (exists(target)) throw new Error(`target already exists: ${target}`);
  const index = path.join(root, '.agents/skills');
  const discovery = path.join(index, packet.name);
  if (link) {
    safeDirectory(index);
    if (exists(discovery)) throw new Error(`discovery entry already exists: ${discovery}`);
  }
  const result = { name: packet.name, target: path.relative(root, target), digest: packet.digest,
    files: packet.files.map(f => f.name), discovery: link ? 'explicit relative link requested' : 'not installed',
    status: apply ? 'imported' : 'preview' };
  if (!apply) return result;
  if (expectedDigest !== packet.digest) throw new Error('package differs from the reviewed digest; preview and review again');
  // mkdir is exclusive: an existing target is never replaced. On copy failure,
  // remove only the target created by this call; discovery is created last.
  fs.mkdirSync(target);
  try {
    for (const file of packet.files) {
      const dest = path.join(target, file.name);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, file.bytes, { flag: 'wx', mode: file.mode });
      fs.chmodSync(dest, file.mode);
    }
    if (link) fs.symlinkSync(path.relative(index, target), discovery, 'dir');
  } catch (error) {
    fs.rmSync(target, { recursive: true, force: true });
    throw error;
  }
  return result;
}
export function main(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === '--apply') args.apply = true;
    else if (flag === '--link') args.link = true;
    else if (['--source', '--root', '--expected-digest'].includes(flag)) {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`missing value for ${flag}`);
      args[flag === '--expected-digest' ? 'expectedDigest' : flag.slice(2)] = argv[++i];
    } else throw new Error(`unknown argument: ${flag}`);
  }
  if (!args.source) throw new Error('--source must name one reviewed package folder');
  args.root ??= path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
  console.log(JSON.stringify(adopt(args), null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
