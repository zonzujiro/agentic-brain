#!/usr/bin/env node
// Bounded direct-command guard, not a complete shell interpreter or authorization system.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { shellCommands, classifyAgentDeliveryCommand, classifyDirectGitPush, shellWords, repoRoot } from './lib/adapter.mjs';
import { checkDelivery, git } from '../delivery/check.mjs';
export function inspectDeliveryCommand(payload) {
  const commands = shellCommands(payload);
  const action = commands.map(classifyAgentDeliveryCommand).find(a => a.kind !== 'none');
  if (!action) return null;
  const input = payload.tool_input;
  if (input && typeof input === 'object' && ('workdir' in input || 'cwd' in input)) throw new Error('Run delivery from the session repository without a tool working-directory override.');
  if (/functions\.exec/.test(payload.tool_name ?? '') && /\b(?:workdir|cwd)\s*:/.test(typeof input === 'string' ? input : input?.code ?? input?.input ?? '')) throw new Error('Wrapped delivery with a working-directory override is unsupported; run the standalone command in this repository.');
  if (action.compound || commands.length !== 1) throw new Error('Run delivery as one standalone command so its revision and body cannot change first.');
  if (action.kind === 'git-push') {
    const shape = classifyDirectGitPush(action.command);
    if (!shape.supported) throw new Error(shape.reason);
    return { kind: 'push' };
  }
  const words = shellWords(action.command);
  if (words.slice(0, 3).join(' ') !== 'gh pr create') throw new Error('Use this repository without a gh repository override.');
  const result = { kind: 'pr', base: 'main' }, seen = new Set();
  for (let i = 3; i < words.length; i++) {
    if (words[i] === '--draft') continue;
    const field = ({ '--title': 'title', '--body-file': 'bodyFile', '--base': 'base' })[words[i]];
    if (!field || seen.has(field) || !words[i + 1]) throw new Error('Use literal --title, --body-file and optional --base main; obtain separate PR approval.');
    const value = words[++i];
    if (/[$`<>\n\r]/.test(value) || value === '-') throw new Error('Save literal PR content before checking delivery.');
    seen.add(field); result[field] = value;
  }
  if (!result.title || !result.bodyFile || result.base !== 'main') throw new Error('Supply --title and --body-file targeting main.');
  return result;
}
export function handleDelivery(payload, expectedRoot) {
  const action = inspectDeliveryCommand(payload);
  if (!action) return {};
  const root = repoRoot(payload);
  if (fs.realpathSync(root) !== fs.realpathSync(expectedRoot)) throw new Error('Delivery event belongs to another repository.');
  if (action.kind === 'push') {
    const branch = git(root, ['branch', '--show-current']);
    if (!branch) throw new Error('Detached HEAD cannot use this delivery path.');
    const config = key => { try { return git(root, ['config', '--get', key]); } catch { return ''; } };
    if (config(`branch.${branch}.remote`) !== 'origin' || config(`branch.${branch}.merge`) !== `refs/heads/${branch}` || config(`branch.${branch}.pushRemote`) || config('remote.pushDefault') || config('remote.origin.push') || !['', 'simple', 'current', 'upstream'].includes(config('push.default'))) {
      throw new Error('The push must target only the current branch on its matching origin upstream.');
    }
  }
  // Read the current remote base, never attest against a stale local tracking ref.
  git(root, ['fetch', 'origin', 'main']);
  const head = git(root, ['rev-parse', 'HEAD']), base = git(root, ['rev-parse', 'origin/main']);
  const bodyFile = action.kind === 'pr' ? path.resolve(payload.cwd ?? root, action.bodyFile) : path.join(root, '.brain/delivery-review.md');
  const body = fs.existsSync(bodyFile) ? fs.readFileSync(bodyFile, 'utf8') : '';
  const checked = checkDelivery({ root, base, head, body });
  if (!checked.ok) throw new Error(checked.checks.filter(c => !c.ok).map(c => c.message).join('\n') + '\nFor push, save both completed review attestations under ## Quality Gates in .brain/delivery-review.md; then retry. This does not grant delivery permission.');
  return {};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
    try { console.log(JSON.stringify(handleDelivery(payload, path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')))); }
    catch (error) { console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: `Delivery checks: ${error.message}` } })); }
  } catch (error) { console.error(`Brain delivery hook failed open: ${error.message}`); }
}
