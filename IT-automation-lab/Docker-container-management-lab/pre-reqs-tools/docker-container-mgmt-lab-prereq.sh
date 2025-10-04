#!/bin/bash

# Docker Container Management Lab - Tool Installation Script for macOS
# This script installs all required tools for the Docker Container Management lab using Homebrew

echo "=========================================================="
echo "Docker Container Management Lab - Tool Installation Script"
echo "=========================================================="
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install a package with Homebrew if not already installed
install_brew_package() {
    if command_exists "$1"; then
        echo "✅ $2 is already installed"
    else
        echo "📦 Installing $2..."
        brew install "$3"
        echo "✅ $2 installed successfully"
    fi
    echo ""
}

# Function to install a cask with Homebrew if not already installed
install_brew_cask() {
    if command_exists "$1"; then
        echo "✅ $2 is already installed"
    else
        echo "📦 Installing $2..."
        brew install --cask "$3"
        echo "✅ $2 installed successfully"
    fi
    echo ""
}

# Check if Homebrew is installed
if ! command_exists brew; then
    echo "❌ Homebrew is not installed. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo "✅ Homebrew installed successfully"
else
    echo "✅ Homebrew is already installed"
fi
echo ""

echo "Updating Homebrew..."
brew update
echo ""

echo "=========================================================="
echo "Installing required tools for Docker Container Management"
echo "=========================================================="
echo ""

# List of tools used in the project
echo "Tools used in this project:"
echo "1. Docker - Container platform"
echo "2. Terraform - Infrastructure as Code"
echo "3. Ansible - Configuration management"
echo "4. Python - Required for Ansible and Docker SDK"
echo "5. Redis CLI - For testing Redis connections"
echo "6. curl - For testing web connections"
echo ""

# Install Docker Desktop
brew install docker

# Install Podman
brew install podman

# Install Terraform
install_brew_package "terraform" "Terraform" "terraform"

# Install Python
install_brew_package "python3" "Python" "python"

# Install Redis CLI
install_brew_package "redis-cli" "Redis CLI" "redis"

# Install curl (usually pre-installed on macOS)
install_brew_package "curl" "curl" "curl"

# Install Ansible and Python dependencies
if command_exists pip3; then
    echo "Installing Python packages..."
    
    # Check if Ansible is installed
    if python3 -c "import ansible" &>/dev/null; then
        echo "✅ Ansible is already installed"
    else
        echo "📦 Installing Ansible..."
        brew install ansible
        echo "✅ Ansible installed successfully"
    fi
else
    echo "❌ pip3 not found. Installing pip..."
    brew install python
    pip3 install ansible>=2.9.0 docker>=6.0.0
    echo "✅ Ansible and Docker SDK installed successfully"
fi

echo ""
echo "=========================================================="
echo "Verifying installations..."
echo "=========================================================="
echo ""

# Verify Podman
if command_exists podman; then
    echo "✅ Podman: $(podman --version)"
else
    echo "❌ Podman installation failed"
fi

# Verify Docker
if command_exists docker; then
    echo "✅ Docker: $(docker --version)"
else
    echo "❌ Docker installation failed"
fi

# Verify Terraform
if command_exists terraform; then
    echo "✅ Terraform: $(terraform --version | head -n 1)"
else
    echo "❌ Terraform installation failed"
fi

# Verify Python
if command_exists python3; then
    echo "✅ Python: $(python3 --version)"
else
    echo "❌ Python installation failed"
fi

# Verify Ansible
if command_exists ansible; then
    echo "✅ Ansible: $(ansible --version | head -n 1)"
else
    echo "❌ Ansible installation failed"
fi

# Verify Docker
if command_exists docker; then
    echo "✅ Docker: $(docker --version)"
else
    echo "❌ Docker installation failed"
fi

# Verify Redis CLI
if command_exists redis-cli; then
    echo "✅ Redis CLI: $(redis-cli --version)"
else
    echo "❌ Redis CLI installation failed"
fi

# Verify curl
if command_exists curl; then
    echo "✅ curl: $(curl --version | head -n 1)"
else
    echo "❌ curl installation failed"
fi

echo ""
echo "=========================================================="
echo "Installation complete!"
echo "=========================================================="
echo ""
echo "You can now run the Docker Container Management lab."
echo "Make sure Docker Desktop is running before starting the lab."
echo ""

# Made with Bob