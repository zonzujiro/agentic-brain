// Portable structured-event and bounded literal-command adapters. No connector receipts.
import fs from "node:fs";
import path from "node:path";

export function hooksDisabled() {
  return process.env.HB_HOOKS === "off";
}

export function readStdinJson() {
  try {
    const raw = fs.readFileSync(0, "utf8");
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// The session shell may sit in a subdirectory of the repo, so the payload cwd
// is a starting point, not the answer: trusting it raw makes subdirectory
// writes look root-level and scatters `.brain/session/` state. Resolve to the
// nearest ancestor holding a `.git` entry (a directory in a normal checkout,
// a file in a linked worktree); when no marker exists (fixture sandboxes,
// out-of-repo runs) keep the starting directory.
export function repoRoot(payload) {
  const start = payload?.cwd && typeof payload.cwd === "string" ? payload.cwd : process.cwd();
  let dir = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(dir, ".git"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return start;
    dir = parent;
  }
}

// Repo-relative path for an in-repo write target; null when the target is
// outside the working tree (out of hook jurisdiction by decided scope).
export function relativeInRepo(rootDir, filePath, cwd = rootDir) {
  if (typeof filePath !== "string" || filePath.length === 0) return null;
  const abs = path.resolve(cwd, filePath);
  const rel = path.relative(rootDir, abs);
  if (rel === ".." || rel.startsWith(".." + path.sep) || path.isAbsolute(rel)) return null;
  return rel.split(path.sep).join("/");
}

function patchText(toolInput) {
  if (typeof toolInput === "string") return toolInput;
  if (!toolInput || typeof toolInput !== "object") return null;
  for (const key of ["patch", "input", "command"]) {
    if (typeof toolInput[key] === "string") return toolInput[key];
  }
  return null;
}

function pathsFromPatch(text, includeRemoved = true) {
  if (typeof text !== "string") return [];
  const paths = [];
  let updateIndex = -1;
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\*\*\* (Add|Update|Delete) File: (.+)$/);
    if (match) {
      updateIndex = -1;
      if (match[1] === "Delete" && !includeRemoved) continue;
      paths.push(match[2].trim());
      if (match[1] === "Update") updateIndex = paths.length - 1;
      continue;
    }
    const move = line.match(/^\*\*\* Move to: (.+)$/);
    if (move) {
      if (!includeRemoved && updateIndex >= 0) paths[updateIndex] = move[1].trim();
      else paths.push(move[1].trim());
      updateIndex = -1;
    }
  }
  return paths;
}

// Host adapters expose direct writes as `file_path`, while Codex apply_patch
// carries one or more paths inside its patch grammar. Keep this parser scoped
// to structured write payloads; shell commands are deliberately never parsed.
export function writtenPaths(payload, { includeRemoved = true } = {}) {
  const toolInput = payload?.tool_input;
  const candidates = [];

  if (toolInput && typeof toolInput === "object") {
    if (typeof toolInput.file_path === "string") {
      candidates.push(toolInput.file_path);
    }
    for (const key of ["file_paths", "paths"]) {
      if (Array.isArray(toolInput[key])) {
        candidates.push(...toolInput[key].filter((value) => typeof value === "string"));
      }
    }
  }

  if (/apply_patch/i.test(payload?.tool_name ?? "") || candidates.length === 0) {
    candidates.push(...pathsFromPatch(patchText(toolInput), includeRemoved));
  }

  return [...new Set(candidates.filter((value) => value.length > 0))];
}

export function shellCommand(payload) {
  const toolInput = payload?.tool_input;
  if (typeof toolInput === "string") return toolInput;
  if (!toolInput || typeof toolInput !== "object") return "";
  for (const key of ["command", "cmd", "input"]) {
    if (typeof toolInput[key] === "string") return toolInput[key];
  }
  return "";
}

