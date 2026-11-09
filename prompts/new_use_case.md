# New Use Case Generation Prompt

## Context

This prompt is designed to generate a new use case following Clean Architecture and DDD principles. The use case will be integrated into the existing backend system, maintaining strict separation of concerns between domain, application, and infrastructure layers.

## Reusable Prompt Template

I need to create a new use case for the backend system called "[USE_CASE_NAME]". Please follow these specifications:

### Domain Layer Requirements

- Define any new domain entities needed in `layers/common/context/[Module]/domain`
- Create or reuse value objects for domain validations
- Define domain events if the use case triggers any state changes
- Ensure domain logic remains pure and infrastructure-agnostic

### Application Layer Requirements

- Create a DTO class in `layers/common/[Module]/application/DTO` following naming convention `[UseCaseName]DTO`
- You must run the use case with the public `.run()` method
- Implement the use case class in `layers/common/[Module]/application` following naming convention `[UseCaseName]`
- Use dependency injection for required repositories and services
- Implement proper error handling using domain exceptions
- Return DTOs, never domain objects

### Infrastructure Layer Requirements

- Create a Lambda handler in `lambdas/[module]/[use-case-name].ts`
- Implement necessary infrastructure adapters in `layers/common/[Module]/infrastructure`
- Use the appropriate middleware (ApiMiddleware, EventBridgeMiddleware, etc.).
- Configure any required AWS resources in the corresponding stack

### Testing Requirements

- Create unit tests in `tests/unit/[module]/[UseCaseName].unit.test.ts`
- Create integration tests in `tests/integration/[module]` if needed
- Create acceptance tests in `tests/acceptance/[module]` if needed
- Use the existing mock utilities from `tests/mocks`

### Specific Instructions

1. The use case should handle [SPECIFIC_REQUIREMENT]
2. It should be triggered by [TRIGGER_TYPE] (REST API, Event, etc.)
3. Expected input data structure: [INPUT_STRUCTURE]
4. Expected output/response: [OUTPUT_STRUCTURE]
5. Required validations: [VALIDATIONS]
6. Error scenarios to handle: [ERROR_SCENARIOS]

### Code Style and Conventions

- Use TypeScript with strict type checking
- Follow SOLID principles strictly
- Use dependency injection via the existing DI container
- Follow existing naming conventions (PascalCase for classes, camelCase for methods)
- Document public methods and interfaces
- Handle errors using domain exceptions

Remember:

- No infrastructure concerns in domain layer
- No direct external dependencies in domain or application layers
- Use interfaces for all dependencies
- Follow existing patterns for error handling and validation
- Most importantly, you should be guided by the use cases that are already implemented and follow the same nomenclature, conventions, and library reuse.
