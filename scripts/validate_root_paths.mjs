#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { rootPathViolation } from "./lib/hooks/surfaces.mjs";

export function validateRootPaths(paths) {
  return [...new Set(paths)]
    .sort()
    .flatMap((file) => {
      const violation = rootPathViolation(file);
      return violation ? [{ file, ...violation }] : [];
    });
}

function trackedPaths() {
  const result = spawnSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || "git ls-files failed");
  }
  return result.stdout
    .split("\0")
    .filter(Boolean)
    .filter((file) => existsSync(path.join(process.cwd(), file)));
}

export function main() {
  const findings = validateRootPaths(trackedPaths());
  if (findings.length === 0) {
    console.log("Root path validation passed.");
    return 0;
  }

  console.error("Root path validation failed:");
  for (const finding of findings) {
    console.error(`- [${finding.rule}] ${finding.file}: ${finding.message}`);
  }
  return 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(`Root path validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
