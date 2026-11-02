#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  classifyRootDocPath,
  formatValidationResults,
  isGuardedRootDoc,
  validateRootDoc,
} from "./lib/root-docs/validator.mjs";

const SKIP_DIRS = new Set([".git", "node_modules", ".yarn", ".brain"]);

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  }

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function listMarkdownFiles(dir = ".") {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath.replace(/\\/g, "/").replace(/^\.\//, ""));
    }
  }

  return files;
}

function changedWorkingTreeFiles() {
  const changed = runGit(["diff", "--name-only", "--diff-filter=ACMRT", "HEAD"]);
  const untracked = runGit(["ls-files", "--others", "--exclude-standard"]);
  return [...new Set([...changed, ...untracked])];
}

function changedPrFiles() {
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA || "HEAD";

  if (!base) {
    throw new Error("BASE_SHA is required for --mode pr");
  }

  // Three-dot diff scopes validation to the PR's own changes; a two-dot diff
  // against the moving base tip blames stale branches for master's commits.
  return runGit(["diff", "--name-only", "--diff-filter=ACMRT", `${base}...${head}`]);
}

function parseArgs(argv) {
  const modeIndex = argv.indexOf("--mode");
  if (modeIndex >= 0) {
    return { mode: argv[modeIndex + 1] };
  }

  if (argv.includes("--all")) {
    return { mode: "all" };
  }

  if (argv.includes("--changed")) {
    return { mode: "changed" };
  }

  return { mode: "changed" };
}

function filesForMode(mode) {
  if (mode === "all") {
    return listMarkdownFiles();
  }

  if (mode === "pr") {
    return changedPrFiles();
  }

  if (mode === "changed") {
    return changedWorkingTreeFiles();
  }

  throw new Error(`Unknown validation mode: ${mode}`);
}

export function main(argv = process.argv.slice(2)) {
  const { mode } = parseArgs(argv);
  const files = filesForMode(mode)
    .filter(isGuardedRootDoc)
    .filter((file) => fs.existsSync(file));

  if (files.length === 0) {
    console.log("Root document validation skipped (no guarded docs changed).");
    return 0;
  }

  const results = files.map((filePath) => {
    const classification = classifyRootDocPath(filePath);
    const projectReadmePath = classification?.scope
      ? `projects-in-progress/${classification.project}/README.md`
      : null;

    return validateRootDoc({
      filePath,
      markdown: fs.readFileSync(filePath, "utf8"),
      projectReadmeMarkdown:
        projectReadmePath && fs.existsSync(projectReadmePath)
          ? fs.readFileSync(projectReadmePath, "utf8")
          : "",
    });
  });

  console.log(formatValidationResults(results));
  return results.every((result) => result.ok) ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
