# Testing Setup

This project uses Jest and React Testing Library for testing.

## Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## Test Structure

- Unit tests are located in `src/components/__tests__/` and `src/__tests__/`
- Test files should be named `*.test.tsx`

## Test Commands

- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode

## Technologies Used

- Jest - Test runner and assertion library
- React Testing Library - For rendering and querying React components
- jsdom - For simulating a browser environment
- @testing-library/jest-dom - Custom jest matchers for the DOM

## Writing Tests

Tests should focus on user behavior rather than implementation details. Use React Testing Library's philosophy of querying elements the way a user would interact with them.

Example test patterns:

```typescript
// Query by role and text
expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();

// Query by text content
expect(screen.getByText('Welcome message')).toBeInTheDocument();

// Test user interactions
userEvent.click(screen.getByRole('button', { name: 'Submit' }));

// Test state changes
expect(screen.getByText('Success message')).toBeInTheDocument();
```