#!/bin/bash
# Script to install essential security tools for DevSecOps lab
# Requires Homebrew to be pre-installed on macOS

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "===== Installing Essential Security Tools for DevSecOps Lab ====="

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Error: Homebrew is not installed. Please install Homebrew first."
    exit 1
fi

echo "Homebrew found. Proceeding with installation..."

# Update Homebrew
echo "Updating Homebrew..."
brew update

# Install OWASP ZAP
echo "Installing OWASP ZAP..."
brew install --cask owasp-zap

# Snyk has been removed from the tools list

# Install Trivy
echo "Installing Trivy..."
brew install aquasecurity/trivy/trivy

# Install Node.js (required for ESLint)
echo "Installing/Updating Node.js..."
brew install node

# Install ESLint with security plugins
echo "Installing ESLint with security plugins..."
npm install -g eslint eslint-plugin-security

# Install OWASP Dependency-Check
echo "Installing OWASP Dependency-Check..."
brew install dependency-check

# Verify installations
echo "===== Verifying Installations ====="

echo -n "OWASP ZAP: "
if [ -d "/Applications/ZAP.app" ]; then
    echo "Installed"
else
    echo "Installation may have failed"
fi

# Snyk check removed

echo -n "Trivy: "
if command -v trivy &> /dev/null; then
    echo "Installed - $(trivy --version)"
else
    echo "Installation may have failed"
fi

echo -n "ESLint: "
if command -v eslint &> /dev/null; then
    echo "Installed - $(eslint --version)"
else
    echo "Installation may have failed"
fi

echo -n "OWASP Dependency-Check: "
if command -v dependency-check &> /dev/null; then
    echo "Installed - $(dependency-check --version)"
else
    echo "Installation may have failed"
fi

echo "===== Installation Complete ====="
echo "All security tools have been installed successfully."
echo "You can now use these tools in your DevSecOps lab."

# Made with Bob