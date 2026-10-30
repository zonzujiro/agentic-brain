import fs from "node:fs";
import path from "node:path";

const CODE_FILE_PATTERN = /\.(?:[cm]?[jt]sx?|proto|py|rb|go|rs|java|kts?|swift|cs|c|cc|cpp|cxx|h|hh|hpp|hxx|php|scala|sh|bash|zsh|fish|sql|graphql|gql|vue|svelte)$/i;

export function validateFootnotes(markdown, errors = []) {
  const definitions = new Map();
  const references = new Set();
  let inFence = false;
  let activeDefinitionId = null;
  const lines = markdown.split(/\r?\n/);

  function validateGithubSourceLinks(text, footnoteId) {
    const labelsByUrl = new Map();
    for (const match of text.matchAll(
      /\[([^\]\r\n]+)\]\((https?:\/\/(?:www\.)?github\.com\/[^)\s]+)\)/g,
    )) {
      const [, label, url] = match;
      const labels = labelsByUrl.get(url) ?? [];
      labels.push(label);
      labelsByUrl.set(url, labels);
    }

    const withoutInlineCode = text.replace(/`[^`]*`/g, "");
    for (const match of withoutInlineCode.matchAll(
      /https?:\/\/(?:www\.)?github\.com\/[^/\s)]+\/[^/\s)]+\/(?:blob|tree)\/[^\s)]+/g,
    )) {
      const sourceUrl = match[0];
      const parsed = new URL(sourceUrl);
      const [, , , sourceKind, ref, ...pathParts] = parsed.pathname.split("/");
      if (!/^[0-9a-f]{40}$/i.test(ref)) {
        errors.push(
          `GitHub source in footnote ${footnoteId} must use a full commit SHA, not moving ref: ${ref}`,
        );
        continue;
      }

      const sourcePath = pathParts.join("/");
      const isCodeFile = CODE_FILE_PATTERN.test(sourcePath);
      if (sourceKind !== "blob" || !isCodeFile) {
        continue;
      }

      const range = parsed.hash.match(/^#L(\d+)(?:-L(\d+))?$/);
      const start = Number(range?.[1]);
      const end = range?.[2] === undefined ? start : Number(range[2]);
      if (!range || !Number.isSafeInteger(start) || start < 1 ||
          !Number.isSafeInteger(end) || end < start) {
        errors.push(
          `GitHub code source in footnote ${footnoteId} must link to an exact line or line range`,
        );
      }

      const hasNamedSymbolLabel = (labelsByUrl.get(sourceUrl) ?? []).some(
        (label) => {
          const symbol = label.match(/^`([^`]+)`$/)?.[1];
          return symbol && !CODE_FILE_PATTERN.test(symbol);
        },
      );
      if (!hasNamedSymbolLabel) {
        errors.push(
          `GitHub code source in footnote ${footnoteId} must use a backticked named symbol as its link label, not prose or a filename`,
        );
      }
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const definition = line.match(
      /^\s*\[\^([A-Za-z0-9][A-Za-z0-9._-]*)\]:\s*(.*)$/,
    );
    if (definition) {
      const [, id, inlineBody] = definition;
      activeDefinitionId = id;
      validateGithubSourceLinks(inlineBody, id);
      let body = inlineBody.trim();
      if (!body) {
        for (let continuation = index + 1; continuation < lines.length; continuation += 1) {
          const candidate = lines[continuation];
          if (!candidate.trim()) continue;
          if (/^\s{2,}\S/.test(candidate)) body = candidate.trim();
          break;
        }
      }
      if (definitions.has(id)) {
        errors.push(`Duplicate footnote definition: ${id}`);
      } else {
        definitions.set(id, body);
      }
      continue;
    }

    if (activeDefinitionId && /^\s{2,}\S/.test(line)) {
      validateGithubSourceLinks(line, activeDefinitionId);
    } else if (line.trim()) {
      activeDefinitionId = null;
    }

    const withoutInlineCode = line.replace(/`[^`]*`/g, "");
    for (const match of withoutInlineCode.matchAll(
      /\[\^([A-Za-z0-9][A-Za-z0-9._-]*)\]/g,
    )) {
      references.add(match[1]);
    }
  }

  for (const id of [...references].sort()) {
    if (!definitions.has(id)) {
      errors.push(`Missing footnote definition: ${id}`);
    } else if (!definitions.get(id)) {
      errors.push(`Footnote definition is empty: ${id}`);
    }
  }

  for (const id of [...definitions.keys()].sort()) {
    if (!references.has(id)) {
      errors.push(`Unreferenced footnote definition: ${id}`);
    }
  }

  return errors;
}

// Review changed passages and their referenced notes. Existing notes are not
// reformatted when an unrelated part of a document changes.
function footnoteDefinitions(markdown) {
  const definitions = new Map();
  let active = null;
  let inFence = false;
  for (const [index, line] of markdown.split(/\r?\n/).entries()) {
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      active = null;
      continue;
    }
    if (inFence) continue;
    const match = line.match(/^\s*\[\^([A-Za-z0-9][A-Za-z0-9._-]*)\]:\s*(.*)$/);
    if (match) {
      active = match[1];
      definitions.set(active, { line: index + 1, endLine: index + 1, body: match[2] });
    } else if (active && /^\s{2,}\S/.test(line)) {
      definitions.get(active).body += `\n${line.trim()}`;
      definitions.get(active).endLine = index + 1;
    } else if (line.trim()) {
      active = null;
    }
  }
  return definitions;
}

function referenceDefinitions(markdown) {
  const definitions = new Map();
  let inFence = false;
  for (const [index, line] of markdown.split(/\r?\n/).entries()) {
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = line.match(/^ {0,3}\[([^\]^][^\]]*)\]:\s*(<[^>]+>|\S+)/);
    if (match) {
      definitions.set(match[1].toLowerCase(), {
        href: match[2].replace(/^<|>$/g, ""),
        line: index + 1,
      });
    }
  }
  return definitions;
}

function usedReferenceIds(markdown) {
  const used = new Set();
  let inFence = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    for (const match of line.matchAll(/\[[^\]\r\n]+\]\[([^\]\r\n]+)\]/g)) {
      used.add(match[1].toLowerCase());
    }
  }
  return used;
}

function markdownLinks(text, references) {
  const links = [...text.matchAll(/\[[^\]\r\n]+\]\((<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\)/g)]
    .map((match) => match[1].replace(/^<|>$/g, ""));
  for (const match of text.matchAll(/\[[^\]\r\n]+\]\[([^\]\r\n]+)\]/g)) {
    const href = references.get(match[1].toLowerCase())?.href;
    if (href) links.push(href);
  }
  return links;
}

function paragraphsWithLines(markdown) {
  const paragraphs = [];
  let lines = [];
  function flush() {
    if (lines.length) paragraphs.push({ body: lines.map((entry) => entry.text).join("\n"), lines });
    lines = [];
  }
  for (const [index, text] of markdown.split(/\r?\n/).entries()) {
    if (!text.trim()) flush();
    else lines.push({ text, line: index + 1 });
  }
  flush();
  return paragraphs;
}

function changedParagraphs(markdown, baselineMarkdown) {
  const baselineCounts = new Map();
  for (const paragraph of paragraphsWithLines(baselineMarkdown ?? "")) {
    baselineCounts.set(paragraph.body, (baselineCounts.get(paragraph.body) ?? 0) + 1);
  }
  return paragraphsWithLines(markdown).filter((paragraph) => {
    const remaining = baselineCounts.get(paragraph.body) ?? 0;
    if (remaining > 0) {
      baselineCounts.set(paragraph.body, remaining - 1);
      return false;
    }
    return true;
  });
}

function sourcePaths(body) {
  const candidates = new Set();
  for (const match of body.matchAll(/`([^`\r\n]+\.[A-Za-z0-9]{1,8})`/g)) {
    const named = match[1];
    const before = body.slice(Math.max(0, match.index - 32), match.index).trimEnd();
    const after = body.slice(match.index + match[0].length);
    const identifiesSource = /\b(?:source|code|implementation)\s*:?$/i.test(before) ||
      /^\s*(?:shows|defines|implements|supports|contains)\b/i.test(after);
    if (!named.includes("://") && (named.includes("/") || identifiesSource)) {
      candidates.add(named);
    }
  }
  const prose = body
    .replace(/`[^`]*`/g, "")
    .replace(/\[[^\]\r\n]+\]\((?:<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\)/g, "")
    .replace(/https?:\/\/\S+/g, "");
  for (const match of prose.matchAll(/(?:^|[\s(])((?:\.{1,2}\/|[A-Za-z0-9._-]+\/)[A-Za-z0-9._\/-]+\.[A-Za-z0-9]{1,8})(?=$|[\s,;:).])/g)) {
    candidates.add(match[1]);
  }
  return [...candidates];
}

function sourceLinkMatches(namedPath, href) {
  if (href.startsWith("#")) return false;
  const cleanPath = namedPath.replace(/^(?:\.{1,2}\/)+/, "");
  let target;
  try {
    const parsed = new URL(href, "https://brain.invalid/");
    target = decodeURIComponent(parsed.pathname);
  } catch {
    return false;
  }
  return target.endsWith(`/${cleanPath}`) ||
    (cleanPath === path.basename(cleanPath) && target.endsWith(`/${cleanPath}`));
}

function localLinkError(href, { filePath, repoRoot }) {
  if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(href)) return null;
  let target;
  try {
    target = decodeURIComponent(href.split("#")[0]);
  } catch {
    return `invalid source link: ${href}`;
  }
  if (!target) return null;
  const absolute = path.resolve(repoRoot, path.dirname(filePath), target);
  const root = path.resolve(repoRoot);
  const relative = path.relative(root, absolute);
  if (relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) {
    return `source link leaves the repository: ${href}`;
  }
  if (!fs.existsSync(absolute)) return `source link does not resolve from this document: ${href}`;
  const actualRelative = path.relative(fs.realpathSync(root), fs.realpathSync(absolute));
  if (actualRelative.startsWith(`..${path.sep}`) || actualRelative === ".." || path.isAbsolute(actualRelative)) {
    return `source link resolves outside the repository: ${href}`;
  }
  return null;
}

export function validateChangedSourceFootnoteLinks(markdown, {
  baselineMarkdown = null,
  filePath,
  repoRoot,
} = {}) {
  if (!filePath || !repoRoot) throw new Error("filePath and repoRoot are required");
  const references = referenceDefinitions(markdown);
  const baselineReferences = referenceDefinitions(baselineMarkdown ?? "");
  const usedReferences = usedReferenceIds(markdown);
  const baselineDefinitions = baselineMarkdown === null ? new Map() : footnoteDefinitions(baselineMarkdown);
  const definitions = footnoteDefinitions(markdown);
  const paragraphs = paragraphsWithLines(markdown);
  const footnoteLines = new Set();
  for (const { line, endLine } of definitions.values()) {
    for (let number = line; number <= endLine; number += 1) footnoteLines.add(number);
  }
  const changed = changedParagraphs(markdown, baselineMarkdown);
  const changedRefs = new Set();
  const errors = [];
  let inFence = false;
  const fencedLines = new Set();
  for (const [index, line] of markdown.split(/\r?\n/).entries()) {
    if (/^\s*(?:```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) fencedLines.add(index + 1);
  }

  for (const paragraph of changed) {
    for (const match of paragraph.body.matchAll(/\[\^([A-Za-z0-9][A-Za-z0-9._-]*)\]/g)) {
      changedRefs.add(match[1]);
    }
    for (const { text, line } of paragraph.lines) {
      if (fencedLines.has(line) || footnoteLines.has(line) ||
          /^\s*\[[^\]^][^\]]*\]:/.test(text)) continue;
      for (const href of markdownLinks(text, references)) {
        const message = localLinkError(href, { filePath, repoRoot });
        if (message) errors.push({ line, message });
      }
    }
  }

  for (const [id, definition] of definitions) {
    if (baselineDefinitions.get(id)?.body === definition.body && !changedRefs.has(id)) continue;
    const { body, line } = definition;
    const statement = paragraphs.filter((paragraph) =>
      paragraph.body.includes(`[^${id}]`) && !paragraph.body.trimStart().startsWith(`[^${id}]:`),
    ).map((paragraph) => paragraph.body).join("\n");
    const links = [...markdownLinks(body, references), ...markdownLinks(statement, references)];
    for (const namedPath of sourcePaths(body)) {
      if (!links.some((href) => sourceLinkMatches(namedPath, href))) {
        errors.push({ line, message: `Footnote ${id} names ${namedPath} without a link to that source` });
      }
    }
    for (const href of markdownLinks(body, references)) {
      const message = localLinkError(href, { filePath, repoRoot });
      if (message) errors.push({ line, message: `Footnote ${id} ${message}` });
    }
  }

  for (const [id, { href, line }] of references) {
    if (!usedReferences.has(id)) continue;
    if (baselineReferences.get(id)?.href === href &&
        !changed.some((paragraph) => paragraph.body.includes(`][${id}]`))) continue;
    const message = localLinkError(href, { filePath, repoRoot });
    if (message) errors.push({ line, message: `Reference link ${id} ${message}` });
  }
  return errors;
}
