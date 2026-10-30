#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parseFrontmatter } from "./lib/markdown/frontmatter.mjs";
import { normalizeRepoDate } from "./lib/repo-date.mjs";

const DECISION_ID = /^DEC-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AFFECTED_DOC_STATUSES = new Set(["pending", "reviewed", "no_change_needed", "blocked"]);
const REQUIRED_FIELDS = ["id", "date", "summary", "participants"];
const FORBIDDEN_FIELDS = ["status", "review", "amended_by", "superseded_by"];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function arrayValue(value) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function sectionBody(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const indexes = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() === `## ${heading}`) indexes.push(index);
  }
  if (indexes.length !== 1) return { count: indexes.length, body: "" };
  const start = indexes[0] + 1;
  let end = lines.length;
  for (let index = start; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) {
      end = index;
      break;
    }
  }
  return { count: 1, body: lines.slice(start, end).join("\n").trim() };
}

function safeRepoPath(value) {
  if (!nonEmptyString(value) || path.isAbsolute(value) || value.includes("\\")) return false;
  const normalized = path.posix.normalize(value);
  return normalized !== "." && normalized !== ".." && !normalized.startsWith("../");
}

function findDecisionDirectories(projectsRoot) {
  if (!fs.existsSync(projectsRoot)) return [];
  return fs.readdirSync(projectsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(projectsRoot, entry.name, "decisions"))
    .filter((dir) => fs.existsSync(dir) && fs.lstatSync(dir).isDirectory());
}

function walk(dir) {
  const output = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...walk(entryPath));
    else if (entry.isFile()) output.push(entryPath);
  }
  return output;
}

