# Running the application

Always check the `Makefile` for up-to-date information.

# Frontend Test Patterns & Conventions

This document outlines the testing patterns and conventions used in this project to ensure consistency across all test files.

## 📋 Test Patterns & Conventions

### **1. Import Structure & Libraries**

Always use these imports for frontend tests:

```typescript
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { api } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
```

**Key Libraries Used:**
- `@jest/globals` for test functions (describe, expect, it, jest, beforeEach)
- `@testing-library/react` for DOM queries (screen, waitFor)
- `@testing-library/user-event` for user interactions
- `react-router-dom` for routing context (BrowserRouter, useNavigate)
- Custom `renderWithQueryClient` helper for React Query context

### **2. Test Structure Patterns**

**Describe Block Naming:**
- Component tests: `describe('ComponentName', () => {})`
- Feature tests: `describe('FeatureName', () => {})`
- Nested describes for variants: `describe('VariantName', () => {})`

**Test Case Naming:**
- Use `it('should [action/behavior]', () => {})` format
- Be descriptive about expected behavior
- Use present tense for assertions
- Examples:
  - `it('should render login form', () => {})`
  - `it('should display validation errors when form fields are invalid', async () => {})`
  - `it('should call login mutation on valid form submission', async () => {})`

### **3. Rendering Patterns**

**Custom Render Functions:**
Always create a custom render function for each component test:

```typescript
function renderComponentName() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <ComponentName prop="value" />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
```

**Key Patterns:**
- Always wrap components in `<BrowserRouter>` for routing context
- Use `renderWithQueryClient` for React Query context
- Return spread of `user` and `renderResult` for easy destructuring
- Place render functions at bottom of file
- Name function as `render[ComponentName]`

### **4. Mock Patterns**

**API Mocking:**
```typescript
// @ts-expect-error Property 'mockResolvedValue' does not exist
const mockRequest = api.post.mockResolvedValue({});

// For complex API mocking:
// @ts-expect-error Property 'mockResolvedValue' does not exist
api.get.mockImplementation((url) => {
  if (url === '/user') {
    return Promise.resolve({ data: mockUserDto });
  }
  return Promise.reject(new Error('Unknown API endpoint'));
});
```

**Navigation Mocking:**
```typescript
const navigate = jest.fn();
// @ts-expect-error Property 'mockResolvedValue' does not exist
useNavigate.mockReturnValue(navigate);
```

**Error Mocking:**
```typescript
// @ts-expect-error Property 'mockResolvedValue' does not exist
api.post.mockRejectedValue(new Error('Request failed'));
```

### **5. Mock Data Patterns**

**Consistent Mock Objects:**
Create realistic mock data with consistent naming:

```typescript
const mockUser: User = {
  email: 'mockuser@example.com',
  username: 'mockuser',
  bio: 'This is a mock bio of the user.',
  image: 'https://example.com/mockuser-image.jpg',
};

const mockArticle: Article = {
  slug: 'example-article',
  title: 'Example Article Title',
  description: 'This is a mock description of the article.',
  body: 'This is the body of the mock article. It contains detailed content.',
  tagList: ['mock', 'test', 'article'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  favorited: false,
  favoritesCount: 42,
  author: {
    username: 'mockUser',
    bio: 'This is a mock bio of the author.',
    image: 'https://example.com/mock-image.jpg',
    following: false,
  },
};

const mockUserDto: UserDto = {
  user: {
    email: 'mockuser@example.com',
    token: 'mock-jwt-token-12345',
    username: 'mockuser',
    bio: 'This is a mock bio of the user.',
    image: 'https://example.com/mockuser-image.jpg',
  },
};
```

**Mock Data Guidelines:**
- Use `mock` prefix for all mock objects
- Use realistic but obviously fake data
- Include all required fields
- Use consistent email domains (`example.com`)
- Use descriptive but generic content

### **6. Assertion Patterns**

**DOM Assertions:**
```typescript
expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
expect(screen.getAllByRole('alert')).toHaveLength(2);
expect(screen.getByText(/Request failed/i)).toBeInTheDocument();
```

**Async Assertions:**
Always wrap async assertions in `waitFor`:

