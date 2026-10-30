// Portable authoring advisories from the source rule set. These invite review;
// they do not establish source truth or require links to unrelated peers.
import fs from 'node:fs';
import path from 'node:path';
const HEDGE_EXEMPT = [/^governance\/quality\//, /fixtures\//];
const HEDGE_PATTERN = /\b(seems fine|probably enough|looks fine|seems grounded)\b/i;
const topLevelOf = file => file.split('/')[0];
function finding(rule, file, line, message) { return { rule, file, line, message, severity: 'advisory' }; }
function stripCode(content) { return content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, ''); }
export function hedgeRule(ctx) {
  const { file, content } = ctx;
  if (HEDGE_EXEMPT.some((re) => re.test(file))) return [];
  if (!/\.md$/.test(file)) return [];
  const findings = [];
  const lines = content.split("\n");
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) inFence = !inFence;
    if (inFence) continue;
    const m = lines[i].match(HEDGE_PATTERN);
    // Mention is not use: skip phrases that are quoted (rule definitions,
    // eval seeds, and incident records quote the banned wording).
    const quoted = m && /["'`]/.test(lines[i].charAt(m.index - 1));
    if (m && !quoted) {
      findings.push(
        finding("claim-grounding/hedge-language", file, i + 1,
          `"${m[1]}" - this wording may hide an evidence gap. State what was read and what it supports, or mark the claim as an explicit gap.`),
      );
    }
  }
  return findings;
}


export function emptyHeadingRule(ctx) {
  const { file, content } = ctx;
  if (!/\.md$/.test(file) || /fixtures\//.test(file)) return [];
  const findings = [];
  const lines = content.split("\n");
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) inFence = !inFence;
    if (inFence) continue;
    const h = lines[i].match(/^(#{2,4})\s+\S/);
    if (!h) continue;
    const level = h[1].length;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;
    const next = lines[j] ?? "";
    const nextHeading = next.match(/^(#{1,4})\s+\S/);
    // A deeper heading means this is a container section, not an empty one.
    if (j >= lines.length || (nextHeading && nextHeading[1].length <= level)) {
      findings.push(
        finding("consumer-contract/empty-section", file, i + 1,
          `section "${lines[i].replace(/^#+\s*/, "")}" has no content. Fill it, remove it, or state what remains unknown; an empty heading may look complete to consumers.`),
      );
    }
  }
  return findings;
}


export function gapConsumptionRule(ctx) {
  const { root, file, content } = ctx;
  if (!/\.md$/.test(file) || /fixtures\//.test(file) ||
      !["projects-in-progress", "production-features", "knowledge-hub"].includes(topLevelOf(file)) ||
      /(?:^|\/)(?:AGENTS|CLAUDE)\.md$/.test(file)) return [];
  const findings = [];
  const seen = new Set();
  const linkRe = /\]\(([^)#\s]+\.md)(#[^)]*)?\)/g;
  let m;
  while ((m = linkRe.exec(content)) !== null) {
    const target = m[1];
    if (/^[a-z]+:\/\//i.test(target)) continue;
    const resolved = path.normalize(path.join(path.dirname(file), target));
    const anchor = m[2]?.slice(1);
    const citation = resolved + (anchor ? `#${anchor}` : "");
    if (seen.has(citation)) continue;
    seen.add(citation);
    let targetContent;
    try {
      const real = fs.realpathSync(path.join(root, resolved));
      if (!real.startsWith(fs.realpathSync(root) + path.sep)) continue;
      targetContent = fs.readFileSync(real, "utf8");
    } catch {
      continue;
    }
    // Mention is not use: grammar definitions carry _Gap: inside code spans.
    if (stripCode(linkedMarkdownArea(targetContent, anchor)).includes("_Gap:")) {
      const line = content.slice(0, m.index).split("\n").length;
      findings.push(
        finding("consumer-contract/gap-consumption", file, line,
          `cited area ${citation} carries explicit _Gap:_ markers - check which gaps affect the supported statement; preserve relevant limitations without treating unrelated gaps as disproof.`),
      );
    }
  }
  return findings;
}

function linkedMarkdownArea(content, anchor) {
  if (!anchor) return content;
  let requested;
  try { requested = decodeURIComponent(anchor); } catch { return content; }
  const lines = content.split("\n");
  const slugs = new Map();
  let start = -1;
  let level = 0;
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:```|~~~)/.test(lines[i])) { inFence = !inFence; continue; }
    if (inFence) continue;
    const heading = lines[i].match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    if (start !== -1 && heading[1].length <= level) return lines.slice(start, i).join("\n");
    const base = heading[2].toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, "").replace(/ /g, "-");
    const count = slugs.get(base) ?? 0;
    slugs.set(base, count + 1);
    const slug = count ? `${base}-${count}` : base;
    if (slug === requested) { start = i; level = heading[1].length; }
  }
  return start === -1 ? content : lines.slice(start).join("\n");
}


export function peerSurfacingRule(ctx) {
  const { root, file, content, isNewFile } = ctx;
  if (!isNewFile) return [];
  if (!/^(production-features|knowledge-hub)\//.test(file) || !/\.md$/.test(file)) return [];
  const dir = path.dirname(file);
  let siblings;
  try {
    siblings = fs.readdirSync(path.join(root, dir)).filter(
      (name) => name.endsWith(".md") && path.join(dir, name) !== file,
    );
  } catch {
    return [];
  }
  // A symlink alias of the checked file (CLAUDE.md -> AGENTS.md) is not a
  // peer - flagging it asks the author to cite the file inside itself
  // Realpath errors fail open: an
  // unresolvable entry stays a peer and still gets flagged.
  let selfRealpath = null;
  try {
    selfRealpath = fs.realpathSync(path.join(root, file));
  } catch {
    selfRealpath = null;
  }
  const isSelfAlias = (name) => {
    if (selfRealpath === null) return false;
    try {
      return fs.realpathSync(path.join(root, dir, name)) === selfRealpath;
    } catch {
      return false;
    }
  };
  const uncited = siblings
    .filter((name) => !isSelfAlias(name))
    .filter((name) => !content.includes(name))
    .slice(0, 5);
  if (uncited.length === 0) return [];
  return [
    finding("cross-reference/uncited-peers", file, 1,
      `peer docs exist in ${dir}/ and are not referenced: ${uncited.join(", ")}. Review relevant peers for contradictions; no backlink to unrelated documents is required.`),
  ];
}