export function validateDecisionRecord({ markdown, filePath }) {
  const errors = [];
  const meta = parseFrontmatter(markdown);
  const header = markdown.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n").split("---\n")[1] ?? "";
  const keys = new Set();
  for (const line of header.split("\n")) {
    const scalar = line.match(/^\s*(?:-\s+)?[A-Za-z0-9_-]+:\s*(.*)$/);
    if (scalar && /^[|>\[\{&*!]/.test(scalar[1])) errors.push(`${filePath}: unsupported metadata syntax; use single-line scalars and block lists.`);
    const key = line.match(/^([A-Za-z0-9_-]+):/);
    if (key) {
      if (keys.has(key[1])) errors.push(`${filePath}: duplicate metadata key ${key[1]}.`);
      keys.add(key[1]);
      if (![...REQUIRED_FIELDS, "amends", "supersedes", "affected_docs"].includes(key[1])) errors.push(`${filePath}: unsupported metadata key ${key[1]}.`);
    }
  }
  const rel = filePath;
  const entryPath = filePath;
  for (const key of REQUIRED_FIELDS) {
    const value = meta[key];
    if (key === "participants" ? !Array.isArray(value) || value.length === 0 || value.some(item => !nonEmptyString(item)) : !nonEmptyString(value)) {
      errors.push(`${rel}: frontmatter field ${key} is required and must not be empty.`);
    }
  }
  for (const key of FORBIDDEN_FIELDS) {
    if (Object.hasOwn(meta, key)) {
      errors.push(`${rel}: frontmatter field ${key} is obsolete; the Decision text records its choice, rejection, or supersession.`);
    }
  }
  if (meta.date && !normalizeRepoDate(meta.date)) {
    errors.push(`${rel}: date must use DD.MM.YYYY.`);
  }
  const expectedId = `DEC-${path.basename(entryPath, ".md")}`;
  if (!DECISION_ID.test(meta.id ?? "") || meta.id !== expectedId) {
    errors.push(`${rel}: id must be ${expectedId}, matching the file name.`);
  }

  const decision = sectionBody(markdown, "Decision");
  if (decision.count !== 1 || !decision.body) {
    errors.push(`${rel}: include exactly one non-empty ## Decision section written for a reader.`);
  }

  const rejection = sectionBody(markdown, "Rejection");
  if (rejection.count > 1 || (rejection.count === 1 && !rejection.body)) {
    errors.push(`${rel}: ## Rejection must appear at most once and explain what was rejected.`);
  }
  const supersession = sectionBody(markdown, "Supersession");
  if (supersession.count > 1 || (supersession.count === 1 && !supersession.body)) {
    errors.push(`${rel}: ## Supersession must appear at most once and explain what replaced the Decision.`);
  }

  for (const key of ["amends", "supersedes"]) {
    for (const target of arrayValue(meta[key])) {
      if (!DECISION_ID.test(String(target))) {
        errors.push(`${rel}: ${key} entry ${JSON.stringify(target)} must be a DEC-... id.`);
      }
      if (target === meta.id) errors.push(`${rel}: ${key} cannot reference the Decision itself.`);
    }
  }

  if (meta.affected_docs !== undefined) {
    if (!Array.isArray(meta.affected_docs) || meta.affected_docs.length === 0) {
      errors.push(`${rel}: affected_docs must be a non-empty array when present.`);
    } else {
      const seenPaths = new Set();
      for (const [index, affected] of meta.affected_docs.entries()) {
        const at = `${rel}: affected_docs[${index}]`;
        if (!affected || typeof affected !== "object" || Array.isArray(affected)) {
          errors.push(`${at} must be an object with path and status.`);
          continue;
        }
        if (!safeRepoPath(affected.path)) errors.push(`${at}.path must be a safe repo-relative path.`);
        if (affected.doc !== undefined || affected.owner !== undefined) {
          errors.push(`${at} uses obsolete doc/owner metadata; use path and resolve ownership from the target document or project.`);
        }
        if (!AFFECTED_DOC_STATUSES.has(affected.status)) {
          errors.push(`${at}.status must be pending, reviewed, no_change_needed, or blocked.`);
        }
        if (seenPaths.has(affected.path)) errors.push(`${at}.path duplicates an earlier affected document.`);
        seenPaths.add(affected.path);
        if (["pending", "blocked"].includes(affected.status) && affected.resolved_at !== undefined) errors.push(`${at}: unresolved entries must not carry resolved_at.`);
        if (affected.resolved_at !== undefined && !normalizeRepoDate(String(affected.resolved_at))) {
          errors.push(`${at}.resolved_at must use DD.MM.YYYY.`);
        }
      }
    }
  }
  return errors;
}

export function validateDecisions(repoRoot = process.cwd()) {
  const errors = [];
  const records = [];
  const decisionsDirs = findDecisionDirectories(path.join(repoRoot, "projects-in-progress"));

  for (const decisionsDir of decisionsDirs) {
    for (const entry of fs.readdirSync(decisionsDir, { withFileTypes: true })) {
      const entryPath = path.join(decisionsDir, entry.name);
      if (entry.isDirectory()) {
        for (const nested of walk(entryPath)) {
          errors.push(`${toPosix(path.relative(repoRoot, nested))}: Decision files must live directly under decisions/; supporting evidence belongs in its owning project surface.`);
        }
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".md")) {
        errors.push(`${toPosix(path.relative(repoRoot, entryPath))}: decisions/ may contain only Decision Markdown files.`);
        continue;
      }
      if (entry.name.endsWith(".working.md")) {
        errors.push(`${toPosix(path.relative(repoRoot, entryPath))}: a Decision keeps one stable .md path; remove the .working suffix.`);
      }

      const markdown = fs.readFileSync(entryPath, "utf8");
      const meta = parseFrontmatter(markdown);
      const rel = toPosix(path.relative(repoRoot, entryPath));
      records.push({ entryPath, rel, markdown, meta });

      errors.push(...validateDecisionRecord({ markdown, filePath: rel }));
    }
  }

  const byId = new Map();
  for (const record of records) {
    if (byId.has(record.meta.id)) errors.push(`${record.rel}: duplicate Decision id ${record.meta.id}.`);
    else byId.set(record.meta.id, record);
  }

  for (const record of records) {
    for (const key of ["amends", "supersedes"]) {
      for (const targetId of arrayValue(record.meta[key])) {
        if (DECISION_ID.test(String(targetId)) && !byId.has(targetId)) {
          errors.push(`${record.rel}: ${key} references missing Decision ${targetId}.`);
        }
      }
    }
    for (const targetId of arrayValue(record.meta.supersedes)) {
      const target = byId.get(targetId);
      if (!target) continue;
      const section = sectionBody(target.markdown, "Supersession");
      if (section.count !== 1 || !section.body.includes(record.meta.id)) {
        errors.push(`${target.rel}: ## Supersession must name ${record.meta.id}, which supersedes this Decision.`);
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(id, chain = []) {
    if (visiting.has(id)) {
      errors.push(`Decision supersession cycle: ${[...chain, id].join(" -> ")}.`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    const record = byId.get(id);
    for (const target of arrayValue(record?.meta.supersedes)) {
      if (byId.has(target)) visit(target, [...chain, id]);
    }
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of byId.keys()) visit(id);

  return errors;
}

export function main() {
  const errors = validateDecisions();
  if (errors.length > 0) {
    console.error(`Decision validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    return 1;
  }
  console.log("Decision validation passed.");
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
