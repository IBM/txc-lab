---
description: Real-time security scanning that automatically detects vulnerabilities in your code and displays them in VS Code's Problems panel.
keywords: DevSecOps, security scanning, vulnerability detection, realtime scanning
---
# Real-time security scans

Get Bob to scan your code for potential vulnerability and security issues - especially helpful for reducing the risk of committing a secret! 

With security scans enabled, Bob scans your code with the following methods:

- Detect secrets: Bob looks for patterns that match known secrets used in code bases.
- Semgrep: Bob uses a set of rules to detect security vulnerabilities based on coding patterns.

No setup is required. Findings will automatically appear in your editor and the BobFindings viewer when they are found.

> **Note**: Bob reports findings for opened files. If you close a file after opening it, Bob continues to scan the file in the background.

To disable security scans:

1. Open the Bob - Settings panel by clicking the **Bob - Settings** button in the bottom right corner.
2. Click the toggle to turn the feature on or off. 
