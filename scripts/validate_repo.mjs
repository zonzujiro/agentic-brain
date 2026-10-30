#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateFootnotes, validateChangedSourceFootnoteLinks } from './lib/markdown/footnotes.mjs';

import { validateDecisions } from './validate_decisions.mjs';

const ignored = new Set(['.git', '.brain', 'node_modules']);
export function validateRepository(root) {
  const errors = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      if (ignored.has(entry.name)) continue;
      const absolute = path.join(dir, entry.name);
      const relative = path.relative(root, absolute);
      if (entry.isSymbolicLink()) {
        const dest = path.relative(root, fs.realpathSync(absolute));
        if (dest === '..' || dest.startsWith('..' + path.sep) || path.isAbsolute(dest)) errors.push(`${relative}: symlink leaves repository`);
        continue;
      }
      if (entry.isDirectory()) { walk(absolute); continue; }
      if (!/\.(md|json|yml|yaml|mjs)$/.test(entry.name)) continue;
      const content = fs.readFileSync(absolute, 'utf8');
      // Narrow, explicit private integration markers; not a secret scanner.
      if (/(?:https?:\/\/(?:npm\.dev\.wixpress\.com|mcp-s\.wewix\.net|bo\.wix\.com)|@wix\/|wix-private\/)/i.test(content)) errors.push(`${relative}: private integration reference`);
      if (!relative.endsWith('.md')) continue;
      for (const message of validateFootnotes(content)) errors.push(`${relative}: ${message}`);
      for (const finding of validateChangedSourceFootnoteLinks(content, {filePath: relative, repoRoot: root})) errors.push(`${relative}:${finding.line}: ${finding.message}`);
    }
  }
  walk(root);
  errors.push(...validateDecisions(root));
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const errors = validateRepository(root);
  for (const error of errors) console.error(error);
  if (errors.length) process.exitCode = 1;
  else console.log('Repository checks passed (local Markdown links, footnotes, Decision structure, selected private integration markers).');
}
