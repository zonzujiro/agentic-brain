import { validateFootnotes } from "../markdown/footnotes.mjs";

const GUARDED_PATHS = [
  {
    kind: "handoff",
    pattern: /^projects-in-progress\/([^/]+)\/artifacts\/handoff\/handoff-[^/]+\.md$/,
  },
  {
    kind: "technical-rfc",
    pattern:
      /^projects-in-progress\/([^/]+)\/engineering\/rfc-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/,
  },
  {
    kind: "test-plan",
    pattern: /^projects-in-progress\/([^/]+)\/quality\/test-plan\.md$/,
  },
  {
    kind: "bi-requirements",
    pattern: /^projects-in-progress\/([^/]+)\/analytics\/bi-requirements\.md$/,
  },
];

const REQUIRED_HEADINGS = {
  handoff: [
    "Downstream Contract",
    "Problem Framing",
    "Downstream Scope",
    "Functional Requirements",
    "User Flows",
    "States and Edge Cases",
    "BI-Relevant Actions",
    "Implementation Context",
    "Source References",
    "Downstream Expectations",
  ],
  "technical-rfc": [
    "Architecture overview",
    "Implementation approach",
    "Reuse of existing product parts",
    "Integrations",
    "External ownership",
    "Error handling",
    "Edge conditions",
    "Backward compatibility",
    "Risks and unknowns",
    "Assumptions and unknowns",
    "BI event integration",
    "Monitoring",
    "Testing considerations",
    "Performance impact",
    "AI usage",
  ],
  "test-plan": [
    "Existing feature coverage",
    "Core test scenarios",
    "Flow coverage mapping",
    "Edge and failure scenarios",
    "Special conditions / environments",
  ],
  "bi-requirements": ["Event map", "Design references", "Reuse assessment"],
};

const PLACEHOLDER_PATTERNS = [
  /\{placeholder\}/i,
  /\bTBD\b/i,
  /\bTODO\b/i,
  /(^|[^.])\.\.\.($|[^.])/,
];

const LIFECYCLE_DRAFT_PATTERNS = [
  /^\s*>?\s*status\s*:\s*draft\b/im,
  /\(draft\)/i,
];

const OPEN_STATE_PATTERNS = [
  /^\s*>?\s*OPEN\s*:/im,
];

function normalizeHeading(heading) {
  return heading
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function tableCells(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
    return [];
  }

  return trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.replace(/[`*_]/g, "").trim());
}

function isWaiverHeader(line) {
  const cells = tableCells(line).map((cell) => cell.toLowerCase());
  return (
    cells.includes("waived requirement") &&
    cells.includes("gap") &&
    cells.includes("reason") &&
    cells.includes("follow-up")
  );
}

export function stripWaiverTables(markdown) {
  const lines = markdown.split(/\r?\n/);
  const kept = [];
  let skippingTable = false;

  for (const line of lines) {
    if (isWaiverHeader(line)) {
      skippingTable = true;
      continue;
    }

    if (skippingTable) {
      if (line.trim().startsWith("|")) {
        continue;
      }
      skippingTable = false;
    }

    kept.push(line);
  }

  return kept.join("\n");
}

export function classifyRootDocPath(filePath) {
  for (const entry of GUARDED_PATHS) {
    const match = filePath.match(entry.pattern);
    if (match) {
      return {
        kind: entry.kind,
        project: match[1],
        ...(entry.kind === "technical-rfc" ? { rfcSlug: match[2] } : {}),
        path: filePath,
      };
    }
  }

  return null;
}

export function isGuardedRootDoc(filePath) {
  return classifyRootDocPath(filePath) !== null;
}

export function extractHeadings(markdown) {
  markdown = stripFences(markdown);
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/)?.[1])
    .filter(Boolean)
    .map(normalizeHeading);
}

function extractSection(markdown, heading) {
  markdown = stripFences(markdown);
  const wanted = normalizeHeading(heading);
  const lines = markdown.split(/\r?\n/);
  const section = [];
  let inSection = false;
  let startLevel = 0;

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (match) {
      const level = match[1].length;
      const normalized = normalizeHeading(match[2]);
      if (inSection && level <= startLevel) {
        break;
      }
      if (normalized === wanted) {
        inSection = true;
        startLevel = level;
        continue;
      }
    }

    if (inSection) {
      section.push(line);
    }
  }

  return section.join("\n").trim();
}

function addRequiredHeadingErrors({ headings, kind, errors }) {
  const found = new Set(headings);
  for (const heading of REQUIRED_HEADINGS[kind] ?? []) {
    if (!found.has(normalizeHeading(heading))) {
      errors.push(`Missing required section: ${heading}`);
    }
  }
}

function validatePlaceholders(markdown, errors) {
  const withoutWaivers = stripWaiverTables(markdown);
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(withoutWaivers)) {
      errors.push("Contains placeholder text outside a local waiver table");
      return;
    }
  }
}

function validateDraftMarkers(markdown, errors, { allowOpenMarkers = false } = {}) {
  const withoutWaivers = stripWaiverTables(markdown);

  const patterns = allowOpenMarkers
    ? LIFECYCLE_DRAFT_PATTERNS
    : [...LIFECYCLE_DRAFT_PATTERNS, ...OPEN_STATE_PATTERNS];

  for (const pattern of patterns) {
    if (pattern.test(withoutWaivers)) {
      errors.push("Contains draft/open-state marker in a canonical root doc");
      return;
    }
  }

  for (const line of withoutWaivers.split(/\r?\n/)) {
    const normalizedLine = line.replace(/[`*_]/g, "").trim().toLowerCase();
    if (["to confirm", "to verify"].includes(normalizedLine)) {
      errors.push("Contains standalone confirmation/verification placeholder");
      return;
    }

    for (const cell of tableCells(line)) {
      const normalizedCell = cell.toLowerCase();
      if (["to confirm", "to verify"].includes(normalizedCell)) {
        errors.push("Contains standalone confirmation/verification placeholder");
        return;
      }
    }
  }
}

