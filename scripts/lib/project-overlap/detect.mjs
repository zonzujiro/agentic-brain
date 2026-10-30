// Adapted identifier-only candidate detector. Shared identifiers are not proof of duplicate work.
import fs from "node:fs";
import path from "node:path";

export const RELATIONS_PATH = "projects-in-progress/project-relations.json";

const TEXT = new Set([".md", ".json", ".yaml", ".yml"]);
const SKIP_DIR = new Set([".git", ".brain", "node_modules", ".yarn"]);


// An exactly-named heading. Matching a keyword anywhere in a heading turned
// "Evidence / Confidence Ledger", "Source Gaps" and "Design References" into
// claim position, and "Key links" into one project claiming another's ticket.
const SOURCE_HEADING =
  /^(?:existing |additional |primary |canonical )?(?:sources?|source (?:links?|references?)|references?)$/i;


// Routing and low-entropy fields. Two projects sharing a domain is normal, and no
// count-based ceiling can catch that at a document frequency of two.
const ROUTING = new Set([
  "status", "owner", "owner_team", "domain", "lifecycle", "project_shape", "title",
  "summary", "participants", "notifications_enabled", "notify", "created",
  "updated", "tags", "bootstrap_status", "slack_channel",
]);

const DORMANT = new Set(["retired", "archived", "superseded", "cancelled", "abandoned"]);

// A Slack conversation id has a digit. `\b[CG][A-Z0-9]{8,}\b` alone matches the
// ordinary word COMPONENTS, so two Sources sections mentioning it produced a
// false overlap. Case is preserved for Figma and Drive ids because they are
// opaque and case-sensitive - lowercasing them collapsed two different files
// into one identity.
const PATTERNS = [
  ["figma", /figma\.com\/(?:file|design|board|proto|slides)\/([A-Za-z0-9]{10,})/gi, false],
  ["gdrive", /(?:docs|drive)\.google\.com\/(?:[A-Za-z0-9]+\/)*d\/([A-Za-z0-9_-]{20,})/gi, false],
  ["slack", /\b([CG](?=[A-Z0-9]*\d)[A-Z0-9]{8,})\b/g, false],
  ["spec", /\b(specs\.[A-Za-z0-9][A-Za-z0-9._-]*)/g, false],
];

const JIRA_KEY = /\b([A-Z][A-Z0-9]{1,9})-(\d+)\b/g;
const BROWSE = /atlassian\.net\/browse\/([A-Z][A-Z0-9]{1,9})-\d+/g;

// A Slack channel is shared as a matter of course; twenty projects on one is what
// made an earlier implementation report 190 of 190 pairs.
export const SLACK_CEILING = 4;

// A cluster naming more members than this is truncated in the report rather than
// printed in full - fifty members produced a 739-character line.
const MEMBERS_SHOWN = 6;

function walk(dir, rel = "", files = [], unreadable = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    // A directory we cannot open is a coverage gap, not silence.
    unreadable.push({ path: rel || ".", reason: error.code ?? "unreadable" });
    return { files, unreadable };
  }
  for (const entry of entries) {
    if (SKIP_DIR.has(entry.name)) continue;
    const next = rel ? `${rel}/${entry.name}` : entry.name;
    const absolute = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) {
      unreadable.push({ path: next, reason: "symlink not traversed" });
    } else if (entry.isDirectory()) {
      walk(absolute, next, files, unreadable);
    } else if (entry.isFile() && TEXT.has(path.extname(entry.name).toLowerCase())) {
      try {
        files.push({ path: next, text: fs.readFileSync(absolute, "utf8") });
      } catch (error) {
        unreadable.push({ path: next, reason: error.code ?? "unreadable" });
      }
    }
  }
  return { files, unreadable };
}

// field -> its raw lines. A document may open with `---` as a horizontal rule, and
// reading that as frontmatter made body prose claim position, so a blank first
// line disqualifies the block.
export function frontmatter(text) {
  text = text.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
  const fields = new Map();
  if (!text.startsWith("---\n")) return fields;
  if (/^\s*$/.test(text.slice(4).split("\n", 1)[0])) return fields;
  const end = text.indexOf("\n---", 4);
  if (end === -1) return fields;

  let current = null;
  for (const line of text.slice(4, end).split("\n")) {
    const top = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (top) {
      current = top[1];
      fields.set(current, top[2] ? [top[2]] : []);
    } else if (current && /^\s+\S/.test(line)) {
      fields.get(current).push(line.trim());
    }
  }
  return fields;
}

