// Shared path ownership derived from the current write-boundary contract.
// Adapted from source surfaces.mjs; no inherited format blacklist or products.
export const KNOWN_TOP_LEVEL = new Set([
  'projects-in-progress', 'production-features', 'knowledge-hub', 'governance',
  'skills-hub', 'scripts', '.agents', '.claude', '.github', '.codex',
]);
export const KNOWN_ROOT_FILES = new Set([
  'AGENTS.md', 'AGENTS.local.md', 'README.md', 'ARCHITECTURE.md',
  '.gitignore', '.gitattributes', '.nvmrc', 'package.json', 'package-lock.json',
]);
export function rootPathViolation(file) {
  if (typeof file !== 'string' || !file || file.includes('\\') || file.startsWith('/') || file.split('/').some(p => !p || p === '.' || p === '..')) {
    return { rule: 'artifact-shape/unsafe-path', message: 'use a normalized repository-relative file path' };
  }
  const parts = file.split('/');
  if (parts.length === 1) return KNOWN_ROOT_FILES.has(file) ? null : {
    rule: 'artifact-shape/root-file', message: 'no current root contract owns this file; resolve its owning surface',
  };
  return KNOWN_TOP_LEVEL.has(parts[0]) ? null : {
    rule: 'artifact-shape/unknown-surface', message: 'no current contract owns this root; resolve the write boundary',
  };
}

// Adapted format boundary: executable/binary artifacts need an explicit owner.
const RESTRICTED = /\.(?:py|js|mjs|cjs|ts|tsx|jsx|sh|rb|go|java|pptx|docx|xlsx|pdf|zip|tar|gz|exe|dmg|html?|jsonl?|ya?ml|toml|lock|css|scss)$/i;
export function artifactFormatViolation(file) {
  if (!RESTRICTED.test(file)) return null;
  if (!file.includes('/') && KNOWN_ROOT_FILES.has(file)) return null;
  if (/^(?:scripts|skills-hub)\//.test(file)) return null;
  if (/^\.github\/(?:workflows|scripts)\//.test(file)) return null;
  if (/^\.(?:codex\/hooks|claude\/settings)\.json$/.test(file)) return null;
  if (/^governance\/quality\/(?:fixtures|evals)\//.test(file)) return null;
  if (/^projects-in-progress\/(?:project-relations\.json|agentic-brain\/extraction\.json)$/.test(file)) return null;
  return 'format has no owner on this context surface; keep executable mechanics in scripts and resolve new data contracts before writing';
}
