#!/usr/bin/env node
// Reports projects that may be the same work, and stays quiet about pairs a human
// has listed as not the same.
//
// Exit 0 for any finding. Exit 1 only when project-relations.json cannot be used,
// because a record that cannot be read silently hides every pair already cleared.

import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { check, renderReport, renderAnnotations, RELATIONS_PATH } from "./lib/project-overlap/detect.mjs";

export function parseArgs(argv) {
  const at = (flag) => {
    const index = argv.indexOf(flag);
    return index >= 0 ? argv[index + 1] : null;
  };
  return {
    rootDir: path.resolve(at("--root") ?? process.cwd()),
    json: argv.includes("--json"),
    github: argv.includes("--github"),
    showCleared: argv.includes("--show-cleared"),
    changedSince: at("--changed-since"),
  };
}

// The projects a pull request touched, on both surfaces. Uses a merge-base diff:
// a two-dot diff against a diverged base pulls in projects the branch never
// touched. Returns null when git cannot answer, which annotates everything rather
// than nothing.
export function touchedKeys(rootDir, base) {
  if (!base) return null;
  const result = spawnSync(
    "git",
    ["diff", "--name-only", `${base}...HEAD`, "--", "projects-in-progress/", "production-features/"],
    { cwd: rootDir, encoding: "utf8", timeout: 15_000 },
  );
  if (result.status !== 0) return null;
  const keys = new Set();
  for (const line of (result.stdout ?? "").split(/\r?\n/)) {
    const match = line.match(/^(projects-in-progress|production-features)\/([^/]+)\//);
    if (match) keys.add(`${match[1]}/${match[2]}`);
  }
  return keys;
}

export function main(argv = process.argv.slice(2)) {
  const { rootDir, json, github, showCleared, changedSince } = parseArgs(argv);
  const result = check(rootDir);

  if (result.relationError) {
    console.error(`${RELATIONS_PATH} cannot be used, so cleared pairs were not applied:`);
    console.error(`  ${result.relationError}`);
    console.error("Fix the file: until then every cleared pair will be reported again.");
    return 1;
  }

  if (json) {
    console.log(
      JSON.stringify(
        {
          scanned: result.scanned,
          findings: result.findings,
          cleared: result.cleared,
          ignored: result.ignored,
          blind: result.blind,
          dormant: result.dormant,
          unreadable: result.projects.flatMap((p) => p.unreadable.map((u) => `${p.slug}/${u.path}`)),
        },
        null,
        2,
      ),
    );
    return 0;
  }

  if (github) {
    for (const line of renderAnnotations(result, { touchedKeys: touchedKeys(rootDir, changedSince) })) {
      console.log(line);
    }
    return 0;
  }

  console.log(renderReport(result, { showCleared }));
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main();
  } catch (error) {
    // A crash must not read as "no overlap found".
    console.error(`Overlap check could not complete: ${error.message}`);
    process.exitCode = 1;
  }
}
