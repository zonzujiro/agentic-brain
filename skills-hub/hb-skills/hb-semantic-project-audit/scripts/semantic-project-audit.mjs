#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";

import {
  LIMITS,
  RUBRICS,
  atomicWriteJson,
  buildAuditInputDigest,
  buildBrainEvidenceIdentity,
  buildPlan,
  buildStage1Packet,
  buildStage2Packet,
  collectGitChanges,
  cleanupGitEvidence,
  filesystemEvidenceSource,
  gitTreeEvidenceSource,
  listAuditEntries,
  makeTempRoot,
  removeTempRoot,
  reconcileStage1Eligibility,
  runCodexStage,
  semanticAuditChanges,
  discoverBrainEvidence,
  stage1Prompt,
  stage2Prompt,
  validateStage2,
  validateTempRoot,
} from "./lib.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const defaultRepoRoot = path.resolve(scriptDir, "../../../..");
const stage1SchemaPath = path.join(scriptDir, "..", "references", "stage1-schema.json");
const stage2SchemaPath = path.join(scriptDir, "..", "references", "stage2-schema.json");

function usage() {
  return `Usage:
  semantic-project-audit.mjs plan [options]
  semantic-project-audit.mjs run [options]
  semantic-project-audit.mjs prepare [options]
  semantic-project-audit.mjs advance --session=<path> [--push]
  semantic-project-audit.mjs finalize --session=<path> [--push]
  semantic-project-audit.mjs cancel --session=<path>

Options:
  --repo-root=<path>       Agentic Brain checkout (default: enclosing checkout)
  --projects-root=<path>   Active-project corpus (default: <repo>/projects-in-progress)
  --production-root=<path> Shipped-feature corpus (default: <repo>/production-features)
  --relations-path=<path>  Reviewed not-same ledger
  --base=<ref>             Comparison base (default: merge-base with origin/main)
  --head=<ref>             Comparison head (default: HEAD)
  --changed=<a,b>          Explicit entry IDs; bare unique slugs remain supported
  --changes-file=<path>    JSON change rows for deterministic benchmark/test input
  --all                    Compare all active and shipped entries; safety limits still apply
  --mode=<value>           safe-routed (default) or merged-only
  --model=<id>             Pin a Codex model; omit for configured default
  --effort=<level>         Codex reasoning effort (default: medium)
  --output=<path>          Atomically write the final JSON result
  --no-working-tree        Ignore staged, unstaged, and untracked files
  --github                 Emit a GitHub notice in plan mode
  --push                   After a validated run, execute git push
`;
}

function parseArgs(argv) {
  const command = argv[0];
  if (!command || !["plan", "run", "prepare", "advance", "finalize", "cancel"].includes(command)) throw new Error(usage());
  const options = { command, push_args: [] };
  for (const argument of argv.slice(1)) {
    if (argument === "--all") options.all = true;
    else if (argument === "--github") options.github = true;
    else if (argument === "--push") options.push = true;
    else if (argument === "--no-working-tree") options.includeWorkingTree = false;
    else if (argument.startsWith("--") && argument.includes("=")) {
      const [key, ...parts] = argument.slice(2).split("=");
      options[key.replaceAll("-", "_")] = parts.join("=");
    } else throw new Error(`unknown argument: ${argument}\n\n${usage()}`);
  }
  return options;
}

function readJson(target, label = target) {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(target), "utf8"));
  } catch (error) {
    throw new Error(`cannot read ${label}: ${error.message}`);
  }
}

function readChangesFile(target) {
  const value = readJson(target, "--changes-file");
  if (!Array.isArray(value)) throw new Error("--changes-file must contain a JSON array");
  return value.map((item) => ({ status: item.status ?? "M", path: item.path, content: item.content ?? [item.heading, ...(item.added_lines ?? []), ...(item.removed_lines ?? [])].filter(Boolean).join("\n"), parsed: true }));
}

