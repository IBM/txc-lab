# Vulnerable Web Application

This is a deliberately vulnerable web application created for DevSecOps training purposes. It contains several security vulnerabilities that participants will need to identify and fix.

## Security Vulnerabilities

This application contains the following vulnerabilities:

1. SQL Injection
2. Cross-Site Scripting (XSS)
3. Insecure Dependencies
4. Hardcoded Credentials
5. Insecure Cookie Configuration
6. Lack of Input Validation
7. Information Disclosure in Error Messages

## Setup Instructions

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Installation

1. Navigate to the application directory:
   ```
   cd vulnerable-webapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

4. Access the application in your browser:
   ```
   http://localhost:3000
   ```

## Default Credentials

- Username: admin
- Password: admin123

## Warning

This application is intentionally vulnerable and should only be used for educational purposes in a controlled environment. Do not deploy this application to a production environment or expose it to the internet.