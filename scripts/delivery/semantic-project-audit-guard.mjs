import fs from "node:fs";
import { pathToFileURL } from "node:url";

import { extractMarkdownSection, stripHtmlComments } from "./markdown-section.mjs";
export const QUALITY_GATES_SECTION_HEADING = "Quality Gates";

function fieldValue(section, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return section.match(new RegExp(`^${escaped}:\\s*(\\S.*)$`, "im"))?.[1]?.trim() ?? "";
}

export function inspectSemanticAuditAttestation(prBody) {
  const section = stripHtmlComments(extractMarkdownSection(prBody ?? "", QUALITY_GATES_SECTION_HEADING));
  return {
    status: fieldValue(section, "Semantic audit").toLowerCase(),
    auditInput: fieldValue(section, "Audit input").toLowerCase(),
    result: fieldValue(section, "Result"),
  };
}

export function validateSemanticAuditAttestation({ planResult, prBody, prTitle }) {
  if (planResult?.status === "not-needed") return { ok: true, required: false };
  if (planResult?.status !== "planned" || !/^sha256:[a-f0-9]{64}$/.test(planResult?.audit_input ?? "")) {
    return { ok: false, required: true, message: "CI could not establish a valid semantic-audit plan and input digest." };
  }

  const attestation = inspectSemanticAuditAttestation(prBody);
  const problems = [];
  if (attestation.status !== "completed") problems.push("`Semantic audit` must be `completed`");
  if (attestation.auditInput !== planResult.audit_input) problems.push("`Audit input` is missing or stale for the current semantic input");
  if (attestation.result.length < 3) problems.push("`Result` must summarize no findings or the advisory findings");

  return problems.length === 0
    ? { ok: true, required: true, attestation }
    : {
        ok: false,
        required: true,
        attestation,
        message: [
          "This PR changes active-project or shipped-feature context and requires a current local semantic-audit attestation in `## Quality Gates`.",
          ...problems.map((problem) => `- ${problem}`),
          "Run `hb-semantic-project-audit` with the active agent and copy its three `pr_body` lines into the PR description.",
        ].join("\n"),
      };
}

export function readEvent(eventPath) {
  return eventPath ? JSON.parse(fs.readFileSync(eventPath, "utf8")) : {};
}

export function main({ env = process.env } = {}) {
  if (!env.SEMANTIC_AUDIT_PLAN) throw new Error("SEMANTIC_AUDIT_PLAN is required");
  const planResult = JSON.parse(fs.readFileSync(env.SEMANTIC_AUDIT_PLAN, "utf8"));
  const event = readEvent(env.GITHUB_EVENT_PATH);
  const result = validateSemanticAuditAttestation({
    planResult,
    prBody: event.pull_request?.body ?? "",
    prTitle: event.pull_request?.title ?? "",
  });
  if (!result.ok) throw new Error(result.message);
  console.log(
    result.notApplicable
      ? result.message
      : result.required
        ? "Semantic project audit attestation passed."
        : "Semantic project audit not required.",
  );
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