function humanPlan(plan) {
  if (plan.changed_projects.length === 0) return "No active-project or shipped-feature context changed; semantic review is not needed.";
  if (plan.global_relations_changed) {
    return `The active-project relations ledger and any changed corpus entries will be compared across ${plan.eligible_pair_count} pair(s) and ${plan.eligible_rubric_evaluations} rubric evaluation(s).`;
  }
  const entries = `${plan.changed_projects.length} changed semantic ${plan.changed_projects.length === 1 ? "entry" : "entries"}`;
  return `${entries} will be compared across ${plan.eligible_pair_count} pair(s) and ${plan.eligible_rubric_evaluations} rubric evaluation(s).`;
}

function combineUsage(...stages) {
  return stages.reduce((total, stage) => ({
    input_tokens: total.input_tokens + (stage.usage.input_tokens ?? 0),
    cached_input_tokens: total.cached_input_tokens + (stage.usage.cached_input_tokens ?? 0),
    output_tokens: total.output_tokens + (stage.usage.output_tokens ?? 0),
  }), { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0 });
}

function validateSchemas() {
  const stage1 = readJson(stage1SchemaPath, "Stage 1 schema");
  const stage2 = readJson(stage2SchemaPath, "Stage 2 schema");
  const stage1Rubrics = stage1.properties?.candidate_pairs?.items?.properties?.suspected_checks?.items?.enum;
  const stage2Rubrics = stage2.properties?.findings?.items?.properties?.check?.enum;
  if (stage1.properties?.candidate_pairs?.maxItems !== LIMITS.candidates) throw new Error("Stage 1 schema candidate limit differs from controller limit");
  if (JSON.stringify(stage1Rubrics) !== JSON.stringify(RUBRICS) || JSON.stringify(stage2Rubrics) !== JSON.stringify(RUBRICS)) throw new Error("semantic audit schemas differ from controller rubrics");
}

function publicPlan(plan) {
  const { pairs: _pairs, ...summary } = plan;
  const comparison_target_coverage = plan.global_relations_changed
    ? "Every active-to-active pair for the active-only relations ledger, plus normal combined-corpus coverage for any active-project or shipped-feature entry changed in the same range; known old/new identities of one Git rename are excluded."
    : "Every changed active-project or shipped-feature entry against every other entry in that combined corpus; changed-to-changed pairs once, except the known old/new identities of one Git rename.";
  return { ...summary, comparison_target_coverage };
}

function resolveExplicitEntries(values, entryCatalog) {
  const ids = new Set(entryCatalog.map((entry) => entry.id));
  return values.map((value) => {
    if (value.includes(":")) {
      if (!ids.has(value)) throw new Error(`explicit changed entry is not in the audit corpus: ${value}`);
      return value;
    }
    const matches = entryCatalog.filter((entry) => entry.slug === value).map((entry) => entry.id);
    if (matches.length === 1) return matches[0];
    if (matches.length === 0) throw new Error(`explicit changed entry is not in the audit corpus: ${value}`);
    throw new Error(`explicit changed entry slug is ambiguous; use one of: ${matches.join(", ")}`);
  });
}

function contractState(source, repoRoot) {
  const read = (absolute) => {
    const relative = path.relative(repoRoot, absolute).replaceAll("\\", "/");
    const executed = fs.readFileSync(absolute, "utf8").replace(/\r\n?/g, "\n");
    if (source.kind === "git-tree" && source.has(relative) && source.read(relative) !== executed) {
      throw new Error("The executed audit controller or schema differs from the combined tree. Use a current committed audit runtime before attesting.");
    }
    return executed;
  };
  return {
    controller: read(scriptPath),
    library: read(path.join(scriptDir, "lib.mjs")),
    stage1_schema: read(stage1SchemaPath),
    stage2_schema: read(stage2SchemaPath),
  };
}

