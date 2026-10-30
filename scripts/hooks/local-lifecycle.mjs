#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { repoRoot, relativeInRepo, writtenPaths } from './lib/adapter.mjs';
import { pathFindings, report, formatFindings } from '../lib/hooks/engine.mjs';
import { validateRepository } from '../validate_repo.mjs';

function context(event, text) { return { hookSpecificOutput: { hookEventName: event, additionalContext: text } }; }
export function handle(payload, expectedRoot) {
  const root = repoRoot(payload);
  if (fs.realpathSync(root) !== fs.realpathSync(expectedRoot)) return { systemMessage: 'Brain hook skipped: event belongs to another repository.' };
  const event = payload.hook_event_name;
  if (event === 'SessionStart') return context(event, 'Agentic Brain local SessionStart hook ran. Read AGENTS.md, README.md, ARCHITECTURE.md and governance/operations/repo-workflows.md. Resolve write boundaries before edits. Run npm test and npm run check before delivery. Other hook events require separate host trust. These hooks do not observe connectors, prove evidence truth, or grant write/push/PR permission.');
  if (event === 'PreToolUse') {
    const findings = [];
    for (const target of writtenPaths(payload, { includeRemoved: false })) {
      const relative = relativeInRepo(root, target, payload.cwd ?? root);
      if (relative === null) continue; // Outside this repository's policy scope.
      findings.push(...pathFindings(relative));
      let parent = path.join(root, relative);
      while (parent !== root) {
        try {
          if (fs.lstatSync(parent).isSymbolicLink()) { findings.push({ file: relative, line: 1, rule: 'artifact-shape/symlink-write', message: 'structured writes through repository symlinks require an explicit canonical target' }); break; }
        } catch (error) { if (error.code !== 'ENOENT') throw error; }
        parent = path.dirname(parent);
      }
    }
    if (findings.length) return { hookSpecificOutput: { hookEventName: event, permissionDecision: 'deny', permissionDecisionReason: formatFindings(findings) } };
    return {};
  }
  if (event === 'PostToolUse') {
    const findings = writtenPaths(payload, { includeRemoved: false }).flatMap(target => {
      const relative = relativeInRepo(root, target, payload.cwd ?? root);
      if (!relative || !/\.(md|json|ya?ml|mjs)$/.test(relative)) return [];
      return report(root, relative);
    });
    return findings.length ? context(event, formatFindings(findings)) : {};
  }
  if (event === 'Stop') {
    // Read-only whole-tree validation also catches ordinary shell-written files.
    // At most one continuation via the host flag; no authored-content rewrite.
    const errors = validateRepository(root);
    if (!errors.length) return {};
    const message = `Brain working-tree checks found unresolved issues:\n${errors.slice(0, 20).join('\n')}${errors.length > 20 ? '\nAdditional findings omitted; run npm run check.' : ''}`;
    if (payload.stop_hook_active) return { systemMessage: message + '\nReport unresolved scope or evidence gaps; the hook will not request another repair pass.' };
    return { decision: 'block', reason: message + '\nReview these findings before finishing. Repair only within the authorized scope; preserve unrelated pre-existing work and report genuine blockers.' };
  }
  return {};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
    const expectedRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    console.log(JSON.stringify(handle(payload, expectedRoot)));
  } catch (error) {
    console.error(`Brain hook failed open: ${error.message}. Run npm run check; hook execution did not validate the operation.`);
  }
}
