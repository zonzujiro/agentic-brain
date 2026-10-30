#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { report, formatFindings } from '../lib/hooks/engine.mjs';
export function main(argv = process.argv.slice(2)) {
  let root = process.cwd(); const files = []; let json = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root' && argv[i + 1]) root = path.resolve(argv[++i]);
    else if (argv[i] === '--file' && argv[i + 1]) files.push(argv[++i]);
    else if (argv[i] === '--json') json = true;
    else throw new Error(`unknown or incomplete argument: ${argv[i]}`);
  }
  if (!files.length) throw new Error('--file is required');
  const findings = files.flatMap(file => report(root, file));
  console.log(json ? JSON.stringify({ findings }) : formatFindings(findings));
  return findings.some(f => f.severity !== "advisory") ? 1 : 0;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { process.exitCode = main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