function buildContext(options) {
  const repoRoot = fs.realpathSync(path.resolve(options.repo_root ?? defaultRepoRoot));
  const projectsRoot = path.resolve(options.projects_root ?? path.join(repoRoot, "projects-in-progress"));
  const productionRoot = path.resolve(options.production_root ?? path.join(repoRoot, "production-features"));
  const relationsPath = path.resolve(options.relations_path ?? path.join(projectsRoot, "project-relations.json"));
  const requestedEntries = (options.changed ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  let baseCommit = null;
  let headCommit = null;
  let combinedTree = null;
  let gitEnv;
  let changes = [];
  let historicalReadmes = {};
  let renameLineage = [];
  if (options.changes_file) changes = readChangesFile(options.changes_file);
  else {
    const git = collectGitChanges(repoRoot, { base: options.base, head: options.head ?? "HEAD", includeWorkingTree: options.includeWorkingTree !== false, combined: options.includeWorkingTree === false });
    baseCommit = git.baseCommit;
    headCommit = git.headCommit;
    combinedTree = git.combinedTree;
    gitEnv = git.gitEnv;
    if (!options.all && requestedEntries.length === 0) changes = git.changes;
    historicalReadmes = git.historicalReadmes;
    renameLineage = git.renameLineage;
  }
  const corpusInsideRepo = [projectsRoot, productionRoot].every((root) => {
    const relative = path.relative(repoRoot, root);
    return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
  });
  const source = options.includeWorkingTree === false && headCommit && corpusInsideRepo
    ? gitTreeEvidenceSource(repoRoot, combinedTree ?? headCommit, { env: gitEnv })
    : filesystemEvidenceSource(corpusInsideRepo ? repoRoot : path.dirname(projectsRoot));
  const entryCatalog = listAuditEntries({ projectsRoot, productionRoot, source });
  const projects = entryCatalog.map((entry) => entry.id);
  const explicitProjects = resolveExplicitEntries(requestedEntries, entryCatalog);
  const relevantChanges = semanticAuditChanges(changes);
  const plan = buildPlan({ projects, changes: relevantChanges, explicitProjects, all: options.all, mode: options.mode ?? "safe-routed", historicalProjects: Object.keys(historicalReadmes), renameLineage });
  plan.base_commit = baseCommit;
  plan.head = headCommit ?? options.head ?? "HEAD";
  plan.combined_tree = combinedTree;
  plan.summary = humanPlan(plan);
  const stage1Packet = plan.changed_projects.length ? buildStage1Packet({ projectsRoot, productionRoot, relationsPath, plan, changes: relevantChanges, historicalReadmes, entryCatalog, source }) : null;
  const identity = {
    base_commit: baseCommit,
    head_commit: headCommit,
    include_working_tree: options.includeWorkingTree !== false,
    evidence_mode: options.changes_file ? "diagnostic-changes" : combinedTree ? "combined-git-tree" : "working-tree",
    selectors: { all: Boolean(options.all), changed: explicitProjects, changes_file: options.changes_file ? path.resolve(options.changes_file) : null },
    changes: relevantChanges.map(({ status, path: changedPath, oldPath, newPath, renameSide, content, parsed }) => ({ status, path: changedPath, oldPath: oldPath ?? null, newPath: newPath ?? null, renameSide: renameSide ?? null, parsed: parsed !== false, content: String(content ?? "").replace(/\r\n?/g, "\n") })),
  };
  const brainEvidenceIdentity = stage1Packet ? buildBrainEvidenceIdentity({ projectsRoot, productionRoot, source }) : [];
  const auditInput = stage1Packet ? buildAuditInputDigest({ plan, stage1Packet, projectsRoot, productionRoot, historicalReadmes, entryCatalog, source, contract: contractState(source, repoRoot), identity, brainEvidenceIdentity }) : null;
  return { repoRoot, projectsRoot, productionRoot, relationsPath, historicalReadmes, entryCatalog, source, identity, plan, stage1Packet, auditInput };
}

function resultSummary(findings, coverageGaps = []) {
  if (findings.length === 0 && coverageGaps.length === 0) return "no findings";
  const details = findings.slice(0, 3).map((finding) => `${finding.check}: ${finding.projects.join(" / ")}`);
  const parts = [];
  if (findings.length) parts.push(`${findings.length} advisory finding${findings.length === 1 ? "" : "s"}${details.length ? ` — ${details.join("; ")}${findings.length > details.length ? `; +${findings.length - details.length} more` : ""}` : ""}`);
  if (coverageGaps.length) parts.push(`${coverageGaps.length} coverage gap${coverageGaps.length === 1 ? "" : "s"}`);
  return parts.join("; ");
}

function staleReadmes(stage1) {
  return (stage1.readme_alignment ?? []).filter((entry) => entry.status === "stale");
}

function agentResult({ context, stage1, discovery, stage2 }) {
  const findings = stage2.findings ?? [];
  const stale = staleReadmes(stage1);
  const semanticSummary = resultSummary(findings, stage2.coverage_gaps ?? []);
  const summary = stale.length ? `${semanticSummary}; ${stale.length} stale primary semantic document${stale.length === 1 ? "" : "s"}` : semanticSummary;
  return {
    status: "completed",
    execution: "active-agent",
    advisory: true,
    human_confirmation_required: true,
    audit_input: context.auditInput,
    plan: publicPlan(context.plan),
    evidence_discovery: discovery ?? { scanned_documents: 0, selections: [], notes: [] },
    readme_alignment: stage1.readme_alignment,
    comparisons: stage2.comparisons ?? [],
    findings,
    cleared_candidates: stage2.cleared_candidates ?? [],
    coverage_gaps: stage2.coverage_gaps ?? [],
    notes: [...(stage1.notes ?? []), ...(stage2.notes ?? [])],
    attestation: { semantic_audit: "completed", audit_input: context.auditInput, result: summary },
    pr_body: ["Semantic audit: completed", `Audit input: ${context.auditInput}`, `Result: ${summary}`],
    metrics: {
      stage1_candidates: stage1.candidate_pairs.length,
      stale_readmes: stale.length,
      stage1_packet_bytes: Buffer.byteLength(JSON.stringify(context.stage1Packet)),
      discovery_selected_documents: new Set((discovery?.selections ?? []).flatMap((selection) => selection.evidence_paths.map((evidence) => evidence.path))).size,
      discovery_scanned_documents: discovery?.scanned_documents ?? 0,
      stage2_packet_bytes: stage2.__packet_bytes ?? 0,
      usage: "provided by the active agent host",
    },
  };
}

function push(repoRoot, args) {
  if (args.length) throw new Error("semantic-audit push completion supports only the checked-out branch through plain `git push`");
  const result = spawnSync("git", ["push", ...args], { cwd: repoRoot, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`git push failed with exit ${result.status ?? result.signal}`);
}

function assertPushEligible(context) {
  if (!context.identity.head_commit || context.identity.include_working_tree || context.identity.selectors.changes_file) {
    throw new Error("semantic-audit push completion requires committed Git-tree input; rerun prepare --no-working-tree without --changes-file");
  }
}

function assertOutputOutsideSession(output, sessionRoot) {
  if (!output) return;
  const requested = path.resolve(output);
  const parent = path.dirname(requested);
  const resolvedParent = fs.existsSync(parent) ? fs.realpathSync(parent) : parent;
  const resolvedOutput = path.join(resolvedParent, path.basename(requested));
  const relative = path.relative(sessionRoot, resolvedOutput);
  if (relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))) {
    throw new Error("--output must be outside the semantic-audit session directory so recovery state cannot be overwritten");
  }
}

