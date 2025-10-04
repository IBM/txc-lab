---
description: Generate pull request descriptions and create PRs directly from your IDE
keywords: pull,request,PR,generation,description,GitHub,GitLab
---

# Generating pull requests

Bob can generate pull requests (PRs) and PR descriptions directly from your IDE, streamlining your development workflow and saving time.

## Why use this feature?

- **Save time**: Generate detailed PR descriptions automatically based on your changes.
- **Maintain consistency**: Ensure all PRs follow a consistent format.
- **Improve collaboration**: Provide clear context for reviewers with well-structured descriptions.
- **Streamline workflow**: Create PRs without leaving your IDE.

## How it works

Bob analyzes your branch changes, commit history, and branch name to understand the purpose and scope of your work. It then generates a meaningful PR title and detailed description that summarizes your changes, making it easier for reviewers to understand the context and purpose of your PR.

The PR generation process is interactive, allowing you to select the target branch and remote repository before creating the PR.

## Getting started

### Prerequisites

- Your changes must be committed to a branch.
- You must have push access to the remote repository.

### Basic usage

You can choose from 3 options to initiate a PR flow:

- Click the PR icon in the Source Control panel.
- Use the command palette (Cmd+Shift+P on Mac, Ctrl+Shift+P on Windows/Linux) and search for "Bob: Generate PR".
- Type `/create-pr` in the Bob chat interface.

Bob will then guide you through the following steps:

1. Select the base branch you want to merge into. Bob will suggest the three most likely branches.
2. Select the remote repository, if you have multiple remotes.
3. Review the generated PR description and title.
4. Create the PR.
5. Get the newly created PR link in your chat.


## Using templates for PR descriptions

Bob automatically detects and uses your project's existing PR templates when generating pull request descriptions. This ensures your PRs are consistent with your team's established standards.

### Template detection

Bob searches for PR templates in the following locations relative to your project root:

1. `${cwd}/pull_request_template.md`
2. `${cwd}/docs/pull_request_template.md`
3. `${cwd}/.github/pull_request_template.md`
4. `${cwd}/.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`
5. `${cwd}/PULL_REQUEST_TEMPLATE/pull_request_template.md`
6. `${cwd}/docs/PULL_REQUEST_TEMPLATE/pull_request_template.md`

If Bob finds multiple templates, it will let the user choose which template to use for the PR description.

### Default template

If no template is found in your project, Bob uses a built-in template that includes:

- A descriptive title derived from your branch name
- A summary of changes
- Key implementation details
- Testing information
- Any relevant links or references

### Editing the generated description

After generating the PR description, you can choose to edit it before submission:

1. When prompted, select whether you want to edit the description.
2. If you choose to edit, Bob opens the description in a temporary markdown file.
3. Make your desired changes to the description.
4. Click the "Done" button when you've completed your edits.

If you choose not to edit, Bob uses the generated description as-is.

### Customizing templates

For the best results with Bob's PR generation:

- Use clear section headings in your templates (e.g., `## Summary`, `## Changes`)
- Include placeholder text that provides context (e.g., `<!-- Describe the purpose of this PR -->`)
- Consider adding sections for testing instructions and related issues

## Tips and best practices

- Use descriptive branch names to help Bob generate more accurate PR descriptions.
- Review and edit the generated description before creating the PR.

## Related features

- [Generating commit messages](/features/commit-msg-gen)
