# Submission Answers

## Live prototype

https://architect-two-workspace.shreyashdubeymail.chatgpt.site

## Product summary

Architect 2.0 is one agentic-app workspace with two levels of control. Builder mode lets a non-technical user prompt, preview, configure agents, connect services and deploy. Developer mode unlocks editable source, diffs, verification, logs, tests, Git, traces and deployment detail without changing projects or interrupting queued work.

## Why would a non-technical user choose it?

It preserves the speed of prompt-first builders while avoiding the usual dead end when a prototype becomes a real product. A builder can queue several changes, answer only material clarification questions, inspect progress, restore checkpoints, configure agents and move toward deployment without managing code.

## Why would a developer choose it?

Developer mode treats the agent as an inspectable collaborator. The developer can work at file level, review diffs, see verification and problems, Apply or Revert changes, control Git, inspect agent traces and manage releases. It is designed to make targeted changes with focused context rather than repeatedly rewriting broad parts of the codebase.

## What is the key differentiator?

**One workspace, two depths—plus a durable Prompt Queue.** Builder and Developer modes operate on the same project, source, conversation and run state. Multiple prompts can be queued and executed sequentially, while a Clarification Gate pauses only when ambiguity materially changes the implementation.

## What is functional in the prototype?

Local authentication/onboarding, project creation, local persistence, prompt queue controls, mode switching, editable code drafts and the complete navigation are interactive. Sandbox execution, model calls, GitHub writes and generated-app deployments are simulated product flows.

## What would be built next?

The production path is described in `ARCHITECTURE.md`: durable Temporal workflows, Firecracker/E2B sandboxes, a model gateway, a permissioned tool layer, GitHub App integration, a signed preview proxy, immutable deployments, observability and multi-tenant scaling.
