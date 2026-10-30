#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { report } from './lib/hooks/engine.mjs';

import { validateSkillsHub } from './validate_skills_hub.mjs';
import { rootPathViolation } from './lib/hooks/surfaces.mjs';
import { validateSurfaces } from './validate_surfaces.mjs';
import { check as checkOverlap } from './lib/project-overlap/detect.mjs';
import { validateDecisions } from './validate_decisions.mjs';

const ignored = new Set(['.git', '.brain', 'node_modules']);
function validate(root, documentSandbox = false) {
  const errors = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      if (ignored.has(entry.name)) continue;
      const absolute = path.join(dir, entry.name);
      const relative = path.relative(root, absolute);
      if (!documentSandbox && !entry.isDirectory()) {
        const violation = rootPathViolation(relative.split(path.sep).join('/'));
        if (violation) errors.push(`${relative}: ${violation.message}`);
      }
      if (entry.isSymbolicLink()) {
        let resolved;
        try { resolved = fs.realpathSync(absolute); } catch { errors.push(`${relative}: broken symlink`); continue; }
        const dest = path.relative(root, resolved);
        if (dest === '..' || dest.startsWith('..' + path.sep) || path.isAbsolute(dest)) errors.push(`${relative}: symlink leaves repository`);
        continue;
      }
      if (entry.isDirectory()) { walk(absolute); continue; }
      if (!(documentSandbox ? /\.md$/ : /\.(md|json|yml|yaml|mjs)$/).test(entry.name)) continue;
      const content = fs.readFileSync(absolute, 'utf8');
      for (const finding of report(root, relative.split(path.sep).join('/'), {content, checkPath: !documentSandbox})) if (finding.severity !== "advisory") errors.push(`${relative}:${finding.line}: ${finding.message}`);
    }
  }
  walk(root);
  if (!documentSandbox) {
    errors.push(...validateDecisions(root), ...validateSkillsHub(root), ...validateSurfaces(root));
    const overlap = checkOverlap(root);
    if (overlap.relationError) errors.push(overlap.relationError);
  }
  return errors;
}
export function validateRepository(root) { return validate(root); }
// Explicit onboarding-only mount: links/footnotes, no repository layout claim.
export function validateDocumentSandbox(root) { return validate(root, true); }
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const errors = validateRepository(root);
  for (const error of errors) console.error(error);
  if (errors.length) process.exitCode = 1;
  else console.log('Repository checks passed (local Markdown links, footnotes, Decision and skill structure, root ownership, selected private integration markers).');
}
