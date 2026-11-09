# CDK Microservice Skeleton

A production-ready template for building serverless microservices using AWS CDK, following Domain-Driven Design (DDD) principles and clean architecture patterns.

## 🎯 Overview

This skeleton provides a standardized foundation for building scalable, maintainable microservices in a SaaS environment. It implements:

- Clean Architecture with DDD principles
- SOLID design patterns
- Event-driven architecture
- Infrastructure as Code using AWS CDK
- Comprehensive testing strategy
- Built-in observability and monitoring
- Standardized error handling
- Type-safe development with TypeScript
- AI-driven development workflow

## 🤖 AI-First Development Approach

This skeleton is designed to maximize development efficiency through structured AI collaboration. The approach consists of three main components:

### 1. Use Case Documentation

All features must be documented before implementation:

```
docs/useCases/{Module}/{UseCase}.md
```

Example structure:

```markdown
# 🧾 useCase

## Objetivo

Brief description of the use case purpose

## Input

- param1 (type)
- param2 (type)

## Validaciones

- Validation rule 1
- Validation rule 2

## Output

- Expected output format
- Side effects

## Side Effects

- Database changes
- Event publications
- External service calls

## Estado: TODO|IN_PROGRESS|DONE
```

### 2. Structured Prompts

The `/prompts` directory contains high-quality, detailed templates for common development tasks:

```
prompts/
├── new_domain_module.md     # Creating domain entities
├── new_use_case.md         # Implementing use cases
├── new_infra_adapter.md    # Adding infrastructure adapters
├── extend_existing_feature.md  # Extending functionality
└── write_test.md           # Writing tests
```

Each prompt is designed to provide comprehensive guidance to AI assistants, ensuring consistent implementation patterns.

### 3. IDE Configuration

The skeleton comes pre-configured for AI-assisted development:

#### Cursor IDE (Pre-configured)

- The skeleton includes built-in rules that automatically instruct the AI to:
  1. Check `/prompts` directory for applicable templates
  2. Follow the template guidelines when implementing code
  3. Maintain project patterns and standards

#### Other IDEs

If using a different IDE with AI capabilities, configure it to:

1. Set the `/prompts` directory as the primary source of development templates
2. Instruct the AI to check for applicable prompts before code generation
3. Follow the structured workflow:
   - Review use case documentation
   - Apply relevant prompts
   - Generate implementation
   - Follow project patterns

## 🚀 Getting Started

### Prerequisites

- Node.js (v22 or later)
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed (`npm install -g aws-cdk`)
- TypeScript knowledge
- Basic understanding of DDD and SOLID principles

### Installation

1. Clone this template:

```bash
git clone <repository-url> my-microservice
cd my-microservice
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

### Development Workflow

1. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Set required environment variables

2. Run tests:

```bash
npm run test        # Run all tests
```

3. Local development:

```bash
npm run dev     # Test lambdas in local
npm run lint    # Check code style
```

### Deployment

1. Bootstrap CDK (first time only):

```bash
cdk bootstrap
```

2. Deploy to AWS:

```bash
cdk deploy
```

## 🏗️ Architecture

### Clean Architecture Implementation

The project follows a strict layered architecture:

1. **Domain Layer** (`layers/common/*/domain/`)
   - Contains business logic and rules
   - Defines interfaces and contracts
   - Pure TypeScript with no external dependencies
   - Houses value objects and entities

2. **Application Layer** (`layers/common/*/application/`)
   - Implements use cases
   - Orchestrates domain objects
   - Handles DTOs and transformations
   - Contains no business rules

3. **Infrastructure Layer** (`layers/common/*/infrastructure/`)
   - Implements interfaces defined in domain
   - Handles external concerns (DB, API, etc.)
   - Contains AWS-specific code
   - Manages technical details

### SOLID Principles Application

1. **Single Responsibility Principle**
   - Each class has one reason to change
   - Clear separation between layers
   - Focused value objects and entities

2. **Open/Closed Principle**
   - Use of interfaces for extensibility
   - Plugin architecture for repositories
   - Event-driven design for flexibility

3. **Liskov Substitution Principle**
   - Abstract base classes for entities
   - Consistent repository interfaces
   - Polymorphic event handling

4. **Interface Segregation Principle**
   - Focused interfaces (see `IExample.ts`)
   - Specific repository contracts
   - Granular use case definitions

5. **Dependency Inversion Principle**
   - Dependency injection using tsyringe
   - Repository pattern implementation
   - Infrastructure depending on abstractions

## 🧩 Adding New Features

### Creating a New Module

1. Create the directory structure:

```
layers/common/NewModule/
├── domain/
│   ├── NewEntity.ts
│   ├── INewEntity.ts
│   ├── NewEntityRepository.ts
│   └── valueObjects/
├── application/
│   ├── CreateNewEntity.ts
│   └── DTO/
└── infrastructure/
    └── DynamoNewEntityRepository.ts
```

2. Define the domain model:
   - Create value objects for primitives
   - Implement entity business rules
   - Define repository interface

3. Implement use cases:
   - Create DTOs for input/output
   - Implement business operations
   - Handle validation and errors

4. Add infrastructure:
   - Implement repository
   - Register in dependency injection

### Writing Tests

1. **Unit Tests** (`tests/unit/`)
   - Test domain logic in isolation
   - Mock dependencies
   - Focus on business rules

2. **Integration Tests** (`tests/integration/`)
   - Test repository implementations
   - Verify AWS service integration
   - Use local AWS emulators

3. **Acceptance Tests** (`tests/acceptance/`)
   - End-to-end scenarios
   - API contract validation
   - Business requirement verification

## 🤖 AI-Ready Architecture

### Code Generation Guidelines

1. **Naming Conventions**
   - Use descriptive, consistent names
   - Follow TypeScript naming standards
   - Maintain clear file structure

2. **Documentation**
   - JSDoc for public interfaces
   - Clear type definitions
   - Example usage in comments

3. **Code Structure**
   - Consistent file organization
   - Clear module boundaries
   - Explicit dependencies

### AI Integration Points

1. **Code Generation**
   - Follow templates in `Example` module
   - Use existing value objects
   - Maintain layer separation

2. **Architecture Validation**
   - Check layer dependencies
   - Verify SOLID compliance
   - Validate DDD patterns

3. **Test Generation**
   - Follow existing test patterns
   - Use mock factories
   - Maintain test isolation

## 📝 Development Guidelines

### Do's

- Create new value objects for primitive types
- Use dependency injection for services
- Write tests for all use cases
- Follow existing naming patterns
- Document public interfaces

### Don'ts

- Skip layer separation
- Mix business logic with infrastructure
- Bypass dependency injection
- Modify base entity behavior
- Add external dependencies to domain layer

## 🔧 Available Scripts

- `npm run dev` - Run lambdas on local
- `npm run build` - Compile TypeScript
- `npm run test` - Run all tests
- `npm run lint` - Check code style
- `cdk deploy` - Deploy to AWS
- `cdk diff` - Check deployment changes
- `cdk synth` - Generate CloudFormation

## 🤝 Contributing

1. Follow the existing architecture
2. Add tests for new features
3. Update documentation
4. Create descriptive PRs
5. Follow code style guidelines

## 📚 Further Reading

- [Domain-Driven Design](https://domainlanguage.com/ddd/)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
