---
description: Learn how to use Bob Rules to provide persistent context and instructions to your AI assistant
keywords: bob rules, ai assistant, context, instructions, workflow constraints, coding standards
---

# Bob Rules: Enhancing Your AI Assistant with Persistent Instructions

Bob Rules is a powerful feature that allows you to provide persistent context and instructions to your AI assistant through reusable markdown files. This article explains how to set up and use Bob Rules effectively to improve your workflow.

## What Are Bob Rules?

Bob Rules are markdown files that contain instructions, guidelines, or constraints that you want your AI assistant to follow consistently. These rules are automatically appended to your messages, ensuring that the assistant always has access to this context when responding to your requests.

Key benefits of using Bob Rules:
- Maintain consistent coding standards across your project
- Enforce documentation requirements
- Define workflow constraints
- Provide project-specific context without repeating it in every message
- Create specialized behavior for different types of tasks

## Setting Up Bob Rules

### Basic Setup

1. Create a `.bob/rules/` folder in the root level of your project
2. Add your rules as markdown (.md) files inside this folder
3. These rules will be automatically appended whenever you send a message to the assistant

### Advanced Configuration

Bob offers flexible configuration options for rules:

- **Global vs. Project-Specific Rules**: Define rules globally or per project in the `.bob` directory
- **Mode-Specific Rules**: Create mode-specific rules in `.bob/rules-{mode-slug}/` directories (e.g., `.bob/rules-code/` for rules that only apply in Code mode)
- **Rule Organization**: You can create multiple rule files to organize different types of instructions

## Writing Effective Rules

When creating your rule files, consider the following best practices:

### Structure Your Rules Clearly

Use markdown formatting to make your rules easy to read:

```markdown
# Project Coding Standards

## Naming Conventions
- Use camelCase for variable names
- Use PascalCase for class names
- Use UPPER_SNAKE_CASE for constants

## Documentation Requirements
- All public functions must have docstrings
- Include parameter descriptions and return values
```

### Be Specific and Actionable

Provide clear, specific instructions rather than vague guidelines:

```markdown
# Code Review Rules

- Check for proper error handling in all API calls
- Ensure all user inputs are validated
- Verify that database queries are optimized
- Confirm that security best practices are followed
```

### Include Context When Necessary

Sometimes providing project context helps the assistant understand your rules better:

```markdown
# Project Architecture Context

This project follows a clean architecture pattern with:
- Domain layer: Core business logic
- Application layer: Use cases and application services
- Infrastructure layer: External dependencies and implementations
- Interface layer: User interfaces and API endpoints

When suggesting code changes, maintain this separation of concerns.
```

## Example Use Cases

### Enforcing Coding Standards

Create a rule file that defines your team's coding standards:

```markdown
# Coding Standards

- Follow PEP 8 for Python code
- Use ESLint rules for JavaScript
- Maximum line length: 100 characters
- Use 4 spaces for indentation (no tabs)
- Include type hints in Python functions
```

### Documentation Requirements

Ensure consistent documentation across your codebase:

```markdown
# Documentation Requirements

- All public functions must have docstrings
- Include parameter descriptions and return values
- Document exceptions that may be raised
- Add examples for complex functions
- Keep comments up-to-date with code changes
```

### Project-Specific Workflows

Define workflows specific to your project:

```markdown
# Git Workflow

- Use feature branches named as feature/description
- Write descriptive commit messages
- Squash commits before merging
- Include ticket numbers in commit messages
```

## Best Practices

1. **Keep Rules Concise**: Focus on the most important guidelines to avoid overwhelming the assistant
2. **Update Rules as Needed**: Revise your rules as your project evolves
3. **Organize by Category**: Split rules into logical categories across multiple files
4. **Test Your Rules**: Verify that the assistant correctly follows your rules
5. **Combine with Mode-Specific Rules**: Use different rules for different assistant modes

## Conclusion

Bob Rules provides a powerful way to customize your AI assistant's behavior to match your specific needs and workflows. By creating well-structured rule files, you can ensure consistent, high-quality assistance that aligns perfectly with your project requirements.

Start by creating a `.bob/rules/` directory in your project and adding your first rule file today to experience the benefits of persistent context and instructions.
