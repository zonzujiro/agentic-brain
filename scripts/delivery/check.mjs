#!/usr/bin/env node
// Rebuild both plans from explicit commits in the actual checkout. Attestations
// are review records, not signatures or proof that a human approved a claim.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateSemanticAuditAttestation } from './semantic-project-audit-guard.mjs';
import { validateProducerAuditAttestation } from './producer-conflict-audit-guard.mjs';
const implementationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export function git(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', timeout: 30000 });
  if (result.status !== 0) throw new Error(result.stderr?.trim() || 'Git lookup failed');
  return result.stdout.trim();
}
export function checkDelivery({ root, base, head, body, requireCheckoutHead = true }) {
  root = fs.realpathSync(root);
  if (fs.realpathSync(git(root, ['rev-parse', '--show-toplevel'])) !== root) throw new Error('Expected the repository root');
  for (const sha of [base, head]) if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('Delivery checks require explicit full commit SHAs');
  if (requireCheckoutHead && git(root, ['rev-parse', 'HEAD']) !== head) throw new Error('Checkout HEAD differs from the revision being checked');
  const plans = [];
  for (const file of ['skills-hub/hb-skills/hb-semantic-project-audit/scripts/semantic-project-audit.mjs', 'skills-hub/hb-skills/hb-change-impact/scripts/producer-conflict-audit.mjs']) {
    const result = spawnSync(process.execPath, [path.join(implementationRoot, file), 'plan', `--repo-root=${root}`, `--base=${base}`, `--head=${head}`, '--no-working-tree'], { cwd: root, encoding: 'utf8', timeout: 30000, maxBuffer: 20 * 1024 * 1024 });
    if (result.status !== 0) throw new Error(result.stderr?.trim() || 'Audit planning failed');
    plans.push(JSON.parse(result.stdout));
  }
  if (plans[0].plan?.head !== head || plans[1].head !== head) throw new Error('Audit plan does not describe the requested head');
  const checks = [validateSemanticAuditAttestation({ planResult: plans[0], prBody: body }), validateProducerAuditAttestation({ planResult: plans[1], prBody: body })];
  return { ok: checks.every(c => c.ok), base, head, checks, plans: plans.map(p => ({ status: p.status, audit_input: p.audit_input })) };
}
export function main({ env = process.env } = {}) {
  if (!env.GITHUB_EVENT_PATH || !env.GITHUB_REPOSITORY) throw new Error('GitHub event and repository identity are required');
  const event = JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
  const pr = event.pull_request;
  if (!pr || pr.base?.repo?.full_name !== env.GITHUB_REPOSITORY) throw new Error('PR event belongs to another repository');
  const result = checkDelivery({ root: process.cwd(), base: pr.base.sha, head: pr.head.sha, body: pr.body ?? '' });
  console.log(JSON.stringify(result, null, 2));
  return result.ok ? 0 : 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { process.exitCode = main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