function safeSession(target) {
  if (!target) throw new Error("--session=<path> is required");
  return validateTempRoot(target);
}

function refreshDeliveryBase(options) {
  if (options.includeWorkingTree !== false || options.changes_file || options.base && options.base !== "origin/main") return;
  const repoRoot = path.resolve(options.repo_root ?? defaultRepoRoot);
  const fetched = spawnSync("git", ["fetch", "origin", "main"], { cwd: repoRoot, encoding: "utf8" });
  if (fetched.status !== 0) throw new Error("Cannot refresh origin/main for the semantic audit. Restore Git access and retry; no stale-base attestation was produced.");
}

function sessionContext(sessionRoot) {
  const session = readJson(path.join(sessionRoot, "session.json"), "semantic-audit session");
  refreshDeliveryBase({ repo_root: session.repo_root, base: session.base, includeWorkingTree: session.include_working_tree, changes_file: session.changes_file });
  const context = buildContext({
    repo_root: session.repo_root,
    projects_root: session.projects_root,
    production_root: session.production_root,
    relations_path: session.relations_path,
    base: session.base,
    head: session.head,
    mode: session.mode,
    includeWorkingTree: session.include_working_tree,
    all: session.all,
    changed: session.changed,
    changes_file: session.changes_file,
  });
  if (context.auditInput !== session.audit_input) throw new Error("semantic-audit input changed after prepare; cancel this session and restart from the current branch state");
  return { session, context };
}

