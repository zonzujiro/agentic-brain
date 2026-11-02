#!/usr/bin/env node
// Feedback intake is exempt from gates: findings are advisory, never a write blocker.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
export function inspectIncidents(text) {
  const records = text.split('## Incident Records')[1] ?? '';
  return records.split(/^## (?=\d{2}\.\d{2}\.\d{4})/m).slice(1).flatMap(record => {
    const title = record.split('\n')[0], findings = [];
    for (const section of ['What failed', 'Evidence', 'What happened next', 'Proposed fix']) {
      if (!new RegExp(`^### ${section}\\s*$`, 'm').test(record)) findings.push(`${title}: consider adding ${section}`);
    }
    if (/\|\s*Status\s*\|\s*fixed\s*\|/i.test(record) && !/^### Repair verification\s*$/m.test(record)) findings.push(`${title}: fixed needs repair verification and regression evidence`);
    return findings;
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const text=fs.readFileSync(new URL('../governance/quality/quality-incidents.md',import.meta.url),'utf8');
  console.log(JSON.stringify({advisory:inspectIncidents(text),blocking:false},null,2));
}
