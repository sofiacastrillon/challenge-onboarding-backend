# Test Generation Prompt

## Context

This prompt is designed to generate comprehensive tests for the system following the existing testing patterns. It covers unit tests, integration tests, and acceptance tests, ensuring proper coverage and maintainability.

## Reusable Prompt Template

I need to create tests for "[COMPONENT_NAME]". Please follow these specifications:

### Test Types and Locations

#### Unit Tests

Location: `tests/unit/[module]/[ComponentName].unit.test.ts`

- Test individual components in isolation
- Mock all dependencies
- Focus on business logic
- Cover edge cases and error scenarios

#### Integration Tests

Location: `tests/integration/[module]/[ComponentName].integration.test.ts`

- Test component interactions
- Use real AWS services or test containers
- Focus on infrastructure integration
- Test error handling and retries

#### Acceptance Tests

Location: `tests/acceptance/[module]/[ComponentName].acceptance.test.ts`

- Test complete features
- Use real AWS services
- Focus on business requirements
- Test end-to-end flows

### Test Structure Requirements

#### Test Setup

- Use the existing test setup from `tests/setup.ts`
- Create necessary test fixtures
- Set up test databases or containers
- Configure test environment variables
- Use appropriate test helpers

#### Mock Requirements

- Create mock implementations in `tests/mocks/context/[Module]`
- Extend existing mock base classes
- Implement required interface methods
- Add mock configuration options
- Document mock behavior

### Testing Patterns

#### Unit Tests

```typescript
describe('[ComponentName]', () => {
  let dependencies: {
    repository: Mock[Repository];
    service: Mock[Service];
  };

  beforeEach(() => {
    // Setup dependencies
  });

  describe('[MethodName]', () => {
    test('should [expected behavior]', async () => {
      // Arrange
      // Act
      // Assert
    });

    test('should handle [error scenario]', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

#### Integration Tests

```typescript
describe('[ComponentName] Integration', () => {
  let dependencies: {
    database: DynamoDB;
    queue: SQS;
  };

  beforeAll(async () => {
    // Setup infrastructure
  });

  afterAll(async () => {
    // Cleanup
  });

  test('should [expected integration behavior]', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Test Coverage Requirements

- Test happy path scenarios
- Test error scenarios
- Test edge cases
- Test validation rules
- Test business rules
- Test infrastructure integration

### Code Style and Conventions

- Use descriptive test names
- Follow AAA pattern (Arrange-Act-Assert)
- One assertion per test when possible
- Use proper test isolation
- Clean up test data
- Document complex test scenarios

Remember:

- Keep tests focused and isolated
- Use appropriate mocking strategies
- Clean up test resources
- Follow existing patterns
- Document test requirements
- Consider test maintainability
