# Competitive Research — Architect 2.0

This research focuses on the product patterns that inform Architect 2.0. It is not a claim of exact feature parity, and product capabilities may change.

| Product | Primary user | Why people use it | Characteristic strengths | Gap Architect 2.0 addresses |
| --- | --- | --- | --- | --- |
| Architect | Non-technical agent builders | Rapid agentic-app creation | Prompt-first agents, tools, knowledge and Lyzr ecosystem | Adds source-level developer control and full production path |
| Replit Agent | Builders and developers | Build and run an application in one hosted workspace | Agent execution, task visibility, runtime, preview and deployment | Adds agentic-app-first design and progressive Builder/Developer depth |
| Lovable | Founders and designers | Fast path from product idea to polished web app | Conversational building, visual output, integrations and publishing | Adds deeper runtime, agent, verification and Git controls |
| Emergent | Non-technical full-stack builders | Generate broader applications from natural language | End-to-end generation and managed workflows | Adds explicit developer surgery, queue ordering and verification |
| Vercel v0 | Frontend/full-stack developers | High-quality generated UI connected to Vercel | Component generation, iteration, code and deployment | Adds framework-neutral agent orchestration and deeper backend/runtime controls |
| Rocket.new | Rapid application builders | Fast prompt-to-application workflow | Guided generation and deployment-oriented UX | Adds durable agent workflow, Git depth and transparent verification |
| Cursor | Professional developers | AI assistance inside a familiar code editor | Repository context, direct edits, terminal, checkpoints and developer control | Adds no-code Builder mode, hosted runtime and agentic-app lifecycle |
| Codex | Professional software teams | Delegate repository-scoped engineering work | Code understanding, editing, commands, verification and parallel work | Adds visual app building, live preview, agent configuration and deployment UX |
| Claude Code | Terminal-first developers | Powerful coding-agent workflow with explicit tools and permissions | Terminal integration, codebase reasoning, MCP and permission control | Adds non-technical entry, visual workspace and integrated product lifecycle |

## Market gap

Most products optimize for one side of the market:

- builders receive speed but lose precision when the application becomes complex;
- developers receive precision but must assemble preview, agents, hosting, Git and collaboration themselves.

Architect 2.0 bridges that gap through one shared project state:

```text
Prompt-first Builder experience
              +
Source-level Developer controls
              +
Agentic-app configuration
              +
Verification, Git and deployment
```

## Product decisions derived from the research

1. Keep prompt-to-preview short for non-technical users.
2. Never hide the plan, changed files, verification result or recovery point from developers.
3. Use progressive disclosure instead of separate Builder and Developer products.
4. Make agent configuration—framework, model, tools, triggers, memory and traces—a first-class surface.
5. Support queued future prompts so users do not supervise every execution boundary.
6. Ask clarifying questions only when an assumption materially changes architecture, data or permissions.
7. Treat GitHub and deployment as part of the primary journey, not export steps.
8. Keep production architecture provider-neutral around models, sandboxes and deployment targets.
