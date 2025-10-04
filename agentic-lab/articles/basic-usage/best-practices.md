---
description: Learn the best practices for using Bob effectively, including mode selection, workflow optimization, and communication strategies.
keywords: basic-usage, best-practices, workflow-optimization, productivity
---

# Best practices for using Bob

This guide provides essential best practices to help you get the most out of Bob. Whether you're new to Bob or looking to optimize your workflow, these recommendations will help you work more effectively with your AI coding assistant.

## Understanding and using modes

Bob's modes are specialized personas that tailor Bob's behavior for specific tasks. Selecting the right mode for each task is crucial for optimal results.

### Built-in modes

Bob comes with several built-in modes, each designed for specific purposes:

| Mode | Purpose | When to use |
|------|---------|-------------|
| **Code** | Writing and modifying code | For implementing features, fixing bugs, or making code improvements |
| **Advanced** | Complex development tasks | When you need full access to all tools, including MCP and browser capabilities |
| **Architect** | Planning and designing | Before implementation, when you need to plan architecture or create technical specifications |
| **Ask** | Getting information | When you need explanations or information without modifying files |

### Mode selection strategy

For the most effective workflow:

1. **Start with Architect mode** for new projects or complex features to create a detailed implementation plan before writing any code.
2. **Switch to Code mode** for most day-to-day development tasks when you're ready to implement.
3. **Use Ask mode** when you need explanations or information without modifying files.
4. **Switch to Advanced mode** when you need access to additional tools like browser automation or MCP servers.

For more details on modes and how to switch between them, see [Using modes](/basic-usage/using-modes).

### Custom modes

You can create specialized modes for specific tasks or workflows:

- Create modes for specialized tasks like security reviews or documentation writing
- Configure custom modes with specific tool access permissions and role definitions
- Share modes with your team to standardize workflows

Learn more about creating and configuring custom modes in the [Custom modes](/features/custom-modes) documentation.

## Workflow optimization

### Plan before coding

Always start complex projects or features in Architect mode to:

- Generate a detailed implementation plan
- Break down complex problems into manageable steps
- Identify potential challenges before they arise
- Create a roadmap for implementation

This approach prevents breaking changes and provides a clear direction for development.

### Use checkpoints effectively

Checkpoints automatically version your workspace files during Bob tasks, enabling:

- Safe experimentation with AI-suggested changes
- Easy recovery from undesired modifications
- Comparison of different implementation approaches

> **Bob's tip:** If Bob starts producing subpar work, use the "Restore Files & Task" checkpoint option to roll back to a previous state. This is more effective than trying to correct flawed output with new instructions.

Learn more about using checkpoints in the [Checkpoints](/features/checkpoints) documentation.

### Integrate with version control

Regularly commit and push changes to your version control system:

- Create frequent, small commits with clear messages
- Push changes to remote repositories regularly
- Use branches for experimental features

Git provides an essential safety net to prevent accidental, permanent deletion of code.

## Communication strategies

### Write effective prompts

The quality of your prompts directly affects the quality of Bob's responses:

- **Be specific and clear**: Vague prompts lead to vague outputs. Detail what Bob should and should not do.
- **Provide examples**: When possible, include examples of the desired output format or style.
- **Use the Enhance Prompt feature**: Click the enhance button to automatically improve your query with additional context and structure.

Learn more about the Enhance Prompt feature in the [Enhance prompt](/features/enhance-prompt) documentation.

### Use context mentions

Context mentions let you reference specific elements of your project directly in your conversations with Bob:

- Use `@/path/to/file.js` to include specific file contents
- Use `@/path/to/folder` to include all files in a directory
- Use `@problems` to include VS Code Problems panel diagnostics
- Use `@terminal` to include recent terminal output

This approach is more efficient than copying and pasting code or describing file locations.

Learn more about context mentions in the [Context mentions](/basic-usage/context-mentions) documentation.

### Manage the context window

To prevent Bob from mixing up your goals:

- Start new tasks regularly with specific aims
- Avoid giving Bob your entire codebase at once
- Use direct file references to provide targeted context
- Break complex tasks into smaller, focused subtasks

## Security and control

### Configure auto-approval settings

Bob allows you to control which actions require your approval:

- **Manual approval**: Review and approve every action Bob takes (safest setting)
- **Auto-approve**: Grant Bob the ability to run specific tasks without interruption
- **Hybrid approach**: Auto-approve low-risk actions while requiring confirmation for riskier tasks

Configure these settings based on your comfort level and the sensitivity of your project.

Learn more about auto-approval settings in the [Auto-approving actions](/features/auto-approving-actions) documentation.

### Use .bobignore

The `.bobignore` file lets you specify files and directories that Bob should not access or modify:

1. Create a `.bobignore` file in your project root
2. Add patterns for sensitive files, build artifacts, and large assets
3. Use the same syntax as `.gitignore`

This helps protect sensitive information and prevent accidental changes to generated files.

Learn more about controlling file access in the [Using .bobignore](/features/bobignore) documentation. 

For more detailed information on security guidelines, see [Security guidelines](/basic-usage/bob-security-guidance).

### Set up rules

Bob allows you to specify rules to control how Bob performs tasks:

- Define rules globally or per project in the `.bob` directory
- Create mode-specific rules in `.Bob/rules-{mode-slug}/` directories
- Use rules to enforce coding standards, documentation requirements, or other workflow constraints

For more information on custom modes and rules, see the [Custom modes](/features/custom-modes) documentation.

## Marketplace resources

The [Bob Marketplace](/features/bob-marketplace) provides access to community-contributed extensions:

- Browse and install custom modes for specific tasks
- Configure MCP servers for extended capabilities
- Share your own custom modes and configurations with the community

These resources can help you quickly set up Bob for specific workflows or technologies.

By following these best practices, you'll be able to work more effectively with Bob, producing higher-quality code and solutions while maintaining control over your development process.