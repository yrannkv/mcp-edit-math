# Design Notes: Edit Approval State Machine (EASM)

Author: Annenkov Yuriy  
Year: 2025

---

## 1. Motivation

AI-assisted coding systems are increasingly capable of making complex changes
to real-world codebases.

However, most existing tools optimize for *generation quality* and *speed*,
while assuming that the surrounding environment (the human, the editor,
the workflow) will compensate for mistakes.

This assumption does not hold in practice.

The core problem is not that AI systems generate incorrect code.
The problem is that they are allowed to **act without procedural constraints**.

---

## 2. Problem Statement

In typical AI-assisted workflows:

- an AI can modify code immediately
- dependency awareness is implicit or partial
- human review happens *after* the change
- responsibility is unclear when something breaks

This creates a class of failures characterized by:

- silent breaking changes
- refactors without downstream awareness
- accidental API or behavior drift

These failures are often subtle and expensive to detect.

---

## 3. Design Goal

The goal of the Edit Approval State Machine is **not** to make AI smarter.

The goal is to introduce **explicit procedural friction** at the point where
an AI system attempts to modify code.

Specifically, the system must ensure that:

1. Dependencies are surfaced explicitly
2. Intent is externalized before action
3. Human approval is unambiguous and verifiable
4. Unsafe actions fail closed

---

## 4. Core Insight

AI systems do not lack reasoning ability.

They lack **structural incentives to pause, explain, and wait**.

When allowed to act freely, an AI will often optimize for task completion,
even if intermediate reasoning steps are skipped or compressed.

EASM introduces a structure in which *progress is impossible* without
externalized reasoning and human intent.

---

## 5. Edit Approval State Machine

Each edit target is governed by a simple state machine:

- `NONE`  
  No approval exists. Any attempt to edit is rejected.

- `PENDING`  
  Dependencies and risks have been identified.  
  The system is waiting for explicit human confirmation.

- `APPROVED`  
  Approval has been granted for a single edit operation.

State transitions are enforced by the server.
The AI cannot modify state arbitrarily or persist approval implicitly.

After a successful edit, the state is reset.

---

## 6. Human Confirmation Token

For edits involving dependencies, renames, or declared breaking changes,
the system requires a **human confirmation token**.

The token:
- must be provided explicitly by the user
- is validated by the server
- cannot be assumed or hallucinated by the AI

This creates a hard boundary between:
- AI analysis and execution
- human intent and responsibility

---

## 7. Threat Model

The design assumes:

- AI agents may optimize for speed over safety
- AI agents may attempt to bypass or compress reasoning steps
- silent failure is more dangerous than delayed action

As a result, the system is designed to fail closed.

Any ambiguity resets the approval state.

---

## 8. Non-Goals

EASM intentionally does **not** attempt to:

- prove semantic correctness of code
- perform full program analysis
- replace human judgment
- guarantee bug-free edits

Its purpose is **procedural control**, not correctness enforcement.

---

## 9. Architectural Positioning

The Edit Approval State Machine should be viewed as:

- a control layer, not an intelligence layer
- an architectural pattern, not a UI feature
- a protocol, not a heuristic

It is compatible with different languages, editors, and AI models.

---

## 10. Conclusion

Allowing AI systems to modify code without procedural safeguards
creates a class of failures that cannot be solved by better prompts alone.

The Edit Approval State Machine demonstrates one possible approach:
introducing explicit state, friction, and human confirmation
at the moment where action becomes irreversible.
