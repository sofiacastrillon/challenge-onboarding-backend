# Extend Existing Feature Prompt

## Context

This prompt is designed to help extend or modify an existing feature while maintaining the system's architectural integrity. It ensures that changes are made consistently across all layers while preserving Clean Architecture and DDD principles.

## Reusable Prompt Template

I need to extend the existing feature "[FEATURE_NAME]" with the following changes: [DESCRIBE_CHANGES]. Please follow these specifications:

### Analysis Requirements

1. Identify affected components:
   - Domain entities and value objects
   - Use cases and DTOs
   - Infrastructure adapters
   - API endpoints or event handlers
   - Tests at all levels

2. Impact assessment:
   - Breaking changes to public interfaces
   - Database schema changes
   - API contract changes
   - Event structure changes
   - Required migrations

### Implementation Guidelines

#### Domain Layer Changes

- Modify domain entities while preserving invariants
- Add/modify value objects as needed
- Update domain events if state changes are affected
- Maintain backward compatibility where possible
- Document any breaking changes

#### Application Layer Changes

- Update DTOs to reflect new data structures
- Modify use case implementations
- Add new use cases if required
- Update dependency injection bindings
- Preserve existing behavior while adding new functionality

#### Infrastructure Layer Changes

- Update repository implementations
- Modify API handlers or event processors
- Update infrastructure configurations
- Add new infrastructure components if needed
- Handle data migration needs

#### Testing Requirements

- Update affected unit tests
- Modify integration tests
- Update acceptance tests
- Add new test cases for new functionality
- Ensure backward compatibility tests

### Migration Strategy

- Database schema updates
- Data migration scripts
- API version management
- Event schema evolution
- Backward compatibility period

### Code Style and Conventions

- Follow existing patterns
- Maintain consistent naming
- Update documentation
- Follow SOLID principles
- Keep layers separated

Remember:

- Preserve existing behavior
- Maintain backward compatibility where possible
- Document breaking changes
- Update all affected tests
- Follow existing patterns and conventions
- Consider impact on dependent systems
