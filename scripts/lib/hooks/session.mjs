// Adapted evidence-only session storage. No transcripts or authored snapshots.
import fs from 'node:fs';
import path from 'node:path';
export const SESSION_DIR = '.brain/session';
export const SOURCE_ACCESS_TOOL_PATTERN = /^(Read|WebFetch|mcp__.*(?:search|get|read|fetch|list).*)$/i;
export function ensureSessionDir(root) {
  for (const part of ['.brain', '.brain/session']) {
    const dir = path.join(root, part);
    try { if (fs.lstatSync(dir).isSymbolicLink()) throw new Error('Evidence directory must not be a symlink'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; fs.mkdirSync(dir, { mode: 0o700 }); }
  }
}
export function appendEvidence(root, entry) {
  ensureSessionDir(root);
  const file = path.join(root, SESSION_DIR, 'evidence-log.jsonl');
  const fd = fs.openSync(file, fs.constants.O_WRONLY | fs.constants.O_APPEND | fs.constants.O_CREAT | fs.constants.O_NOFOLLOW, 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(entry) + '\n'); } finally { fs.closeSync(fd); }
}
export function readEvidence(root, { logPath } = {}) {
  const file = logPath ?? path.join(root, SESSION_DIR, 'evidence-log.jsonl');
  try { return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}
