# Architect 2.0 — Prototype Coverage

This file separates what the hosted prototype demonstrates from the production
capabilities proposed in `architecture.md`. “Simulated” means the complete UX
path is visible, but no external write or untrusted-code execution occurs.

| Area | Prototype status | What is demonstrated | Next production milestone |
| --- | --- | --- | --- |
| Authentication | Partial | Local email/name sign-in and persisted workspace | Real Google/GitHub OAuth, sessions and organizations |
| Homepage | Interactive | Prompt-first creation, samples, recent projects and import entry | Search, templates and richer project metadata |
| Import existing code | Simulated | GitHub URL, selected branch and detected stack retained in the project | GitHub App installation, authorized clone and real framework detection |
| Chat | Interactive | Persistent conversation, activity and plan views | Token streaming, attachments and tool approval |
| Prompt queue | Interactive simulation | Add many prompts, sequential demo execution, active/waiting/done states, blocking clarification and resume/remove | Durable workflow queue, reorder, cancel-running and failure retry |
| Short plan per prompt | Simulated | Focused inspect → change → targeted checks → diff loop | Plan approval and blocking clarification only for material ambiguity |
| Builder/Developer switch | Interactive | Persistent top-level toggle; same project, queue and shared view remain active | Remember mode per user/project and role-aware controls |
| App preview | Interactive | Responsive frame, desktop/mobile switch and refresh | Real sandbox stream, open-in-new-tab and visual element selection |
| Agent studio | Interactive simulation | Agent list/create, trigger, memory, framework, model, tools, playground and execution trace | Live agent runtime and connected tool permissions |
| UI build progress | Interactive simulation | Queue state, activity, affected files, diff, Apply/Revert and checkpoint restore | Streaming file changes and real build feedback |
| Code controls | Interactive simulation | Developer-only file editor, save draft, diff and review history | Monaco editor, symbol search and sandbox-backed files |
| Runtime inspection | Simulated | Demo checks, problems, logs and checkpoint recovery | Terminal, real test results and process controls |
| Data and secrets | Simulated | Database, knowledge and environment-variable entry flows | Provisioning, scoped credentials and secret versioning |
| GitHub workflow | Simulated | Connect, import branch, detected stack, sync state, conflict resolution, push and PR flows | Installation tokens, webhooks and actual bidirectional sync |
| Deployment | Simulated | Environment, region, build logs, release history, promote and rollback | Real immutable builds, domains and provider deployment integration |
| Collaboration | Simulated | Share dialog and Builder/Developer/Viewer roles | Invitations, presence, comments and audit history |
| Local persistence | Interactive | Projects, messages, queue, edits, agents, Git state and release history survive refresh | Postgres metadata, object storage and multi-device sync |

## Product principle

Architect 2.0 is one workspace with progressive disclosure—not two separate
products. Builder mode prioritizes prompting, agents and preview. Developer mode
unlocks code and runtime inspection without restarting the task or losing queued
work. The production system adds true sandbox execution, durable orchestration,
GitHub writes and deployment behind the flows demonstrated here.