function decodeStaticStringLiteral(literal) {
  if (literal.startsWith('"')) {
    try {
      return JSON.parse(literal);
    } catch {
      return null;
    }
  }
  const quote = literal[0];
  if ((quote !== "'" && quote !== "`") || literal.at(-1) !== quote) return null;
  if (quote === "`" && literal.includes("${")) return null;
  return literal.slice(1, -1).replace(/\\([\\'`])/g, "$1").replace(/\\n/g, "\n");
}

// Codex functions.exec carries JavaScript source rather than the nested tool's
// structured payload. Recognize only literal `tools.exec_command({ cmd: ... })`
// calls. This deliberately does not evaluate JavaScript or claim to discover
// computed commands.
export function shellCommands(payload) {
  const direct = shellCommand(payload);
  if (!/functions\.exec/i.test(payload?.tool_name ?? "")) return direct ? [direct] : [];

  const code = typeof payload?.tool_input === "string"
    ? payload.tool_input
    : typeof payload?.tool_input?.code === "string"
      ? payload.tool_input.code
      : typeof payload?.tool_input?.input === "string"
        ? payload.tool_input.input
      : "";
  const commands = [];
  const calls = code.matchAll(/tools\.exec_command\s*\(\s*\{([\s\S]*?)\}\s*\)/g);
  for (const call of calls) {
    const match = call[1].match(/(?:^|,)\s*cmd\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/);
    if (!match) continue;
    const decoded = decodeStaticStringLiteral(match[1]);
    if (decoded !== null) commands.push(decoded);
  }
  return commands;
}

function shellSegments(command) {
  const segments = [];
  let current = "";
  let quote = null;
  let escaped = false;
  for (let index = 0; index < command.length; index += 1) {
    const char = command[index];
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escaped = true;
      continue;
    }
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      current += char;
      continue;
    }
    const separator = char === "\n" || char === "\r" || char === ";" || char === "|" || char === "&";
    if (separator) {
      if (current.trim()) segments.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) segments.push(current.trim());
  return segments;
}

export function classifyAgentDeliveryCommand(command) {
  const segments = shellSegments(command ?? "");
  let push = null;
  for (const segment of segments) {
    const words = shellWords(segment);
    let index = 0;
    while (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[index] ?? "")) index += 1;
    const executable = path.basename(words[index] ?? "");
    if (["sh", "bash", "zsh"].includes(executable) && ["-c", "-lc"].includes(words[index + 1]) && words[index + 2]) {
      const nested = classifyAgentDeliveryCommand(words[index + 2]);
      if (nested.kind !== "none") return { ...nested, compound: true };
    }
    if (executable === "gh") {
      let ghIndex = index + 1;
      while (ghIndex < words.length) {
        if (["-R", "--repo", "--hostname"].includes(words[ghIndex])) ghIndex += 2;
        else if (/^--(?:repo|hostname)=/.test(words[ghIndex])) ghIndex += 1;
        else break;
      }
      if (words[ghIndex] === "pr" && words[ghIndex + 1] === "create") {
        return { kind: "pr-create", command: segment, compound: segments.length > 1 };
      }
    }
    if (executable === "git" && words[index + 1] === "push") {
      push ??= { kind: "git-push", command: segment, compound: segments.length > 1 };
    }
    if (executable === "git" && words[index + 1] === "-C" && words[index + 3] === "push") {
      push ??= { kind: "git-push", command: segment, compound: segments.length > 1 };
    }
  }
  return push ?? { kind: "none", command: "", compound: false };
}

// This is intentionally a narrow agent-tool trigger, not a shell parser. The
// normal delivery path issues a direct `git push`; nested or hand-written shell
// programs are outside the V1 population and remain covered by PR attestation.
export function isDirectGitPush(command) {
  const words = shellWords(command ?? "");
  let index = 0;
  while (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[index] ?? "")) index += 1;
  if (words[index] !== "git") return false;
  if (words[index + 1] === "push") return true;
  return words[index + 1] === "-C" && Boolean(words[index + 2]) && words[index + 3] === "push";
}

export function shellWords(command) {
  const matches = command.match(/(?:[^\s"'\\]+|"(?:\\.|[^"])*"|'[^']*'|\\.)+/g) ?? [];
  return matches.map((word) => {
    if ((word.startsWith('"') && word.endsWith('"')) || (word.startsWith("'") && word.endsWith("'"))) return word.slice(1, -1);
    return word.replace(/\\(.)/g, "$1");
  });
}

export function classifyDirectGitPush(command) {
  if (!isDirectGitPush(command)) return { direct: false, supported: false, reason: "not a direct git push" };
  if (/[\n\r;&|`$<>]/.test(command)) return { direct: true, supported: false, reason: "compound shell syntax is outside the semantic-audit push trigger" };
  const words = shellWords(command);
  if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[0] ?? "")) {
    return { direct: true, supported: false, reason: "inline environment overrides are not preserved by semantic-audit completion; use plain `git push`" };
  }
  if (words.shift() !== "git") return { direct: false, supported: false, reason: "not a direct git push" };
  if (words[0] === "-C") return { direct: true, supported: false, reason: "git -C can select a different repository and is outside the supported push shape" };
  if (words.shift() !== "push") return { direct: false, supported: false, reason: "not a direct git push" };
  const unsafe = words.find((word) => /^(?:-f|--force(?:-with-lease|-if-includes)?|--delete|--mirror|--all|--tags|--prune)$/.test(word));
  if (unsafe) return { direct: true, supported: false, reason: `${unsafe} is not allowed through semantic-audit push completion` };
  const safeFlags = new Set(["-q", "--quiet", "-v", "--verbose", "--porcelain", "--progress", "--no-progress", "--atomic", "--follow-tags"]);
  const unknownFlag = words.find((word) => word.startsWith("-") && !safeFlags.has(word));
  if (unknownFlag) return { direct: true, supported: false, reason: `${unknownFlag} is outside the supported current-branch push shape` };
  const positional = words.filter((word) => !word.startsWith("-"));
  if (positional.length) return { direct: true, supported: false, reason: "explicit remotes, refspecs, or multiple targets are not supported; push the checked-out branch with plain `git push`" };
  if (words.length) return { direct: true, supported: false, reason: "push options are not preserved by semantic-audit completion; use plain `git push`" };
  return { direct: true, supported: true };
}

export async function runAdapter(name, fn) {
  if (hooksDisabled()) {
    process.exit(0);
  }
  try {
    const payload = readStdinJson();
    await fn(payload);
    process.exit(0);
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND") {
      console.error(`hb-hooks(${name}): rule engine unavailable - run hb-bootstrap. Continuing without hooks.`);
    } else {
      console.error(`hb-hooks(${name}): failed open (${error?.message ?? error}). Continuing.`);
    }
    process.exit(0);
  }
}
