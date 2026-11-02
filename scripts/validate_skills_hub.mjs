#!/usr/bin/env node
// Adapted from the source skill validator; shared by validation and adoption.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const ALLOWED_FRONTMATTER_KEYS = new Set([
  'name', 'description', 'metadata', 'license', 'compatibility', 'allowed-tools',
  'disable-model-invocation', 'user-invocable', 'argument-hint',
]);

// Deliberately limited block metadata parser, not a general YAML interpreter.
// Preserve optional fields as raw text; never execute or silently strip them.
export function parseSkillMetadata(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines[0] !== '---') throw new Error('missing frontmatter');
  const end = lines.findIndex((line, i) => i > 0 && line === '---');
  if (end < 0) throw new Error('unterminated frontmatter');
  const fields = new Map();
  let current;
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (/^\s/.test(line)) {
      if (!current) throw new Error('orphan metadata continuation');
      fields.set(current, fields.get(current) + '\n' + line.trim());
      continue;
    }
    const match = line.match(/^([a-z][a-z0-9-]*):\s*(.*)$/);
    if (!match) throw new Error('unsupported metadata syntax');
    const [, key, value] = match;
    if (fields.has(key)) throw new Error(`duplicate metadata key: ${key}`);
    if (!ALLOWED_FRONTMATTER_KEYS.has(key)) throw new Error(`unsupported metadata key: ${key}`);
    fields.set(key, value);
    current = key;
  }
  for (const key of ['name', 'description']) {
    let value = (fields.get(key) ?? '').trim();
    value = value.replace(/^[|>]\s*\n/, '').replace(/^(['"])(.*)\1$/s, '$2').trim();
    if (!value || /^[|>]$/.test(value)) throw new Error(`missing ${key}`);
    if (/^[\[\]{&*!]/.test(value)) throw new Error(`${key} must be a plain or quoted scalar`);
    fields.set(key, value);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.get('name')) || fields.get('name').length > 64) {
    throw new Error('name must be lowercase hyphenated and at most 64 characters');
  }
  if (!lines.slice(end + 1).join('\n').trim()) throw new Error('missing instruction body');
  return fields;
}

// JSON flow metadata is a supported YAML subset; vendor metadata stays untouched.
export function validateOwnership(fields) {
  const raw = fields.get('metadata');
  if (!raw?.trim().startsWith('{')) return [];
  let metadata; try { metadata=JSON.parse(raw); } catch { return ['invalid JSON-flow metadata']; }
  const brain=metadata.brain;if (!brain) return [];
  const errors=[];
  if (!['canonical-writer','companion','validator-helper','legacy'].includes(brain.ownership_class)) errors.push('unknown ownership_class');
  if (!['direct','internal','helper'].includes(brain.user_invocation)) errors.push('unknown user_invocation');
  if (!Array.isArray(brain.governed_by) || !brain.governed_by.includes('governance/artifacts/artifact-writer-map.md')) errors.push('ownership must reference writer map');
  if (brain.ownership_class==='canonical-writer' && (!Array.isArray(brain.artifacts) || !brain.artifacts.some(a=>a.id && a.role==='final-writer' && Array.isArray(a.paths) && a.paths.length))) errors.push('canonical writer needs a final-writer artifact and paths');
  if (brain.user_invocation==='internal' && (fields.get('disable-model-invocation')!=='true' || fields.get('user-invocable')!=='false')) errors.push('internal helper visibility flags disagree');
  if (brain.ownership_class==='legacy' && brain.user_invocation==='direct') errors.push('legacy skills cannot be direct entrypoints');
  if (brain.gate_profile && !['standard-authoring','governed-change','skill-change','boundary-resolution','change-impact'].includes(brain.gate_profile)) errors.push('unknown gate profile');
  return errors;
}

export function validateSkillPackage(dir, expectedName = path.basename(dir)) {
  const errors = [];
  try {
    if (fs.lstatSync(dir).isSymbolicLink()) return [`${dir}: canonical package must not be a symlink`];
    function walk(folder) {
      for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
        const file = path.join(folder, entry.name);
        if (entry.isSymbolicLink() || (!entry.isDirectory() && !entry.isFile())) {
          errors.push(`${file}: package entries must be regular files or directories`);
        } else if (entry.isDirectory()) walk(file);
      }
    }
    walk(dir);
    if (errors.length) return errors;
    const text = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8');
    const fields = parseSkillMetadata(text);
    errors.push(...validateOwnership(fields).map(message=>`${dir}: ${message}`));
    if (fields.get('name') !== expectedName) errors.push(`${dir}: name must match folder name`);
    if (/\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/|[A-Za-z]:\\Users\\/.test(text)) errors.push(`${dir}: machine-local path in instructions`);
  } catch (error) { errors.push(`${dir}: ${error.message}`); }
  return errors;
}

export function validateSkillsHub(root, host = '.agents') {
  const errors = [];
  const hub = path.join(root, 'skills-hub/hb-skills');
  const index = path.join(root, host, 'skills');
  if (!fs.existsSync(hub)) return errors;
  for (const folder of [path.join(root, "skills-hub"), hub, path.join(root, host), index]) {
    try { if (fs.lstatSync(folder).isSymbolicLink()) return [`${folder}: index and source parents must not be symlinks`]; } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  const names = new Set();
  for (const entry of fs.readdirSync(hub, { withFileTypes: true })) {
    if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
    names.add(entry.name);
    const dir = path.join(hub, entry.name);
    errors.push(...validateSkillPackage(dir));
    const link = path.join(index, entry.name);
    try {
      if (!fs.lstatSync(link).isSymbolicLink() || fs.readlinkSync(link) !== path.relative(index, dir)) {
        errors.push(`${link}: expected relative link to canonical skill`);
      }
    } catch { errors.push(`${link}: missing discovery link`); }
  }
  if (fs.existsSync(index)) {
    if (fs.lstatSync(index).isSymbolicLink()) errors.push(`${index}: discovery index must be a directory`);
    else for (const entry of fs.readdirSync(index)) {
      if (!names.has(entry)) errors.push(`${index}/${entry}: stale or unowned discovery entry`);
    }
  }
  if (host === '.agents' && fs.existsSync(path.join(root, '.claude'))) errors.push(...validateSkillsHub(root, '.claude'));
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const errors = validateSkillsHub(process.cwd());
  errors.forEach(error => console.error(error));
  process.exitCode = errors.length ? 1 : 0;
}