```typescript
await waitFor(() => {
  expect(mockRequest).toHaveBeenCalled();
});

await waitFor(() => {
  expect(screen.getByText(/Request failed/i)).toBeInTheDocument();
});

await waitFor(() => {
  expect(navigate).toHaveBeenCalled();
});
```

**Value Assertions:**
```typescript
expect(screen.getByPlaceholderText('Email')).toHaveValue(mockUser.email);
expect(screen.getByText(`(${mockArticle.favoritesCount})`)).toBeInTheDocument();
```

### **7. User Interaction Patterns**

**Destructured User Events:**
```typescript
const { click, type, clear } = renderComponentName();

await type(screen.getByPlaceholderText('Email'), 'test@example.com');
await click(screen.getByRole('button', { name: /submit/i }));
await clear(screen.getByPlaceholderText('Name'));
```

**Common User Actions:**
- `click` - for button clicks
- `type` - for text input
- `clear` - for clearing input fields
- Always use `await` with user actions

### **8. Setup Patterns**

**beforeEach for Common Setup:**
```typescript
beforeEach(() => {
  // @ts-expect-error Property 'mockResolvedValue' does not exist
  api.get.mockImplementation((url) => {
    if (url === '/user') {
      return Promise.resolve({ data: mockUserDto });
    }
    return Promise.reject(new Error('Unknown API endpoint'));
  });
});
```

Use `beforeEach` for:
- Setting up common mocks
- Resetting state between tests
- Configuring default API responses

### **9. File Organization**

**Bottom-up Structure:**
1. Imports at the top
2. Main test describe blocks
3. Helper render functions
4. Mock data constants
5. Type definitions (if needed)

**Example Structure:**
```typescript
// 1. Imports
import { describe, expect, it, jest } from '@jest/globals';
// ... other imports

// 2. Test blocks
describe('ComponentName', () => {
  it('should render correctly', () => {
    // test implementation
  });
});

// 3. Helper functions
function renderComponentName() {
  // render implementation
}

// 4. Mock data
const mockUser: User = {
  // mock data
};
```

### **10. TypeScript Patterns**

**Mock Type Suppression:**
Always use this exact comment for mock type errors:

```typescript
// @ts-expect-error Property 'mockResolvedValue' does not exist
api.post.mockResolvedValue({});
```

**Type Imports:**
```typescript
import { Article } from '~entities/article/article.types';
import { UserDto } from '~shared/api/api.types';
import { LoginUser } from './login.types';
```

### **11. Utility Function Testing**

For pure utility functions (no React components):

```typescript
import { describe, expect, it } from '@jest/globals';
import { utilityFunction } from './utility-function';

describe('Utility Function Name', () => {
  it('should handle empty input', () => {
    expect(utilityFunction('')).toBe('expected result');
  });

  it('should process valid input correctly', () => {
    const input = 'test input';
    const result = utilityFunction(input);
    expect(result).toBe('expected result');
  });
});
```

**Utility Test Guidelines:**
- No need for `renderWithQueryClient` or `BrowserRouter`
- No need for user events or screen queries
- Focus on input/output testing
- Test edge cases and error conditions
- Use descriptive test names

### **12. Common Test Scenarios**

