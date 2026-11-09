# Patrón de Entidades en el Proyecto

## Introducción

Este documento describe el patrón estándar para la creación y acceso a entidades de dominio en el proyecto. Utilizamos un enfoque basado en el patrón "props" con getters nativos de TypeScript para mantener la consistencia y facilitar el mantenimiento.

> **Regla principal**: Los Value Objects solo existen dentro del dominio. Los getters siempre devuelven valores primitivos.

## Estructura de Entidades

### Constructor con Props

Todas las entidades deben seguir este patrón de constructor:

```typescript
interface EntityProps {
  id: EntityId;
  organizationId: OrganizationId;
  // ... otras propiedades específicas de la entidad
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}

export class Entity extends BaseEntity {
  constructor(private readonly props: EntityProps) {
    super(props);
  }

  // ... resto de la clase
}
```

### Getters Nativos y Value Objects

Para acceder a las propiedades, utilizamos getters nativos de TypeScript que devuelven directamente el valor primitivo (string, number, boolean, etc.), no los Value Objects:

```typescript
// En BaseEntity
get id(): string {
  return this.baseProps.id.value;
}

get idCompany(): string {
  return this.baseProps.idCompany.value;
}

// En entidades específicas
get name(): string {
  return this.props.name.value;
}

get status(): StatusType {
  return this.props.status.value;
}
```

Nota: Si el metodo get va a realizar otras acciones que no sea solo devolver el valor primitivo del dominio, ahí si vale la pena considerar usar la nomenclatura `getAttribute()`

### Value Objects

Los Value Objects (VO) solo se utilizan dentro del dominio y nunca se exponen fuera de las entidades:

- ✅ **Dentro de la entidad**: Accede a los VO a través de `this.props.property`
- ✅ **Getters**: Siempre devuelven valores primitivos mediante `this.props.property.value`
- ❌ **Fuera de la entidad**: Nunca se debe acceder directamente a los VO

## Uso Correcto

### Acceso a Propiedades

Para acceder a las propiedades de una entidad, utiliza directamente los getters:

```typescript
// ✅ Correcto
const exampleId = example.id;
const idCompany = entity.idCompany;
const exampleName = example.name;

// ❌ Incorrecto
const exampleId = example.getId();
const idCompany = entity.getIdCompany();
```

### Modificación de Propiedades

Para modificar propiedades, sigue utilizando los métodos setter:

```typescript
// Modificación de propiedades
entity.setName('Nuevo nombre');
entity.setStatus(StatusValue.ACTIVE);
```

Si bien es tentador usar solo `set` esto no es una buena practica porque desde afuera lleva a pensar que solo esta mutando un objeto plano, pero pueden haber varias reglas de negocio dentro.

## Ventajas del Patrón

1. **Consistencia**: Todas las entidades siguen el mismo patrón
2. **Encapsulación**: Las propiedades internas están protegidas
3. **Tipado seguro**: TypeScript garantiza la correcta utilización
4. **Mantenibilidad**: Facilita la adición o modificación de propiedades
5. **Legibilidad**: Código más limpio y expresivo
6. **Abstracción de dominio**: Los Value Objects se mantienen dentro del dominio
7. **Simplicidad de uso**: Las capas externas trabajan con tipos primitivos

## Ejemplo Completo

```typescript
// Definición de la entidad
interface ExampleProps {
  id: BaseEntityId;
  idCompany: IdCompany;
  name: ExampleName;
  description: ExampleDescription;
  status: ExampleStatus;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}

export class Example extends BaseEntity {
  constructor(private readonly props: ExampleProps) {
    super(props);
  }

  get name() {
    return this.props.name.value;
  }

  get description() {
    return this.props.description.value;
  }

  // ... otros getters y métodos
}

// Uso de la entidad
const example = Example.fromObject(exampleData);
console.log(example.name);
console.log(example.idCompany);
```