export function scalar(lines) {
  const raw = (lines ?? [])[0] ?? "";
  // Strips an inline comment and quotes, so `status: retired # tombstone` and
  // `status: "retired"` both read as retired.
  return raw.replace(/\s+#.*$/, "").replace(/^["']|["']$/g, "").trim();
}

export function sourceSections(text) {
  const collected = [];
  let level = 0;
  let inside = false;
  for (const line of text.split("\n")) {
    const heading = line.match(/^(#{1,6})\s+(.*?)\s*$/);
    if (heading) {
      if (inside && heading[1].length <= level) inside = false;
      if (SOURCE_HEADING.test(heading[2])) {
        inside = true;
        level = heading[1].length;
      }
      continue;
    }
    if (inside) collected.push(line);
  }
  return collected.join("\n");
}

// Compared by last path segment, because one project wrote a bare package name
// and another the full path to the same package. A scope is kept when present, so
// @team-a/ui and @team-b/ui stay distinct.
export function packageNames(lines) {
  const names = [];
  for (const line of lines) {
    const raw = line.replace(/^-\s*/, "").replace(/^["']|["']$/g, "").trim();
    if (!raw) continue;
    const scoped = raw.match(/(@[a-z0-9._-]+\/[a-z0-9._-]+)$/i);
    const value = scoped ? scoped[1] : raw.split("/").filter(Boolean).pop();
    if (value && /^@?[a-z0-9][a-z0-9._/-]*$/i.test(value)) names.push(value.toLowerCase());
  }
  return names;
}

export function readProjects(root, surface = "projects-in-progress") {
  let entries = [];
  try {
    entries = fs.readdirSync(path.join(root, surface), { withFileTypes: true });
  } catch {
    if (!fs.existsSync(path.join(root, surface))) return [];
    throw new Error(`Cannot read ${surface}`);
  }
  return entries
    .filter((entry) => entry.isDirectory() && !SKIP_DIR.has(entry.name))
    .map((entry) => {
      const dir = path.join(root, surface, entry.name);
      const corpus = walk(dir);
      const metadata = frontmatter(corpus.files.find((file) => file.path === "README.md")?.text ?? "");
      const title = scalar(metadata.get("title"));
      return {
        slug: entry.name,
        surface,
        dir,
        ...corpus,
        title,
        owner: scalar(metadata.get("owner")),
        // A tombstone is either an explicit status or a title that says so.
        dormant:
          surface === "projects-in-progress" &&
          (DORMANT.has(scalar(metadata.get("status")).toLowerCase()) ||
            /\((retired|archived|superseded)\)\s*$/i.test(title)),
      };
    });
}

export function provenPrefixes(projects) {
  const proven = new Set();
  for (const project of projects) {
    for (const file of project.files) {
      for (const match of file.text.matchAll(BROWSE)) proven.add(match[1]);

    }
  }
  return proven;
}

export function claims(project, prefixes) {
  const found = new Map();
  const add = (kind, value, file, where) => {
    const key = `${kind}:${value}`;
    if (!found.has(key)) found.set(key, { kind, value, key, file, where });
  };

  for (const file of project.files) {
    // A decision record's Sources are evidence for the decision. AGENTS.md is
    // harness context that cites whatever it needs to.
    if (/(^|\/)decisions\//.test(file.path) || path.basename(file.path) === "AGENTS.md") continue;

    const chunks = [];
    if (file.path === "README.md") {
      const metadata = frontmatter(file.text);
      for (const [field, lines] of metadata) {
        if (!ROUTING.has(field) && field !== "packages") {
          chunks.push({ text: lines.join("\n"), where: `frontmatter ${field}` });
        }
      }
      for (const name of packageNames(metadata.get("packages") ?? [])) {
        add("package", name, file.path, "frontmatter packages");
      }
    }
    if (file.path.endsWith(".md")) {
      const section = sourceSections(file.text);
      if (section.trim()) chunks.push({ text: section, where: "sources section" });
    }


    for (const { text, where } of chunks) {
      for (const [kind, pattern] of PATTERNS) {
        for (const match of text.matchAll(pattern)) add(kind, match[1], file.path, where);
      }
      for (const match of text.matchAll(JIRA_KEY)) {
        if (prefixes.has(match[1])) add("jira", match[0], file.path, where);
      }
    }
  }
  return [...found.values()];
}

export function readRelations(root) {
  const absolute = path.join(root, RELATIONS_PATH);
  let text;
  try {
    text = fs.readFileSync(absolute, "utf8");
  } catch (error) {
    // No record yet is normal. Anything else is a coverage loss and must be loud.
    if (error.code === "ENOENT") return { cleared: [], error: null };
    return { cleared: [], error: `cannot read ${RELATIONS_PATH}: ${error.code}` };
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return { cleared: [], error: `${RELATIONS_PATH} is not valid JSON: ${error.message}` };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { cleared: [], error: `${RELATIONS_PATH}: expected an object` };
  if (parsed.not_same !== undefined && !Array.isArray(parsed.not_same)) {
    return { cleared: [], error: `${RELATIONS_PATH}: "not_same" must be an array` };
  }
  const cleared = [];
  for (const [index, pair] of (parsed.not_same ?? []).entries()) {
    if (!Array.isArray(pair) || pair.length < 2 || new Set(pair).size !== pair.length || pair.some((s) => typeof s !== "string" || !/^(?:(projects-in-progress|production-features)\/)?[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s))) {
      return { cleared: [], error: `${RELATIONS_PATH}: not_same[${index}] must contain distinct surface-qualified project names` };
    }
    const qualified = pair.map(s => s.includes("/") ? s : `projects-in-progress/${s}`);
    if (new Set(qualified).size !== qualified.length) return { cleared: [], error: `${RELATIONS_PATH}: duplicate member` };
    cleared.push(qualified);
  }
  return { cleared, error: null };
}

export function check(root) {
  const allActive = readProjects(root);
  // Dormant projects leave the corpus here. Suppressing an already-built cluster
  // because one member is retired hid the live duplicates in it.
  const active = allActive.filter((project) => !project.dormant);
  const shipped = readProjects(root, "production-features");
  const corpus = [...active, ...shipped];
  const prefixes = provenPrefixes(corpus);

  const postings = new Map();
  const claimsBySlug = new Map();
  for (const project of corpus) {
    const found = claims(project, prefixes);
    claimsBySlug.set(`${project.surface}/${project.slug}`, found);
    for (const claim of found) {
      if (!postings.has(claim.key)) postings.set(claim.key, new Map());
      postings.get(claim.key).set(`${project.surface}/${project.slug}`, { project, claim });
    }
  }

  const grouped = new Map();
  const ignored = [];
  const put = (members, evidence) => {
    const list = [...members].sort((a, b) =>
      `${a.surface}/${a.slug}`.localeCompare(`${b.surface}/${b.slug}`),
    );
    const key = list.map((m) => `${m.surface}/${m.slug}`).join("|");
    const group = grouped.get(key) ?? { key, members: list, evidence: [] };
    group.evidence.push(evidence);
    grouped.set(key, group);
  };

  for (const [identity, members] of postings) {
    if (members.size < 2) continue;
    // A cluster made only of shipped features is archived history.
    if (![...members.values()].some(({ project }) => project.surface === "projects-in-progress")) continue;
    if (identity.startsWith("slack:") && members.size > SLACK_CEILING) {
      ignored.push({ identity, count: members.size });
      continue;
    }
    put(
      [...members.values()].map(({ project }) => ({ slug: project.slug, surface: project.surface })),
      {
        identity,
        claims: [...members.values()].map(({ project, claim }) => ({
          slug: project.slug,
          surface: project.surface,
          file: claim.file,
          where: claim.where,
        })),
      },
    );
  }

  // Restarting work that already shipped, under the same folder name.
  for (const project of active) {
    for (const feature of shipped) {
      if (project.slug !== feature.slug) continue;
      put(
        [
          { slug: project.slug, surface: project.surface },
          { slug: feature.slug, surface: feature.surface },
        ],
        { identity: "exact shipped slug", claims: [] },
      );
    }
  }

  const relations = readRelations(root);
  const clearedKeys = new Set(relations.cleared.map((pair) => [...pair].sort().join("|")));
  const findings = [];
  const cleared = [];
  for (const group of grouped.values()) {
    const slugKey = group.members.map((m) => `${m.surface}/${m.slug}`).sort().join("|");
    (clearedKeys.has(slugKey) ? cleared : findings).push(group);
  }

  const blind = active
    .filter((project) => (claimsBySlug.get(`${project.surface}/${project.slug}`) ?? []).length === 0)
    .map((project) => project.slug);

  return {
    projects: [...allActive, ...shipped],
    findings,
    cleared,
    ignored,
    blind,
    dormant: allActive.filter((p) => p.dormant).map((p) => p.slug),
    scanned: { active: active.length, shipped: shipped.length },
    relationError: relations.error,
  };
}

function memberList(members) {
  // Active projects first: the reader is deciding about live work, and a shipped
  // feature is context for that decision.
  const ordered = [...members].sort((a, b) =>
    a.surface === b.surface ? 0 : a.surface === "projects-in-progress" ? -1 : 1,
  );
  const names = ordered.map((m) =>
    m.surface === "production-features" ? `${m.slug} (already shipped)` : m.slug,
  );
  return names.length <= MEMBERS_SHOWN
    ? names.join(" + ")
    : `${names.slice(0, MEMBERS_SHOWN).join(" + ")} + ${names.length - MEMBERS_SHOWN} more`;
}

function ownerSplit(result, members) {
  const owners = new Set(
    members
      .map((m) => result.projects.find((p) => p.slug === m.slug && p.surface === m.surface)?.owner)
      .filter((owner) => owner && owner.toLowerCase() !== "unassigned"),
  );
  return owners.size > 1;
}

export function renderReport(result, { showCleared = false } = {}) {
  const out = [];

  if (result.findings.length === 0) {
    out.push("No unclassified identifier overlap found in the scanned claim positions.");
  } else {
    out.push(
      result.findings.length === 1
        ? "1 group of projects may be the same work:"
        : `${result.findings.length} groups of projects may be the same work:`,
    );
    for (const finding of result.findings) {
      out.push("");
      out.push(`  ${memberList(finding.members)}`);
      for (const evidence of finding.evidence) {
        out.push(`    shares ${evidence.identity}`);
        for (const claim of evidence.claims.slice(0, MEMBERS_SHOWN)) {
          out.push(`      ${claim.slug}: ${claim.file} (${claim.where})`);
        }
      }
      if (ownerSplit(result, finding.members)) {
        out.push("    different owners maintain these, so which one continues is your call");
      }
      out.push("    Review the shared identifiers with the user (use a question tool or a");
      out.push("    numbered plain-text fallback). Two answers: the same project, so the");
      out.push("    folders become one; or not the same, so nothing moves and this stops");
      out.push("    being reported. Do not decide it yourself and do not edit");
      out.push("    project-relations.json without their answer.");
      if (finding.members.length <= MEMBERS_SHOWN) {
        out.push(`    not the same? add: ${JSON.stringify(finding.members.map((m) => `${m.surface}/${m.slug}`))}`);
      } else {
        out.push(
          `    ${finding.members.length} projects share this. Use --json for the complete member list; clear the exact group after owner review.`,
        );
      }
    }
  }

  if (result.blind.length > 0) {
    out.push("");
    out.push(
      `Coverage: ${result.blind.length} of ${result.scanned.active} projects declare no epic, design file, document, channel or package, so only an exact name match could find them: ${result.blind.join(", ")}`,
    );
  }

  const unreadable = result.projects.flatMap((project) =>
    project.unreadable.map((item) => `${project.slug}/${item.path} (${item.reason})`),
  );
  if (unreadable.length > 0) {
    out.push(`Coverage: could not read ${unreadable.join(", ")}`);
  }

  if (result.dormant.length > 0) {
    out.push(`Excluded as retired or archived: ${result.dormant.join(", ")}`);
  }

  // Without this a working run and a broken run both print the same silence.
  if (result.cleared.length > 0) {
    out.push(
      `Quiet: ${result.cleared.length} overlap${result.cleared.length === 1 ? "" : "s"} listed as not the same work` +
        (showCleared ? ":" : " — pass --show-cleared to list them"),
    );
    if (showCleared) {
      for (const group of result.cleared) {
        out.push(`  ${memberList(group.members)}  —  ${group.evidence.map((e) => e.identity).join(", ")}`);
      }
    }
  }

  if (result.ignored.length > 0) {
    out.push(
      `Ignored ${result.ignored.length} channel${result.ignored.length === 1 ? "" : "s"} shared too widely to mean anything: ` +
        result.ignored.map((entry) => `${entry.identity} (${entry.count} projects)`).join(", "),
    );
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Warnings only, and only on the members a pull request touched. An unrelated PR
// was previously annotated for every live overlap in the repository.
export function renderAnnotations(result, { touchedKeys = null } = {}) {
  const lines = [];
  for (const finding of result.findings) {
    const keys = finding.members.map((m) => `${m.surface}/${m.slug}`);
    for (const [index, key] of keys.entries()) {
      if (touchedKeys && !touchedKeys.has(key)) continue;
      const others = keys.filter((_, i) => i !== index);
      lines.push(
        `::warning file=${key}/README.md,line=1::May be the same work as ${others.join(", ")} — shares ${finding.evidence.map((e) => e.identity).join(", ")}`,
      );
    }
  }
  return lines;
}
