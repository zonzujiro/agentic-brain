#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
export function hookConfiguration() {
  const command = 'node "$(git rev-parse --show-toplevel)/scripts/hooks/local-lifecycle.mjs"';
  const config = { hooks: Object.fromEntries(['SessionStart', 'PreToolUse', 'PostToolUse', 'Stop'].map(event => [event, [{
    ...(event.includes('ToolUse') ? { matcher: '^apply_patch$|^Write$|^Edit$' } : {}),
    hooks: [{ type: 'command', command, timeout: 30 }],
  }]])) };
  config.hooks.PreToolUse.push({ matcher: '^Bash$|^exec_command$|^functions\\.exec$', hooks: [{ type: 'command', command: 'node "$(git rev-parse --show-toplevel)/scripts/hooks/pre-delivery.mjs"', timeout: 120 }] });
  return config;
}
export function installAgentHooks(root, { install = false } = {}) {
  root = fs.realpathSync(root);
  if (!fs.existsSync(path.join(root, 'scripts/hooks/local-lifecycle.mjs'))) throw new Error('Local hook implementation is missing');
  const dir = path.join(root, '.codex'), file = path.join(dir, 'hooks.json');
  if (fs.existsSync(dir) && fs.lstatSync(dir).isSymbolicLink()) throw new Error('Refusing symlinked host directory');
  try { fs.lstatSync(file); return { status: 'preserved', file, changed: false }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const configuration = hookConfiguration();
  if (install) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file, JSON.stringify(configuration, null, 2) + '\n', { flag: 'wx' }); }
  return { status: install ? 'written-not-trusted' : 'preview', file, configuration,
    next: 'Review the exact hook definitions with /hooks in Codex and trust them before testing. This installer never changes trust or approvals.' };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.slice(2).some(arg => arg !== '--install')) throw new Error('Usage: node scripts/install-agent-hooks.mjs [--install]');
    console.log(JSON.stringify(installAgentHooks(process.cwd(), { install: process.argv.includes('--install') }), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
