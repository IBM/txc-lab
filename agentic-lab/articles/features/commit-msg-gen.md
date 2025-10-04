---
description: Generate conventional commit messages automatically based on your staged changes
keywords: commit,message,generation,git,conventional,commits
---

# Generating commit messages

Bob can automatically generate meaningful commit messages based on your staged changes, saving you time and ensuring consistency in your commit history.

    ![Commit message image](/assets/Commit-msg.png)

## Why use this feature?

- **Save time**: Generate well-formatted commit messages with a single click
- **Maintain consistency**: Follow conventional commit standards automatically
- **Match project style**: Bob analyzes your branch name and commit history to match your project's conventions
- **Iterate easily**: Generate alternative suggestions if you don't like the first one

## How it works

Bob examines your staged changes to understand what modifications you've made to your codebase. It then analyzes your branch name and recent commit history to determine the appropriate commit message format that matches your project's style.

## Getting started

### Prerequisites

Your changes must be staged in the Source Control panel.

### Basic usage

To automatically generate a commit message:

1. Click the sparkle (✨) icon next to the commit message box.
2. Review your commit message made by Bob.
   - Click the sparkle (✨) icon again for alternative suggestions. Apply edits to your message, if needed.
3. Commit your changes.

## Tips and best practices

- For the best results, make atomic commits (changes that address a single concern).
- If you're working on a specific issue, include the issue number in your branch name.
- Edit the generated message if needed to add more specific details.
- Use the regenerate option if the first suggestion doesn't capture your changes accurately.

## Related features

- [Generating pull requests](/features/pr-gen)