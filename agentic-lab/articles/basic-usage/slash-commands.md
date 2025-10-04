---
description: Learn how to create and use custom slash commands in Bob to automate workflows and extend functionality with markdown-based definitions.
keywords: basic-usage, commands, workflow-automation, customization
---

# Using slash commands

Create custom slash commands to automate repetitive tasks and extend Bob's functionality with simple markdown files.

To get started, type / in the chat to see all available commands, or create your own by adding a markdown file to .bob/commands/ or ~/.bob/commands/

## Overview

Slash commands let you create reusable prompts and workflows that can be triggered instantly. Turn complex multi-step processes into single commands, standardize team practices, and automate repetitive tasks with simple markdown files.

Key benefits:

- Workflow automation: Turn complex multi-step processes into single commands
- Team standardization: Share commands across your team for consistent practices
- Context preservation: Include project-specific context in every command
- Quick access: Fuzzy search and autocomplete for instant command discovery

## Creating custom commands

Custom commands extend Bob's functionality by adding markdown files to specific directories:

- Project-specific: .bob/commands/ in your workspace root
- Global: ~/.bob/commands/ in your home directory

The filename becomes the command name. For example:

- review.md → /review
- test-api.md → /test-api
- deploy-check.md → /deploy-check

### Command name processing

When creating commands through the UI, command names are automatically processed:

- Converted to lowercase
- Spaces replaced with dashes
- Special characters removed
- Leading/trailing dashes removed

Example: "My Cool Command!" becomes my-cool-command

### Basic command format

Create a simple command by adding a markdown file:

```markdown
Help me review this code for security issues and suggest improvements.
```

### Advanced command with frontmatter

Add metadata using frontmatter for enhanced functionality:

```markdown
---
description: Create a new API endpoint
argument-hint: <endpoint-name> <http-method>
---
Create a new API endpoint called $1 that handles $2 requests.
Include proper error handling and documentation.
```

#### Frontmatter fields

- description: Appears in the command menu to help users understand the command's purpose
- argument-hint: Provides a hint about expected arguments when using the command


## Command management UI

Bob provides a dedicated UI for managing custom commands.

Click the commands icon in the Bob panel to open the command manager.

### Creating a new command

1. Type your command name in the input field (e.g., "Sample command name")
2. Click the + button to create the command
3. A new file will be created and opened automatically (e.g., sample-command-name.md)

## Using slash commands

Type / in the chat to see a unified menu containing both types of commands. The menu shows both custom workflow commands and mode-switching commands in the same interface.

1. Unified menu: Both custom commands and mode-switching commands appear together
2. Autocomplete: Start typing to filter commands (e.g., /sam shows sample-command-name)
3. Fuzzy search: Find commands even with partial matches
4. Description preview: See command descriptions in the menu
5. Visual indicators: Mode commands are distinguished from custom commands with special icons

## Argument hints

Argument hints provide instant help for slash commands, showing you what kind of information to provide when a command expects additional input.

When you type / to bring up the command menu, commands that expect arguments will display a light gray hint next to them. This hint tells you what kind of argument the command is expecting.

For example:

- /mode <mode_slug> - The hint <mode_slug> indicates you should provide a mode name like code or debug
- /api-endpoint <endpoint-name> <http-method> - Shows you need both an endpoint name and HTTP method

After selecting the command, it will be inserted into the chat input followed by a space. The hint is not inserted; it is only a visual guide to help you know what to type next. You must then manually type the argument after the command.

### Adding argument hints to custom commands

You can add argument hints to your custom commands using the argument-hint field in the frontmatter:

```markdown
---
description: Create a new API endpoint
argument-hint: <endpoint-name> <http-method>
---
Create a new API endpoint called $1 that handles $2 requests.
```

This will display as /api-endpoint <endpoint-name> <http-method> in the command menu.

### Best practices for argument hints

- Be specific: Use descriptive placeholders like <file-path> instead of generic ones like <arg>
- Show multiple arguments: If your command needs multiple inputs, show them all: <source> <destination>
- Use consistent format: Always wrap placeholders in angle brackets: <placeholder>
- Keep it concise: Hints should be brief and clear

### Common questions

- "What if I don't provide the argument?" The command might not work as expected, or it might prompt you for more information. The hint is there to help you get it right the first time.
- "Do all commands have hints?" No, only commands that are designed to take arguments will have hints. Commands that work without additional input won't show hints.
- "Can I use a command without replacing the hint?" The hint text (like <mode_slug>) needs to be replaced with actual values. Leaving the hint text will likely cause the command to fail or behave unexpectedly.

## Best practices

### Command naming

- Use descriptive, action-oriented names
- Keep names concise but clear
- Use hyphens for multi-word commands
- Avoid generic names like help or test
- Note: Names are automatically slugified (lowercase, special characters removed)
- The .md extension is automatically added/removed as needed

### Command content

- Start with a clear directive
- Use structured formats (lists, sections)
- Include specific requirements
- Reference project conventions
- Keep commands focused on a single task

### Organization

- Group related commands in subdirectories
- Use consistent naming patterns
- Document complex commands
- Version control your commands
- Share team commands in the project repository

## Troubleshooting

### Commands not appearing

- Check file location: Ensure custom command files are in .bob/commands/ or ~/.bob/commands/
- Verify file extension: Custom commands must be .md files

### Command not found

When a slash command isn't found, the LLM will see:

```
The slash command '/unknown-command' was not found. Please check the command name and try again.
```

### Command conflicts

- Custom project commands override global custom commands with the same name
- Use unique names to avoid conflicts
- When creating duplicate names through the UI, numbers are appended (e.g., new-command-1, new-command-2)

## About mode commands

The slash menu includes mode-switching commands (like /code, /ask) that fundamentally change the AI's operational mode - they don't just inject text but switch the entire AI context. Custom modes you create also appear as slash commands (e.g., a mode with slug reviewer becomes /reviewer). These mode commands cannot be overridden by custom workflow commands.

Learn more in [Using modes](/basic-usage/using-modes) and [Custom modes](/features/custom-modes).
