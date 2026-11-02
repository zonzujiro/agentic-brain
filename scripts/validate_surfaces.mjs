import fs from 'node:fs';
import path from 'node:path';
// Enforce the current minimal active-project contract, not the source's
// discipline metadata schema or excluded artifact templates.
export function validateSurfaces(root) {
  const errors = [], active = path.join(root, 'projects-in-progress');
  if (!fs.existsSync(active)) return errors;
  for (const entry of fs.readdirSync(active, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) { errors.push(`projects-in-progress/${entry.name}: canonical project entries must not be symlinks`); continue; }
    if (!entry.isDirectory()) continue;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) errors.push(`projects-in-progress/${entry.name}: use the project starter's kebab-case slug`);
    const file = path.join(active, entry.name, 'README.md');
    try {
      if (!fs.lstatSync(file).isFile() || !fs.readFileSync(file, 'utf8').trim()) errors.push(`${file}: project README must be a non-empty regular file`);
      const text = fs.readFileSync(file, 'utf8').replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '');
      const sections = new Map();
      let heading;
      for (const line of text.split('\n')) {
        if (/^## /.test(line)) { heading=line.slice(3).trim().toLowerCase(); sections.set(heading, ''); }
        else if (heading) sections.set(heading, sections.get(heading) + line + '\n');
      }
      for (const section of ['Scope and responsibilities', 'Boundaries and dependencies']) {
        if (!sections.get(section.toLowerCase())?.replace(/^#+.*$/gm, '').trim()) errors.push(`${file}: missing or empty ${section}`);
      }
    } catch (error) { errors.push(`${file}: project README unavailable (${error.code})`); }
  }
  return errors;
}
