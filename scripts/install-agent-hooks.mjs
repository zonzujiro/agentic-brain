#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
export function hookConfiguration(host = "codex") {
  const command = 'node "$(git rev-parse --show-toplevel)/scripts/hooks/local-lifecycle.mjs"';
  const config = { hooks: Object.fromEntries(['SessionStart', 'PreToolUse', 'PostToolUse', 'Stop'].map(event => [event, [{
    ...(event.includes('ToolUse') ? { matcher: '^apply_patch$|^Write$|^Edit$' } : {}),
    hooks: [{ type: 'command', command, timeout: 30 }],
  }]])) };
  config.hooks.PreToolUse.push({ matcher: '^Bash$|^exec_command$|^functions\\.exec$', hooks: [{ type: 'command', command: 'node "$(git rev-parse --show-toplevel)/scripts/hooks/pre-delivery.mjs"', timeout: 120 }] });
  config.hooks.PreToolUse.push({ matcher: '^apply_patch$|^Write$|^Edit$|^Bash$|^exec_command$|^functions\\.exec$', hooks: [{ type: 'command', command: 'node "$(git rev-parse --show-toplevel)/scripts/agent-policy/brain-checkout-freshness.mjs"', timeout: 45 }] });
  config.hooks.PostToolUse.push({ matcher: '^Read$|^WebFetch$|^mcp__.*', hooks: [{ type: 'command', command: 'node "$(git rev-parse --show-toplevel)/scripts/hooks/evidence-observer.mjs"', timeout: 30 }] });
  if(host === 'claude') config.hooks.PostToolUseFailure = [config.hooks.PostToolUse.at(-1)];
  return config;
}
export function installAgentHooks(root, { install = false, host = "codex" } = {}) {
  root = fs.realpathSync(root);
  if (!fs.existsSync(path.join(root, 'scripts/hooks/local-lifecycle.mjs'))) throw new Error('Local hook implementation is missing');
  if (!['codex', 'claude'].includes(host)) throw new Error('Unknown host');
  const dir = path.join(root, `.${host}`), file = path.join(dir, host === 'codex' ? 'hooks.json' : 'settings.json');
  if (fs.existsSync(dir) && fs.lstatSync(dir).isSymbolicLink()) throw new Error('Refusing symlinked host directory');
  try { fs.lstatSync(file); return { status: 'preserved', file, changed: false }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const configuration = hookConfiguration(host);
  if (install) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file, JSON.stringify(configuration, null, 2) + '\n', { flag: 'wx' }); }
  return { status: install ? 'written-not-trusted' : 'preview', file, configuration,
    next: `Review the exact hook definitions with /hooks in ${host} before testing. This installer never changes trust or approvals.` };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.slice(2).some(arg => !['--install','--host=codex','--host=claude'].includes(arg))) throw new Error('Usage: node scripts/install-agent-hooks.mjs [--install]');
    console.log(JSON.stringify(installAgentHooks(process.cwd(), { install: process.argv.includes('--install'), host: process.argv.includes('--host=claude') ? 'claude' : 'codex' }), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
