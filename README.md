# 🛡️ Edit Math Supervisor (MCP Server)

![Vibecoding](https://img.shields.io/badge/Built_with-Vibecoding-ff69b4?style=flat-square)

**Architectural Gatekeeper for AI Coding Assistants.**

**Edit Math Supervisor** is an advanced [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that acts as a **Stateful Gatekeeper** for AI coding assistants (Claude Desktop, Roo Code, Cline, Lingma).

It prevents "Tunnel Vision" by forcing the AI to verify code dependencies before editing. Unlike simple linters, this server **physically blocks** file saving until the AI proves that the changes are safe.

---

### ✨ Key Features

*   **AST Parsing (Tree-sitter):** Accurate dependency detection for **JavaScript**, **TypeScript**, and **HTML**, and **Python**
    *   *JS/TS:* Understands classes, nested functions, and `this` context.
    *   *HTML:* Detects dependencies in `<script src>` tags and event handlers (e.g., `onclick`).
*   **Signature Verification:** Automatically detects function renaming. If the AI changes a function name, the server triggers **Strict Mode** and demands user confirmation.
*   **Stateful Gatekeeper:** The server tracks verification status. The `commit_safe_edit` tool returns `⛔ ACCESS DENIED` if the Integrity Score is not 1.0.
*   **Human-in-the-Loop:** Supports `force_override` for complex scenarios where the user explicitly allows a risky edit.
*   **Smart Filtering:** Automatically ignores standard language methods (e.g., `.map()`, `console.log`) to keep the focus on your business logic.

### 🚀 The "#editmath" Protocol

The server enforces a strict workflow:

1.  **🔍 SCAN:** The AI scans the target function (or HTML file) using AST.
2.  **🎫 TICKET:** The AI calculates the integrity score. It must provide the **proposed header** of the function. If renaming is detected, the server blocks execution until the user approves.
3.  **💾 COMMIT:** Only with a valid ticket (or user override) can the AI save changes.

### ⚡ Quick Start (via uvx)

If you use `uv`, you can run the server directly without cloning the repo:

```json
{
  "mcpServers": {
    "edit-math": {
      "command": "uvx",
      "args": ["mcp-edit-math"]
    }
  }
}

### 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yrannkv/mcp-edit-math.git
    cd mcp-edit-math
    ```

2.  **Install dependencies:**
    *Note: Specific versions are required for stability.*
    ```bash
    pip install mcp tree-sitter==0.21.3 tree-sitter-javascript==0.21.0 tree-sitter-typescript==0.21.0 tree-sitter-html==0.20.3
    ```

3.  **Configure your MCP Client:**
    Add this to your configuration file (e.g., `claude_desktop_config.json`):
    ```json
    {
      "mcpServers": {
        "edit-math": {
          "command": "python",
          "args": ["/absolute/path/to/mcp-edit-math/mcp_edit_math.py"]
        }
      }
    }
    ```

### 🤖 System Prompt (Required)

Add this to your AI's **Custom Instructions** or `.cursorrules` to activate the protocol:

```text
=== 🛡️ EDIT MATH PROTOCOL ===
Trigger: When user types "#editmath".

You are operating under a strict safety protocol. Direct file editing is FORBIDDEN.
Follow this sequence precisely:

1. 🔍 SCAN: Call `scan_dependencies(code, target_function)`.
   - Determine `language` ("js", "ts", "html") based on file extension.

2. 🎫 GET TICKET: Call `calculate_integrity_score`.
   - **REQUIRED:** You MUST provide the `proposed_header` argument (e.g., "function newName(arg1)").
   - The server will compare it with the target function name. If they differ, it will trigger Strict Mode.
   - **If server returns "STRICT MODE INTERVENTION":**
     a. STOP. Do not proceed.
     b. ASK THE USER: Explain the plan/conflicts and ask "Do you approve?".
     c. WAIT for the user's "Yes".
     d. RE-CALL `calculate_integrity_score` with `user_confirmed=True`.

3. 💾 COMMIT: Call `commit_safe_edit`.
   - If you need to force a commit (e.g., for unverified external libs), ask the user first, then use `force_override=True`.

### 🧘‍♀️ Philosophy: The Meta-Project

This project is a result of **pure Vibecoding**.

It was built *by* an AI, *for* AIs.
I realized that while AI coding is powerful, it lacks architectural awareness. So, I directed **Google Gemini** to build its own "Supervisor" — a tool that forces it to pause, think, and verify dependencies before writing code.

It is a self-correcting mechanism for the AI-assisted development era.

<a id="donate"></a>
## ☕ Support the Project

If this tool saved you time or prevented a bug, you can support the development via crypto:

*   **EVM (Ethereum / Base / BNB):** `0x13cA48D52bd7bB4f12Daa39730299b21c6DaA566`
*   **Solana:** `3TPUjSQ77GaCESp1Dugt8AjQJaD51jHAtckEQNLuWd83`
*   **Bitcoin:** `bc1qsles2ylewztk5297hnmfqwmjt2lk9qgchd78at`

---
License: Apache-2.0
Author: Annenkov Yuriy
**Co-authored with:** Google Gemini