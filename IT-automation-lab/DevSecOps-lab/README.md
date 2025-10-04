# DevSecOps with Bob IDE Lab

This lab provides a hands-on experience with DevSecOps practices using Bob IDE and essential security tools. Participants will identify, fix, deploy, and monitor a vulnerable web application while learning how to integrate security throughout the development lifecycle.

## Lab Overview

In this lab, you will:

1. **Identify security vulnerabilities** in a deliberately vulnerable web application
2. **Fix the vulnerabilities** using security best practices
3. **Deploy the application securely** using containerization
4. **Monitor the application** for ongoing security issues

## Lab Time

This lab is designed to be completed in approximately 30 minutes, making it ideal for a focused training session.

## Learning Objectives

By the end of this lab, you will be able to:

- Identify common security vulnerabilities in web applications
- Use Bob IDE to detect security issues in code
- Apply security best practices to fix vulnerabilities
- Implement secure deployment practices
- Set up monitoring for ongoing security assurance
- Understand the principles of DevSecOps and how they apply to real-world scenarios
- Learn how Bob IDE can enhance the DevSecOps workflow

## The Challenge

You've been given a vulnerable web application that needs to be secured before it can be deployed to production. The application is a simple message board that allows users to log in and post messages. However, it contains several security vulnerabilities that could be exploited by malicious actors.

Your challenge is to identify these vulnerabilities, fix them using best practices, deploy the application securely, and set up monitoring to ensure ongoing security.

## Your Task

Your task is divided into four main phases:

1. **Identify Vulnerabilities**: Use Bob IDE to scan the codebase and identify security issues.
2. **Fix Vulnerabilities**: Apply security best practices to fix the identified issues.
3. **Secure Deployment**: Deploy the application using secure practices.
4. **Monitor Security**: Set up monitoring to ensure ongoing security.

## How Bob IDE Helps

Bob IDE is an AI-powered development environment that can help you throughout the DevSecOps lifecycle:

- **Development Phase**: Bob IDE can identify security vulnerabilities in your code as you write it, suggest fixes, and explain security best practices.
- **Security Testing Phase**: Bob IDE can help you understand security scan results, prioritize issues, and implement fixes.
- **Deployment Phase**: Bob IDE can guide you in setting up secure deployment configurations and implementing security controls.
- **Monitoring Phase**: Bob IDE can help you interpret security alerts and suggest remediation steps.

Throughout this lab, you'll see how Bob IDE can be your DevSecOps assistant, helping you build more secure applications with less effort.

## Lab Structure

This repository contains:

- **vulnerable-webapp/**: A deliberately vulnerable Node.js web application
- **install-security-tools.sh**: Script to install required security tools

## Setting Up Your Local Environment

### 1. Clone the Lab Repository

```bash
git clone <repository-url>
cd devsecops-lab
```

### 2. Install Security Tools

For macOS users with Homebrew:

```bash
# Make the script executable
chmod +x install-security-tools.sh

# Run the installation script
./install-security-tools.sh
```

Alternatively, you can install the tools manually:

```bash
# OWASP ZAP
brew install --cask owasp-zap

# npm audit is built into npm, no additional installation needed

# Trivy
brew install aquasecurity/trivy/trivy

# Node.js and ESLint with security plugins
brew install node
npm install -g eslint eslint-plugin-security

# OWASP Dependency-Check
brew install dependency-check
```

### 3. Install Dependencies for the Vulnerable Web Application

```bash
cd vulnerable-webapp
npm install
```

### 3. Start the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### 4. Login Credentials

Use the following credentials to log in to the application:

- Username: `admin`
- Password: `admin123`

## Security Tools Used

This lab utilizes five essential security tools:

1. **ESLint with security plugins** - Static code analysis
2. **OWASP ZAP** - Web application security scanner
3. **OWASP Dependency-Check** - Identifies vulnerable dependencies
4. **Trivy** - Container vulnerability scanner
5. **npm audit** - Built-in Node.js dependency security checker

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         DevSecOps Workflow                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐          │
│  │               │     │               │     │               │          │
│  │  Development  │────▶│    Security   │────▶│  Deployment   │          │
│  │               │     │    Testing    │     │               │          │
│  └───────────────┘     └───────────────┘     └───────────────┘          │
│         │                     │                     │                   │
│         │                     │                     │                   │
│         ▼                     ▼                     ▼                   │
│  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐          │
│  │ Code Analysis │     │Vulnerability  │     │Secure Config  │          │
│  │ Secure Coding │     │   Scanning    │     │  Deployment   │          │
│  │  Practices    │     │ Penetration   │     │  Containers   │          │
│  │               │     │   Testing     │     │               │          │
│  └───────────────┘     └───────────────┘     └───────────────┘          │
│         │                     │                     │                   │
│         │                     │                     │                   │
│         ▼                     ▼                     ▼                   │
│  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐          │
│  │    ESLint     │     │ OWASP Dep-    │     │    Trivy      │          │
│  │ with security │     │ Check & ZAP   │     │  Container    │          │
│  │    plugins    │     │               │     │   Scanner     │          │
│  └───────────────┘     └───────────────┘     └───────────────┘          │
│                                                     │                   │
│                                                     │                   │
│                                                     ▼                   │
│                                            ┌───────────────┐            │
│                                            │               │            │
│                                            │  Production   │            │
│                                            │               │            │
│                                            └───────────────┘            │
│                                                     │                   │
│                                                     │                   │
│                                                     ▼                   │
│                                            ┌───────────────┐            │
│                                            │  Monitoring   │            │
│                                            │  & Response   │            │
│                                            │  (npm audit)  │            │
│                                            └───────────────┘            │
│                                                     │                   │
│                                                     │                   │
│                                                     ▼                   │
│                                            ┌───────────────┐            │
│                                            │ Continuous    │            │
│                                            │ Improvement   │            │
│                                            │               │            │
│                                            └───────────────┘            │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Warning

The vulnerable web application in this lab contains deliberate security vulnerabilities for educational purposes. Do not deploy it to a production environment or expose it to the internet.