function writeAgentStage(root, stage, prompt, packet, schemaPath) {
  const promptPath = path.join(root, `${stage}-prompt.md`);
  const packetPath = path.join(root, `${stage}-packet.json`);
  const resultPath = path.join(root, `${stage}-result.json`);
  fs.writeFileSync(promptPath, `${prompt}\n`);
  atomicWriteJson(packetPath, packet);
  return { prompt_path: promptPath, packet_path: packetPath, schema_path: schemaPath, result_path: resultPath };
}

function emit(options, result, { outputWritten = false } = {}) {
  if (options.output && !outputWritten) atomicWriteJson(options.output, result);
  if (options.github && options.command === "plan") console.log(`::notice title=Semantic project audit::${result.plan.summary}${result.status === "planned" ? " Run hb-semantic-project-audit locally for semantic findings." : ""}`);
  else console.log(JSON.stringify(result, null, 2));
}

async function runCodex(context, options) {
  const tempRoot = makeTempRoot();
  const started = performance.now();
  let activeChild = null;
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    removeTempRoot(tempRoot);
  };
  const signalHandlers = new Map();
  for (const [signal, code] of [["SIGINT", 130], ["SIGTERM", 143]]) {
    const handler = () => {
      const finish = () => { cleanup(); process.exit(code); };
      if (!activeChild) return finish();
      const force = setTimeout(() => { activeChild?.kill("SIGKILL"); setTimeout(finish, 100); }, 2_000);
      activeChild.once("close", () => { clearTimeout(force); finish(); });
      activeChild.kill("SIGTERM");
    };
    signalHandlers.set(signal, handler);
    process.once(signal, handler);
  }
  try {
    const stage1 = await runCodexStage({ prompt: stage1Prompt(context.stage1Packet), schemaPath: stage1SchemaPath, model: options.model, effort: options.effort ?? "medium", tempRoot, stage: "stage1", onChild: (child) => { activeChild = child; } });
    const reconciledStage1 = reconcileStage1Eligibility(stage1.output, context.stage1Packet, stage1.command_calls);
    if (reconciledStage1.errors.length) throw new Error(`Stage 1 output rejected: ${reconciledStage1.errors.join("; ")}`);
    stage1.output = reconciledStage1.output;

    let discovery = { output: { project_count: context.plan.project_count, candidate_count: 0, scanned_documents: 0, selections: [], notes: [] }, duration_ms: 0, usage: { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0 }, command_calls: 0 };
    let stage2 = { output: { project_count: context.plan.project_count, candidate_count: 0, comparisons: [], findings: [], cleared_candidates: [], coverage_gaps: [], notes: ["Stage 2 was not needed because Stage 1 found no candidates."] }, duration_ms: 0, usage: { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0 }, command_calls: 0 };
    let stage2Packet = null;
    if (stage1.output.candidate_pairs.length) {
      const discoveryStarted = performance.now();
      discovery.output = discoverBrainEvidence({ projectsRoot: context.projectsRoot, productionRoot: context.productionRoot, plan: context.plan, stage1: stage1.output, stage1Packet: context.stage1Packet, source: context.source });
      discovery.duration_ms = Math.round(performance.now() - discoveryStarted);
      stage2Packet = buildStage2Packet({ projectsRoot: context.projectsRoot, productionRoot: context.productionRoot, relationsPath: context.relationsPath, plan: context.plan, stage1: stage1.output, discovery: discovery.output, historicalReadmes: context.historicalReadmes, entryCatalog: context.entryCatalog, source: context.source });
      stage2 = await runCodexStage({ prompt: stage2Prompt(stage2Packet), schemaPath: stage2SchemaPath, model: options.model, effort: options.effort ?? "medium", tempRoot, stage: "stage2", onChild: (child) => { activeChild = child; } });
      const stage2Errors = validateStage2(stage2.output, stage2Packet, stage2.command_calls);
      if (stage2Errors.length) throw new Error(`Stage 2 output rejected: ${stage2Errors.join("; ")}`);
    }

    refreshDeliveryBase(options);
    if (buildContext(options).auditInput !== context.auditInput) throw new Error("semantic-audit input changed during review; restart from current content");
    const findings = stage2.output.findings;
    const stale = staleReadmes(stage1.output);
    const semanticSummary = resultSummary(findings, stage2.output.coverage_gaps ?? []);
    const summary = stale.length ? `${semanticSummary}; ${stale.length} stale primary semantic document${stale.length === 1 ? "" : "s"}` : semanticSummary;
    const result = {
      status: "completed",
      execution: "codex-cli",
      advisory: true,
      human_confirmation_required: true,
      audit_input: context.auditInput,
      plan: publicPlan(context.plan),
      evidence_discovery: discovery.output,
      readme_alignment: stage1.output.readme_alignment,
      comparisons: stage2.output.comparisons,
      findings,
      cleared_candidates: stage2.output.cleared_candidates,
      coverage_gaps: stage2.output.coverage_gaps,
      notes: [...(stage1.output.notes ?? []), ...(discovery.output.notes ?? []), ...(stage2.output.notes ?? [])],
      attestation: { semantic_audit: "completed", audit_input: context.auditInput, result: summary },
      pr_body: ["Semantic audit: completed", `Audit input: ${context.auditInput}`, `Result: ${summary}`],
      metrics: {
        stage1_candidates: stage1.output.candidate_pairs.length,
        stale_readmes: stale.length,
        stage1_packet_bytes: Buffer.byteLength(JSON.stringify(context.stage1Packet)),
        discovery_selected_documents: new Set((discovery.output.selections ?? []).flatMap((selection) => selection.evidence_paths.map((evidence) => evidence.path))).size,
        discovery_scanned_documents: discovery.output.scanned_documents,
        stage2_packet_bytes: stage2Packet ? Buffer.byteLength(JSON.stringify(stage2Packet)) : 0,
        stage1_ms: stage1.duration_ms,
        discovery_ms: discovery.duration_ms,
        stage2_ms: stage2.duration_ms,
        total_ms: Math.round(performance.now() - started),
        usage: combineUsage(stage1, stage2),
        model: options.model ?? "configured-default",
        effort: options.effort ?? "medium",
        command_calls: stage1.command_calls + stage2.command_calls,
      },
    };
    if (options.output) atomicWriteJson(options.output, result);
    if (options.push) push(context.repoRoot, options.push_args);
    return { result, outputWritten: Boolean(options.output) };
  } finally {
    for (const [signal, handler] of signalHandlers) process.removeListener(signal, handler);
    cleanup();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  validateSchemas();

  if (options.command === "cancel") {
    const sessionRoot = safeSession(options.session);
    removeTempRoot(sessionRoot);
    emit(options, { status: "cancelled" });
    return;
  }

  if (["advance", "finalize"].includes(options.command)) {
    const sessionRoot = safeSession(options.session);
    assertOutputOutsideSession(options.output, sessionRoot);
    const { context } = sessionContext(sessionRoot);
    if (options.push) assertPushEligible(context);
    const submittedStage1 = readJson(path.join(sessionRoot, "stage1-result.json"), "Stage 1 result");
    const reconciledStage1 = reconcileStage1Eligibility(submittedStage1, context.stage1Packet, 0);
    if (reconciledStage1.errors.length) throw new Error(`Stage 1 output rejected: ${reconciledStage1.errors.join("; ")}`);
    const stage1 = reconciledStage1.output;

    if (options.command === "advance") {
      if (stage1.candidate_pairs.length === 0) {
        const stage2 = { project_count: context.plan.project_count, candidate_count: 0, comparisons: [], findings: [], cleared_candidates: [], coverage_gaps: [], notes: ["Stage 2 was not needed because Stage 1 found no candidates."], __packet_bytes: 0 };
        const discovery = { project_count: context.plan.project_count, candidate_count: 0, scanned_documents: 0, selections: [], notes: [] };
        const result = agentResult({ context, stage1, discovery, stage2 });
        if (options.output) atomicWriteJson(options.output, result);
        if (options.push) push(context.repoRoot, options.push_args);
        removeTempRoot(sessionRoot);
        emit(options, result, { outputWritten: Boolean(options.output) });
        return;
      }
      const discovery = discoverBrainEvidence({ projectsRoot: context.projectsRoot, productionRoot: context.productionRoot, plan: context.plan, stage1, stage1Packet: context.stage1Packet, source: context.source });
      const stage2Packet = buildStage2Packet({ projectsRoot: context.projectsRoot, productionRoot: context.productionRoot, relationsPath: context.relationsPath, plan: context.plan, stage1, discovery, historicalReadmes: context.historicalReadmes, entryCatalog: context.entryCatalog, source: context.source });
      const paths = writeAgentStage(sessionRoot, "stage2", stage2Prompt(stage2Packet), stage2Packet, stage2SchemaPath);
      emit(options, { status: "stage2-required", audit_input: context.auditInput, plan: publicPlan(context.plan), ...paths });
      return;
    }

    const discovery = discoverBrainEvidence({ projectsRoot: context.projectsRoot, productionRoot: context.productionRoot, plan: context.plan, stage1, stage1Packet: context.stage1Packet, source: context.source });
    const stage2Packet = buildStage2Packet({ projectsRoot: context.projectsRoot, productionRoot: context.productionRoot, relationsPath: context.relationsPath, plan: context.plan, stage1, discovery, historicalReadmes: context.historicalReadmes, entryCatalog: context.entryCatalog, source: context.source });
    const stage2 = readJson(path.join(sessionRoot, "stage2-result.json"), "Stage 2 result");
    const stage2Errors = validateStage2(stage2, stage2Packet, 0);
    if (stage2Errors.length) throw new Error(`Stage 2 output rejected: ${stage2Errors.join("; ")}`);
    stage2.__packet_bytes = Buffer.byteLength(JSON.stringify(stage2Packet));
    const result = agentResult({ context, stage1, discovery, stage2 });
    if (options.output) atomicWriteJson(options.output, result);
    if (options.push) push(context.repoRoot, options.push_args);
    removeTempRoot(sessionRoot);
    emit(options, result, { outputWritten: Boolean(options.output) });
    return;
  }

  if (["prepare", "run"].includes(options.command)) refreshDeliveryBase(options);
  const context = buildContext(options);
  if (options.command === "plan" || context.plan.changed_projects.length === 0) {
    const result = { status: context.plan.changed_projects.length === 0 ? "not-needed" : "planned", audit_input: context.auditInput, plan: publicPlan(context.plan) };
    if (context.stage1Packet) result.stage1_packet_bytes = Buffer.byteLength(JSON.stringify(context.stage1Packet));
    emit(options, result);
    return;
  }

  if (options.command === "prepare") {
    const sessionRoot = makeTempRoot();
    atomicWriteJson(path.join(sessionRoot, "session.json"), {
      repo_root: context.repoRoot,
      projects_root: context.projectsRoot,
      production_root: context.productionRoot,
      relations_path: context.relationsPath,
      base: options.base ?? null,
      head: options.head ?? "HEAD",
      mode: options.mode ?? "safe-routed",
      include_working_tree: options.includeWorkingTree !== false,
      all: Boolean(options.all),
      changed: options.changed ?? "",
      changes_file: options.changes_file ? path.resolve(options.changes_file) : null,
      audit_input: context.auditInput,
    });
    const paths = writeAgentStage(sessionRoot, "stage1", stage1Prompt(context.stage1Packet), context.stage1Packet, stage1SchemaPath);
    emit(options, { status: "stage1-required", session: sessionRoot, audit_input: context.auditInput, plan: publicPlan(context.plan), ...paths });
    return;
  }

  if (options.push) assertPushEligible(context);
  const completed = await runCodex(context, options);
  emit(options, completed.result, { outputWritten: completed.outputWritten });
}

try { await main(); } finally { cleanupGitEvidence(); }
