# New Domain Module Generation Prompt

## Context

This prompt is designed to generate a new domain module following DDD principles. The module will include all necessary domain entities, value objects, repositories, and domain services while maintaining proper encapsulation and business rules.

## Reusable Prompt Template

I need to create a new domain module called "[MODULE_NAME]". Please follow these specifications:

### Module Structure

Create the following structure in `layers/common/context/[ModuleName]`:

```
domain/
  ├── events/
  │   └── [ModuleName]EntityEvent.ts
  ├── valueObjects/
  │   └── [specific value objects].ts
  ├── exceptions/
  │   └── [specific exceptions].ts
  ├── I[ModuleName].ts
  ├── [ModuleName].ts
  └── [ModuleName]Repository.ts
```

### Requirements

#### Domain Entity

- Create an interface `I[ModuleName]` extending BaseEntity
- Implement the entity class `[ModuleName]` with all business rules
- Define strong types for all properties using value objects
- Include domain events for significant state changes
- Implement all business logic methods
- Use proper encapsulation (private/protected members)

#### Value Objects

- Create value objects for all domain properties that need validation
- Extend appropriate base classes (StringValueObject, EnumValueObject, etc.)
- Implement validation rules in constructors
- Make objects immutable
- Include meaningful error messages for validation failures

#### Repository Interface

- Define `[ModuleName]Repository` interface
- Include standard CRUD operations if needed
- Add domain-specific query methods
- Use domain types in method signatures
- Document expected behavior and constraints

#### Domain Events

- Create event classes for significant state changes
- Extend BaseEvent
- Include all relevant event data
- Document event triggers and purposes

### Code Style and Conventions

- Use TypeScript with strict type checking
- Follow DDD ubiquitous language in naming
- Document public interfaces and methods
- Use meaningful types (avoid any)
- Follow existing patterns for validation and error handling

### Testing Requirements

- Create unit tests for the entity in `tests/unit/[module]`
- Create mock implementations in `tests/mocks/[Module]`
- Test all business rules and invariants
- Test value object validations
- Test event generation

Remember:

- Keep domain logic pure and independent
- Use value objects for validation and encapsulation
- Follow ubiquitous language consistently
- Maintain proper encapsulation
- Document business rules and decisions
- No infrastructure or application concerns in domain layer