**Form Testing:**
```typescript
it('should display validation errors when form fields are invalid', async () => {
  const { click, type } = renderForm();

  await type(screen.getByPlaceholderText('Email'), 'invalid-email');
  await click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

**API Call Testing:**
```typescript
it('should call API on form submission', async () => {
  // @ts-expect-error Property 'mockResolvedValue' does not exist
  const mockRequest = api.post.mockResolvedValue({});

  const { click, type } = renderForm();

  await type(screen.getByPlaceholderText('Email'), mockUser.email);
  await click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(mockRequest).toHaveBeenCalled();
  });
});
```

**Navigation Testing:**
```typescript
it('should navigate on successful action', async () => {
  const navigate = jest.fn();
  // @ts-expect-error Property 'mockResolvedValue' does not exist
  useNavigate.mockReturnValue(navigate);

  const { click } = renderComponent();

  await click(screen.getByRole('button', { name: /action/i }));

  await waitFor(() => {
    expect(navigate).toHaveBeenCalled();
  });
});
```

## 🔧 Best Practices

1. **Always use async/await** for user interactions and API calls
2. **Wrap assertions in waitFor** when testing async behavior
3. **Use descriptive test names** that explain the expected behavior
4. **Create realistic mock data** that represents actual use cases
5. **Test both success and error scenarios**
6. **Keep tests focused** - one behavior per test
7. **Use consistent naming** for mock objects and functions
8. **Place helper functions at the bottom** of test files
9. **Group related tests** using nested describe blocks
10. **Always suppress TypeScript errors** for mock functions with the standard comment


# 🛠️ NPM Scripts & Targets

This project uses the following npm scripts for development, testing, and deployment:

## **Development Scripts**

**`npm start`**
- **Purpose**: Start the development server with hot reloading
- **Command**: `cross-env NODE_ENV=development webpack serve`
- **Usage**: Primary development command for local development
- **Features**: Hot module replacement, development optimizations

**`npm run build:dev`**
- **Purpose**: Build the application for development environment
- **Command**: `cross-env NODE_ENV=development webpack`
- **Usage**: Create development build without serving
- **Output**: Development-optimized bundle with source maps

**`npm run build:prod`**
- **Purpose**: Build the application for production deployment
- **Command**: `cross-env NODE_ENV=production webpack`
- **Usage**: Create production-ready optimized bundle
- **Features**: Minification, tree shaking, production optimizations

**`npm run analyze`**
- **Purpose**: Analyze bundle size and dependencies
- **Command**: `cross-env NODE_ENV=development webpack analyzer=true`
- **Usage**: Debug bundle size issues and optimize imports
- **Output**: Interactive bundle analyzer report

## **Testing Scripts**

**`npm test`**
- **Purpose**: Run all Jest tests
- **Command**: `jest`
- **Usage**: Execute the complete test suite
- **Features**: Runs all `.test.ts` and `.test.tsx` files

**`npm test -- --testPathPattern=filename`**
- **Purpose**: Run specific test files
- **Usage**: Test individual components or utilities
- **Example**: `npm test -- --testPathPattern=reading-time.test.ts`

## **Code Quality Scripts**

**`npm run eslint`**
- **Purpose**: Lint TypeScript and React files with auto-fix
- **Command**: `eslint src --fix --ext ts,tsx --cache --report-unused-disable-directives`
- **Usage**: Enforce code quality and style standards
- **Features**: Auto-fixes issues, caches results, reports unused disable directives

**`npm run prettier`**
- **Purpose**: Format all code files
- **Command**: `prettier --write . --ignore-path .gitignore`
- **Usage**: Ensure consistent code formatting
- **Scope**: Formats all supported file types (TS, TSX, JSON, MD, CSS, SCSS)

## **Git Hooks Scripts**

**`npm run prepare`**
- **Purpose**: Set up Husky git hooks
- **Command**: `husky`
- **Usage**: Automatically runs after `npm install`
- **Features**: Configures pre-commit hooks for code quality

## **Pre-commit Hooks (lint-staged)**

The project automatically runs these commands on staged files before commit:

**For TypeScript/JavaScript files** (`*.{ts,tsx,js,jsx}`):
- `eslint --fix` - Lint and auto-fix code issues
- `prettier --write` - Format code

**For other files** (`*.{json,md,css,scss}`):
- `prettier --write` - Format files

## **Common Development Workflows**

**Starting Development:**
```bash
npm start
```

**Running Tests:**
```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern=component-name.test.tsx

# Run tests in watch mode (if configured)
npm test -- --watch
```

**Code Quality Check:**
```bash
# Lint and fix code issues
npm run eslint

# Format all files
npm run prettier

# Both will run automatically on git commit
```

**Building for Production:**
```bash
# Create production build
npm run build:prod

# Analyze bundle size
npm run analyze
```

## **Environment Variables**

The project uses `cross-env` to ensure consistent environment variable handling across platforms:

- **`NODE_ENV=development`**: Development mode with debugging features
- **`NODE_ENV=production`**: Production mode with optimizations
- **`analyzer=true`**: Enables webpack bundle analyzer

## **Key Development Tools**

- **Webpack**: Module bundler and dev server
- **Jest**: Testing framework
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks management
- **TypeScript**: Type checking and compilation
- **React Refresh**: Hot reloading for React components

This npm script configuration ensures a robust development workflow with automated code quality checks and optimized build processes