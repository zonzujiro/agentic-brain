import fs from "node:fs";
import { pathToFileURL } from "node:url";

import { extractMarkdownSection, stripHtmlComments } from "./markdown-section.mjs";

function field(section, name) {
  return section.match(new RegExp(`^${name}:\\s*(\\S.*)$`, "im"))?.[1]?.trim() ?? "";
}

export function validateProducerAuditAttestation({ planResult, prBody, prTitle }) {
  if (planResult?.status === "not-needed") return { ok: true, required: false };
  if (planResult?.status !== "planned" || !/^sha256:[a-f0-9]{64}$/.test(planResult?.audit_input ?? "")) {
    return { ok: false, required: true, message: "CI could not establish a valid producer conflict audit plan." };
  }
  const section = stripHtmlComments(extractMarkdownSection(prBody ?? "", "Quality Gates"));
  const status = field(section, "Producer conflict audit").toLowerCase();
  const input = field(section, "Producer audit input").toLowerCase();
  const result = field(section, "Producer audit result");
  const counts = result.match(/^(\d+) conflict\(s\), (\d+) gap\(s\)$/);
  const problems = [];
  if (!["completed", "needs-user"].includes(status)) problems.push("`Producer conflict audit` must be `completed` or `needs-user`");
  if (input !== planResult.audit_input) problems.push("`Producer audit input` is missing or stale");
  if (!counts) problems.push("`Producer audit result` must give conflict and gap counts");
  if (counts) {
    const hasFindings = Number(counts[1]) + Number(counts[2]) > 0;
    if (hasFindings && status !== "needs-user") problems.push("findings must keep the audit in `needs-user` state");
    if (!hasFindings && status !== "completed") problems.push("a clear audit must be `completed`");
    if (hasFindings && !field(section, "Producer audit decision")) problems.push("`Producer audit decision` must explain how each finding was resolved");
    if (hasFindings && !field(section, "Producer audit approved by")) problems.push("`Producer audit approved by` must identify the user who accepted the resolution");
  }
  return problems.length ? { ok: false, required: true, message: ["Producer conflict audit evidence is missing or stale in `## Quality Gates`.", ...problems.map((problem) => `- ${problem}`)].join("\n") } : { ok: true, required: true };
}

export function main({ env = process.env } = {}) {
  if (!env.PRODUCER_AUDIT_PLAN) throw new Error("PRODUCER_AUDIT_PLAN is required");
  const planResult = JSON.parse(fs.readFileSync(env.PRODUCER_AUDIT_PLAN, "utf8"));
  const event = env.GITHUB_EVENT_PATH ? JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, "utf8")) : {};
  const checked = validateProducerAuditAttestation({ planResult, prBody: event.pull_request?.body ?? "", prTitle: event.pull_request?.title ?? "" });
  if (!checked.ok) throw new Error(checked.message);
  console.log(checked.notApplicable ? checked.message : checked.required ? "Producer conflict audit attestation passed." : "Producer conflict audit not required.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
