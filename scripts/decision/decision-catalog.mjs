#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { validateDecisionRecord } from "../validate_decisions.mjs";

import { parseFrontmatter } from "../lib/markdown/frontmatter.mjs";

export const RELATIONSHIP_KEYS = [
  "amends",
  "supersedes",
];

function stripBom(text) {
  return text.replace(/^\uFEFF/, "");
}

function splitMarkdown(text) {
  const normalized = stripBom(text);
  const lines = normalized.split(/\r?\n/);

  if (lines[0] !== "---") {
    return { bodyLines: lines };
  }

  let closingIndex = 1;
  while (closingIndex < lines.length && lines[closingIndex] !== "---") {
    closingIndex += 1;
  }

  if (closingIndex >= lines.length) {
    return { bodyLines: lines };
  }

  return { bodyLines: lines.slice(closingIndex + 1) };
}

function normalizeString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function sanitizeInline(value) {
  return value.replace(/\s+/g, " ").trim();
}

function compareCatalogEntries(a, b) {
  return a.path.localeCompare(b.path);
}

export function extractTitle(text) {
  const { bodyLines } = splitMarkdown(text);
  const heading = bodyLines.find((line) => line.startsWith("# "));
  return heading ? heading.slice(2).trim() : null;
}

export function buildDecisionCatalog(targetDir) {
  const resolvedTargetDir = path.resolve(targetDir);
  const decisionsDir = path.join(resolvedTargetDir, "decisions");

  if (!fs.existsSync(decisionsDir)) {
    throw new Error(`No decisions directory found under ${resolvedTargetDir}`);
  }

  const entries = fs.readdirSync(decisionsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(decisionsDir, entry.name))
    .map((filePath) => {
    const text = stripBom(fs.readFileSync(filePath, "utf8"));
    const relativePath = path.relative(resolvedTargetDir, filePath);
    const errors = validateDecisionRecord({markdown: text, filePath: filePath});
    if (errors.length) throw new Error(errors.join("\n"));
    const meta = parseFrontmatter(text);

    return {
      id: normalizeString(meta.id),
      date: normalizeString(meta.date),
      summary: normalizeString(meta.summary),
      title: extractTitle(text) ?? path.basename(filePath, ".md"),
      path: relativePath,
      relationships: Object.fromEntries(
        RELATIONSHIP_KEYS.map((key) => [key, normalizeArray(meta[key])]),
      ),
    };
    });

  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  for (const entry of entries) {
    entry.relationships.amended_by = [];
    entry.relationships.superseded_by = [];
  }
  // Reverse lineage can originate in another project; the catalog remains scoped
  // to this project's entries while inspecting sibling metadata for references.
  const relationshipSources = [...entries];
  const projectsRoot = path.dirname(resolvedTargetDir);
  if (path.basename(projectsRoot) === "projects-in-progress") {
    for (const project of fs.readdirSync(projectsRoot, {withFileTypes: true})) {
      const sibling = path.join(projectsRoot, project.name);
      if (!project.isDirectory() || sibling === resolvedTargetDir) continue;
      const dir = path.join(sibling, "decisions");
      if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) continue;
      for (const file of fs.readdirSync(dir, {withFileTypes: true})) {
        if (!file.isFile() || !file.name.endsWith(".md")) continue;
        const text = stripBom(fs.readFileSync(path.join(dir, file.name), "utf8"));
        const errors = validateDecisionRecord({markdown: text, filePath: path.join(dir, file.name)});
        if (errors.length) throw new Error(errors.join("\n"));
        const meta = parseFrontmatter(text);
        relationshipSources.push({id: meta.id, relationships: Object.fromEntries(RELATIONSHIP_KEYS.map(key => [key, normalizeArray(meta[key])]))});
      }
    }
  }
  for (const entry of relationshipSources) {
    for (const targetId of entry.relationships.amends) {
      const target = byId.get(targetId);
      if (target) target.relationships.amended_by.push(entry.id);
    }
    for (const targetId of entry.relationships.supersedes) {
      const target = byId.get(targetId);
      if (target) target.relationships.superseded_by.push(entry.id);
    }
  }

  return entries.sort(compareCatalogEntries);
}

export function formatCatalog(entries) {
  return entries
    .map((entry) => {
      const relationshipSummary = [...RELATIONSHIP_KEYS, "amended_by", "superseded_by"].flatMap((key) =>
        entry.relationships[key]?.length ? [`${key}=${entry.relationships[key].join(",")}`] : [],
      ).join(" | ");
      const parts = [
        entry.id ?? "(no-id)",
        entry.title,
      ];

      if (entry.summary) {
        parts.push(`summary=${sanitizeInline(entry.summary)}`);
      }

      parts.push(`path=${entry.path}`);

      if (entry.date) {
        parts.push(`date=${entry.date}`);
      }

      if (relationshipSummary) {
        parts.push(relationshipSummary);
      }

      return parts.join(" | ");
    })
    .join("\n");
}

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    json: false,
    targetDir: null,
  };

  while (args.length > 0) {
    const arg = args.shift();

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (!options.targetDir) {
      options.targetDir = arg;
      continue;
    }

    throw new Error(`Unexpected argument: ${arg}`);
  }

  if (!options.targetDir) {
    throw new Error(
      "Usage: node scripts/decision/decision-catalog.mjs <target-dir> [--json]",
    );
  }

  return options;
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  const entries = buildDecisionCatalog(options.targetDir);

  if (options.json) {
    process.stdout.write(`${JSON.stringify(entries, null, 2)}\n`);
    return;
  }

  process.stdout.write(`${formatCatalog(entries)}\n`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
