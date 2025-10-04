---
description: Learn how to use and switch between specialized modes in Bob to optimize your workflow for different tasks like coding, planning, and debugging.
keywords: basic-usage, modes, workflow-optimization, user-interface
---

# Using modes

Bob's modes are specialized personas that tailor Bob's behavior for your specific tasks. Each mode offers different capabilities and access levels to help you accomplish particular goals more efficiently.

## Why use different modes?

- **Task specialization:** Get precisely the type of assistance you need for your current task
- **Safety controls:** Prevent unintended file modifications when focusing on planning or learning
- **Focused interactions:** Receive responses optimized for your current activity
- **Workflow optimization:** Seamlessly transition between planning, implementing, debugging, and learning

## Switching between modes

You have 4 options to switch modes:

1. **Dropdown menu:** Click the selector to the left of the chat input
   
2. **Slash command:** Type `/architect`, `/ask`, `/debug`, `/code`, or `/orchestrator` at the beginning of your message. This will switch to that mode and clear the input field.
   
3. **Toggle command/Keyboard shortcut:** Use the keyboard shortcut below, applicable to your operating system. Each press cycles through the available modes in sequence, wrapping back to the first mode after reaching the end.
       
    | Operating System | Shortcut |
    |------------------|----------|
    | macOS | ⌘ + . |
    | Windows | Ctrl + . |
    | Linux | Ctrl + . |

4. **Accept suggestions:** Click on mode switch suggestions that Bob offers when appropriate
   
## Built-in modes

By default, the following modes are available with Bob:

### Code mode

| Aspect | Details |
|--------|---------|
| **Name** | `💻 Code` |
| **Role definition** | You are Bob, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices. |
| **Short description** | Write, modify, and refactor code. |
| **Tool access** | `read`, `edit`, `command` |
| **Use case** | General purpose coding tasks, optimized for cost efficiency. |

### Ask mode

| Aspect | Details |
|--------|---------|
| **Name** | `❓ Ask` |
| **Role definition** | You are Bob, a knowledgeable technical assistant focused on answering questions and providing information about software development, technology, and related topics. |
| **Short description** | Get answers and explanations. |
| **Tool access** | `read`, `browser`, `mcp` |
| **Use case** | Conversational questions and information about your code. |

### Architect mode

| Aspect | Details |
|--------|---------|
| **Name** | `🏗️ Architect` |
| **Role definition** | You are Bob, an experienced technical leader who is inquisitive and an excellent planner. Your goal is to gather information and get context to create a detailed plan for accomplishing the user's task, which the user will review and approve before they switch into another mode to implement the solution. |
| **Short description** | Plan and design before implementation. |
| **Tool access** | `read`, `edit` - markdown only, `browser`, `mcp` |
| **Use case** | High-level planning and technical leadership. Big picture thinking! |

### Advanced mode

| Aspect | Details |
|--------|---------|
| **Name** | `🛠️ Advanced` |
| **Role definition** | You are Bob, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices. |
| **Short description** | Advanced version of Code mode, with more tools. |
| **Tool access** | All tool groups: `read`, `edit`, `browser`, `command`, `mcp` |
| **Use case** | Advanced coding tasks, requiring access to MCP and browser tools. Power users! |
| **Special features** | No tool restrictions—full flexibility for all coding tasks |

## Comparing the built-in modes

The following table compares the built-in modes to help you choose the right one for your specific task:

| Mode | Primary Purpose | When to Use | Key Capabilities | Tool Access |
|------|----------------|-------------|------------------|-------------|
| **💻 Code** | Writing and modifying code | When implementing features, fixing bugs, or making code improvements | Efficient code generation, refactoring, and debugging | `read`, `edit`, `command` |
| **❓ Ask** | Getting information and explanations | When you need to understand concepts or analyze existing code without making changes | Detailed explanations, code analysis, and technical recommendations | `read`, `browser`, `mcp` |
| **🏗️ Architect** | Planning and designing | Before implementation, when you need to think through architecture or create a technical plan | System design, breaking down complex problems, creating specifications | `read`, `edit` (markdown only), `browser`, `mcp` |
| **🛠️ Advanced** | Complex development tasks | When you need full access to all tools for sophisticated development workflows | All capabilities of other modes combined with no restrictions | All tool groups |

### Mode selection guidelines

- **Start with Architect mode** for new projects or complex features to plan before implementation.
- **Use Code mode** for most day-to-day development tasks.
- **Switch to Ask mode** when you need explanations without modifying files.
- **Use Advanced mode** when you need unrestricted access to all tools for complex workflows.

## Customizing modes

Tailor Bob Code's behavior by customizing existing modes or creating new specialized assistants. Define tool access, file permissions, and behavior instructions to enforce team standards or create purpose-specific assistants. See [Custom Modes documentation](/features/custom-modes) for setup instructions.
