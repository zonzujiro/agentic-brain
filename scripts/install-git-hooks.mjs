#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

export function installGitHooks(root, {install = false, env = process.env} = {}) {
  const git = args => spawnSync('git', args, {cwd: root, encoding: 'utf8', env});
  const top = git(['rev-parse', '--show-toplevel']);
  if (top.status !== 0) throw new Error('Not a Git checkout');
  root = top.stdout.trim();
  const config = git(['config', '--get', 'core.hooksPath']);
  if (config.status !== 0 && config.status !== 1) throw new Error(config.stderr || 'Cannot inspect hook configuration');
  const previous = config.status === 0 ? config.stdout.trim() : null;
  if (previous !== null && previous !== 'scripts/githooks') return {status: 'preserved', previous, changed: false};
  const dirResult = git(['rev-parse', '--git-path', 'hooks']);
  if (dirResult.status !== 0) throw new Error('Cannot inspect default hook directory');
  const hooksDir = path.resolve(root, dirResult.stdout.trim());
  const custom = fs.existsSync(hooksDir) ? fs.readdirSync(hooksDir).filter(name => !name.endsWith('.sample')) : [];
  if (previous === null && custom.length) return {status: 'preserved', custom, changed: false};
  for (const name of ['pre-commit', 'pre-push']) {
    const file = path.join(root, 'scripts/githooks', name);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`Missing hook: ${name}`);
    fs.accessSync(file, fs.constants.X_OK);
  }
  if (previous === 'scripts/githooks') return {status: 'configured', previous, changed: false};
  if (!install) return {status: 'available', changed: false, previous: null};
  const result = git(['config', '--local', 'core.hooksPath', 'scripts/githooks']);
  if (result.status !== 0) throw new Error(result.stderr || 'Cannot configure hooks');
  return {status: 'installed', changed: true, previous: null, undo: 'git config --local --unset core.hooksPath', scope: 'Git common configuration; linked worktrees may share this setting'};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.slice(2).some(arg => arg !== '--install')) throw new Error('Usage: node scripts/install-git-hooks.mjs [--install]');
    console.log(JSON.stringify(installGitHooks(process.cwd(), {install: process.argv.includes('--install')}), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
