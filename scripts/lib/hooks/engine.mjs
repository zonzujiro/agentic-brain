// Shared deterministic file rules, mounted by repository checks and local hooks.
// Adapted from the source report engine; no session evidence or connector claims.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { hedgeRule, emptyHeadingRule, gapConsumptionRule, peerSurfacingRule } from './advisories.mjs';
import { rootPathViolation } from './surfaces.mjs';
import { validateFootnotes, validateChangedSourceFootnoteLinks } from '../markdown/footnotes.mjs';

export function pathFindings(file) {
  const violation = rootPathViolation(file);
  return violation ? [{ file, line: 1, ...violation, severity: 'deny' }] : [];
}
export function report(root, file, { content, checkPath = true, isNewFile } = {}) {
  const findings = checkPath ? pathFindings(file) : [];
  if (findings.length) return findings;
  if (content === undefined) {
    const absolute = path.join(root, file);
    let real;
    try { real = fs.realpathSync(absolute); } catch (error) {
      return [{ file, line: 1, rule: 'coverage/unreadable', severity: 'error', message: error.code }];
    }
    if (!real.startsWith(fs.realpathSync(root) + path.sep)) return [{ file, line: 1, rule: 'coverage/outside', severity: 'error', message: 'target leaves repository' }];
    content = fs.readFileSync(absolute, 'utf8');
  }
  const add = (rule, message, line = 1) => findings.push({ file, line, rule, message, severity: 'error' });
  if (/(?:https?:\/\/(?:npm\.dev\.wixpress\.com|mcp-s\.wewix\.net|bo\.wix\.com)|@wix\/|wix-private\/)/i.test(content)) add('integration/private-reference', 'private integration reference');
  if (file.endsWith('.md')) {
    validateFootnotes(content).forEach(message => add('grounding/footnotes', message));
    validateChangedSourceFootnoteLinks(content, { filePath: file, repoRoot: root }).forEach(({ message, line }) => add('grounding/local-link', message, line));
  }
  if (file.endsWith('.md')) {
    if (isNewFile === undefined && /^(knowledge-hub|production-features)\//.test(file)) {
      isNewFile = spawnSync('git', ['cat-file', '-e', `HEAD:${file}`], { cwd: root, stdio: 'ignore', timeout: 5000 }).status !== 0;
    }
    const ctx = { root, file, content, isNewFile };
    for (const rule of [hedgeRule, emptyHeadingRule, gapConsumptionRule, peerSurfacingRule]) findings.push(...rule(ctx));
  }
  return findings;
}
export function formatFindings(findings) {
  return findings.map(f => `${f.file}:${f.line}: [${f.rule}] ${f.message}`).join('\n');
}
