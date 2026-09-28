# Architect 2.0 — Lyzr TPM Assignment

Architect 2.0 is a prompt-first workspace for building agentic applications. It serves non-technical builders and professional developers inside one project rather than forcing them into separate products.

## Live prototype

https://architect-two-workspace.shreyashdubeymail.chatgpt.site

## Product thesis

**One workspace, two depths.**

- **Builder mode:** prompting, Prompt Queue, plan, live preview, integrations, checkpoints and deployment.
- **Developer mode:** editable source, diffs, verification, logs, tests, problems, Git controls, agent traces and detailed deployment controls.

Switching modes never creates a second project or interrupts queued work.

## Differentiators

- Sequential Prompt Queue: users can submit future changes while the current change runs.
- Clarification Gate: execution pauses only when ambiguity materially changes implementation.
- Surgeon-level Developer mode: inspect and edit the same working tree used by the coding agent.
- Changes & Verification: affected files, diff, checks, problems, Apply/Revert and checkpoints.
- Agent Studio: framework, model, tools, triggers, memory, playground and traces.
- Production-path UX: repository import, Git sync/conflicts, build logs, deployment history, promote and rollback.

## Prototype scope

This is an interactive product prototype. Local browser persistence, prompt queuing, mode switching, code drafts and product flows are interactive. Sandbox execution, model calls, GitHub writes and generated-app deployment are intentionally simulated, as allowed by the assignment.

## Repository map

- `dist/` — deployable static prototype.
- `ARCHITECTURE.md` — detailed production architecture and end-to-end prompt flow.
- `architecture.png` — architecture diagram for submission.
- `architecture.svg` / `architecture.mmd` — scalable and editable diagram sources.
- `FEATURE_COVERAGE.md` — honest prototype-versus-production feature matrix.
- `COMPETITIVE_RESEARCH.md` — product research and market-gap synthesis.
- `SUBMISSION_ANSWERS.md` — concise application-form answers.
- `SUBMISSION_CHECKLIST.md` — final verification checklist.

## Run locally

Serve the repository root with any static server and open `dist/index.html`, or deploy `dist/` as the public directory.

## Architecture summary

The proposed production platform separates a trusted control plane from an isolated execution plane. Durable workflows coordinate prompts, clarification and verification; Firecracker-based sandboxes run untrusted code; a model gateway normalizes providers; a preview proxy routes signed browser traffic; GitHub App credentials are short-lived; and deployments start from immutable checkpoints or commits.
