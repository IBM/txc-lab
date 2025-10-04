---
description: Learn how to use context mentions to provide Bob with specific information about your project, including files, folders, problems, and Git commits.
keywords: basic-usage, context-mentions, communication, file-references
---

# Context mentions

Context mentions let you reference specific elements of your project directly in your conversations with Bob. By using the `@` symbol, you can point Bob to files, folders, problems, and other project components, enabling more accurate and efficient assistance.

## Types of mentions

With context mentions, you can reference various elements of your project:

| Mention Type | Format | Description | Example Usage |
|--------------|--------|-------------|--------------|
| **File** | `@/path/to/file.ts` | Includes file contents in request context | "Explain the function in @/src/utils.ts" |
| **Folder** | `@/path/to/folder` | Includes contents of all files directly in the folder (non-recursive) | "Analyze the code in @/src/components" |
| **Problems** | `@problems` | Includes VS Code Problems panel diagnostics | "@problems Fix all errors in my code" |
| **Terminal** | `@terminal` | Includes recent terminal command and output | "Fix the errors shown in @terminal" |
| **Git Commit** | `@a1b2c3d` | References specific commit by hash | "What changed in commit @a1b2c3d?" |
| **Git Changes** | `@git-changes` | Shows uncommitted changes | "Suggest a message for @git-changes" |
| **URL** | `@https://example.com` | Imports website content | "Summarize @https://docusaurus.io/" |

### File mentions

File mentions are the most commonly used type, letting you include the contents of specific files in your conversation with Bob.

| Capability | Details |
|------------|---------|
| **Format** | `@/path/to/file.ts` (always start with `/` from workspace root) |
| **Provides** | Complete file contents with line numbers |
| **Works with** | Text files, PDFs, and DOCX files (with text extraction) |
| **Works in** | Initial requests, feedback responses, and follow-up messages |
| **Limitations** | Very large files may be truncated; binary files not supported |

> **Bob's tip:** For large files, you can mention specific sections by using the file's path followed by line numbers, like `@/src/app.js:10-20` to include only lines 10-20.

### Folder mentions

With folder mentions, you can reference multiple files at once, providing broader context from a directory.

| Capability | Details |
|------------|---------|
| **Format** | `@/path/to/folder` (no trailing slash) |
| **Provides** | Complete contents of all files within the directory |
| **Includes** | Contents of non-binary text files directly within the folder (not recursive) |
| **Best for** | Providing context from multiple files in a directory |
| **Tip** | Be mindful of context window limits when mentioning large directories |

> **Note:** Folder mentions are non-recursive, meaning they only include files directly in the specified folder, not in subfolders.

### Problems mention

The problems mention imports diagnostics from VS Code's Problems panel, helping you resolve multiple issues at once.

| Capability | Details |
|------------|---------|
| **Format** | `@problems` |
| **Provides** | All errors and warnings from VS Code's problems panel |
| **Includes** | File paths, line numbers, and diagnostic messages |
| **Groups** | Problems organized by file for better clarity |
| **Best for** | Fixing errors without manual copying |

Example usage: "@problems Can you help me fix all these issues?"

### Terminal mention

Terminal mentions capture recent command output, helping you debug build errors or analyze command results.

| Capability | Details |
|------------|---------|
| **Format** | `@terminal` |
| **Captures** | Last command and its complete output |
| **Preserves** | Terminal state (doesn't clear the terminal) |
| **Limitation** | Limited to visible terminal buffer content |
| **Best for** | Debugging build errors or analyzing command output |

> **Bob's tip:** When troubleshooting a build failure, try "What's wrong with @terminal?" to get immediate insights into the error without manually copying the output.

### Git mentions

Git mentions help you work with version control by referencing commits and changes.

| Type | Format | Provides | Limitations |
|------|--------|----------|------------|
| **Commit** | `@a1b2c3d` | Commit message, author, date, and complete diff | Only works in Git repositories |
| **Working Changes** | `@git-changes` | `git status` output and diff of uncommitted changes | Only works in Git repositories |

Example usage: "What's the purpose of @a1b2c3d?" or "Suggest a commit message for @git-changes"

### URL mentions

URL mentions let you reference external web content in your conversations with Bob.

| Capability | Details |
|------------|---------|
| **Format** | `@https://example.com` |
| **Processing** | Uses headless browser to fetch content |
| **Cleaning** | Removes scripts, styles, and navigation elements |
| **Output** | Converts content to Markdown for readability |
| **Limitation** | Complex pages may not convert perfectly |

> **Bob's tip:** URL mentions are useful for referencing documentation. Try "Can you explain @https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" to get help understanding a concept with the official docs as context.

## How to use mentions

Using context mentions is straightforward:

1. Type `@` in the chat input to trigger the suggestions dropdown
2. Continue typing to filter suggestions or use arrow keys to navigate
3. Select with Enter key or mouse click
4. Combine multiple mentions in a request: "Fix @problems in @/src/component.ts"

The dropdown automatically suggests:
- Recently opened files
- Visible folders
- Recent git commits
- Special keywords (`problems`, `terminal`, `git-changes`)
- All currently open files (regardless of ignore settings or directory filters)

The dropdown automatically filters out common directories like `node_modules`, `.git`, `dist`, and `out` to reduce noise, even though you can include their content if manually typed.

> **Pro tip:** You can combine multiple mentions in a single request. Try "Compare @/src/v1/api.js with @/src/v2/api.js and explain the differences."

## Important behaviors

### Ignore file interactions

Context mentions have specific behaviors when interacting with ignored files:

| Behavior | Description |
|----------|-------------|
| **`.bobignore` bypass** | File and folder `@mentions` bypass `.bobignore` checks when fetching content for context. Content from ignored files will be included if directly mentioned. |
| **`.gitignore` bypass** | Similarly, file and folder `@mentions` do not respect `.gitignore` rules when fetching content. |
| **Git command respect** | Git-related mentions (`@git-changes`, `@commit-hash`) do respect `.gitignore` since they rely on Git commands. |

This means you can reference specific files that would normally be ignored by Bob or Git, which is particularly useful when you need to discuss generated files or other typically ignored content.

## Putting it all together

Context mentions enhance your interactions with Bob by providing precise references to your project's elements. Instead of copying and pasting code or describing file locations, you can directly reference what you're discussing.

Effective combinations of different mention types:

- "Fix @problems in @/src/components and explain what was wrong"
- "Review @git-changes and suggest improvements"
- "Compare @/v1/api.js with @https://api-docs.example.com and check for inconsistencies"

By using context mentions effectively, you can communicate more precisely with Bob and receive more targeted assistance.