function validateTestPlan(markdown, errors) {
  const coreScenarios = extractSection(markdown, "Core test scenarios");
  if (!/\bTC-\d+\b/i.test(coreScenarios)) {
    errors.push("Core test scenarios must include at least one stable TC-* ID");
  }

  const flowMapping = extractSection(markdown, "Flow coverage mapping");
  if (!/\bUF-\d+\b/i.test(flowMapping) || !/\bTC-\d+\b/i.test(flowMapping)) {
    errors.push("Flow coverage mapping must map UF-* IDs to TC-* IDs");
  }
}

function validateBiRequirements(markdown, errors) {
  const eventMap = extractSection(markdown, "Event map");
  if (!/\b(?:EV-\d+|evid|event name|event id)\b/i.test(eventMap)) {
    errors.push("Event map must include at least one stable event identifier");
  }
  if (!/\bUF-\d+\b/i.test(eventMap)) {
    errors.push("Event map must include at least one related UF-* ID");
  }
  if (!/\brequired fields?\b/i.test(eventMap)) {
    errors.push("Event map must represent required fields");
  }

  const designReferences = extractSection(markdown, "Design references");
  if (!/\bUF-\d+\b/i.test(designReferences)) {
    errors.push("Design references must use UF-* IDs");
  }
}

export function stripFences(markdown) {
  let fence = null;
  return markdown.split(/\r?\n/).map(line => {
    const match = line.match(/^\s*(`{3,}|~{3,})/);
    if (match && !fence) { fence = match[1]; return ''; }
    if (match && fence && match[1][0] === fence[0] && match[1].length >= fence.length) { fence = null; return ''; }
    return fence ? '' : line;
  }).join('\n');
}

export function validateRootDoc({ filePath, markdown }) {
  const classification = classifyRootDocPath(filePath);
  if (!classification) {
    return { ok: true, filePath, kind: null, errors: [] };
  }

  const errors = [];
  const headings = extractHeadings(markdown);

  addRequiredHeadingErrors({ headings, kind: classification.kind, errors });
  for (const heading of REQUIRED_HEADINGS[classification.kind] ?? []) {
    if (headings.includes(normalizeHeading(heading)) && !extractSection(markdown, heading).replace(/^#+.*$/gm, '').trim()) errors.push(`Empty required section: ${heading}`);
  }
  validatePlaceholders(stripFences(markdown), errors);
  // RFCs are living documents and may carry explicit open questions. They
  // still reject lifecycle labels such as `Status: Draft`; review is not a
  // finality transition.
  validateDraftMarkers(markdown, errors, {
    allowOpenMarkers: classification.kind === "technical-rfc",
  });
  errors.push(...validateFootnotes(markdown));

  if (classification.kind === "test-plan") {
    validateTestPlan(markdown, errors);
  }

  if (classification.kind === "bi-requirements") {
    validateBiRequirements(markdown, errors);
  }

  return {
    ok: errors.length === 0,
    filePath,
    kind: classification.kind,
    errors,
  };
}

export function formatValidationResults(results) {
  const failures = results.filter((result) => !result.ok);
  if (failures.length === 0) {
    return `Root document validation passed (${results.length} checked).`;
  }

  return [
    "Root document validation failed:",
    ...failures.flatMap((failure) => [
      `- ${failure.filePath}`,
      ...failure.errors.map((error) => `  - ${error}`),
    ]),
  ].join("\n");
}
