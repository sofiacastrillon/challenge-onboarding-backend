# Sistema de Testing

Nuestra estrategia de testing se basa en la clásica pirámide de testing, distribuyendo los esfuerzos en tres niveles principales: Pruebas Unitarias, Pruebas de Integración y Pruebas de Aceptación. Utilizamos Jest como nuestro framework de testing.

## Estructura del Directorio de Pruebas

Todos los tests se encuentran en el directorio `tests/`, organizado de la siguiente manera:

- `tests/unit`: Pruebas para componentes individuales.
- `tests/integration`: Pruebas para la interacción entre componentes.
- `tests/acceptance`: Pruebas que simulan flujos de usuario.
- `tests/mocks`: Contiene datos y clases mock para simular dependencias.
- `tests/utils`: Utilidades y helpers para los tests.

---

## 1. Pruebas Unitarias

- **Objetivo**: Verificar que las unidades de código más pequeñas (clases, métodos) funcionan como se espera de forma aislada. Nos centramos principalmente en los casos de uso de la aplicación.
- **Ubicación**: `tests/unit`

Estas pruebas se caracterizan por:

- **Aislamiento**: Las dependencias externas, como repositorios o servicios, se mockean para aislar el componente bajo prueba.
- **Inyección de Dependencias**: Utilizamos `tsyringe` para la inyección de dependencias. En los tests, el contenedor de `DependencyInjection` resuelve las clases con sus dependencias (reales o mocks).
- **Rapidez**: Son las pruebas más rápidas de ejecutar.

### Ejemplo de Prueba Unitaria:

```typescript
// tests/unit/example/CreateExample.unit.test.ts
import { describe, expect, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { CreateExample } from '../../../layers/common/context/Example/application/CreateExample';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';

describe('Create Example', () => {
  test('Create Example', async () => {
    // Se resuelve el caso de uso a través del contenedor de DI
    const createExampleApplication = DependencyInjection.resolve(CreateExample);
    // Se ejecuta el caso de uso con datos mock
    const example = await createExampleApplication.run(MockExample.toObject());
    // ... aserciones
  });
});
```

---

## 2. Pruebas de Integración

- **Objetivo**: Asegurar que diferentes partes de la aplicación funcionan juntas correctamente. El foco principal está en la capa de persistencia (repositorios) y su interacción con la base de datos.
- **Ubicación**: `tests/integration`

Estas pruebas:

- **Interactúan con servicios externos**: Prueban la conexión y las operaciones (CRUD) con servicios como DynamoDB. Se recomienda ejecutar estas pruebas contra una instancia de base de datos local o un entorno de staging.
- **No mockean la capa de persistencia**: Se instancia directamente el repositorio (ej. `DynamoExampleRepository`) para probar su comportamiento real.

### Ejemplo de Prueba de Integración:

```typescript
// tests/integration/example/DynamoExample.integration.test.ts
import { describe, test } from '@jest/globals';
import { DynamoExampleRepository } from '../../../layers/common/context/Example/infrastructure/DynamoExampleRepository';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';

describe('Dynamo Example Integration', () => {
  // Se instancia el repositorio directamente
  const exampleRepository = new DynamoExampleRepository();

  test('should create a new example', async () => {
    // Se llama al método del repositorio para crear una entidad
    const example = await exampleRepository.create(MockExample);
    // ... aserciones
  });
});
```

---

## 3. Pruebas de Aceptación

- **Objetivo**: Validar flujos completos de la aplicación desde la perspectiva del usuario o de un sistema externo. Simulan una petición que llega a la Lambda y verifican la respuesta final.
- **Ubicación**: `tests/acceptance`

Características:

- **Punto de Entrada**: Las pruebas importan y ejecutan directamente las funciones handler de las Lambdas (ej. `createExample`).
- **Simulación de Eventos**: Se utilizan mocks para simular los eventos de entrada de AWS, como un evento de API Gateway (`ApiGwMockEvent`). Estos mocks se encuentran en `tests/mocks/shared/infrastructure`.
- **Verificación E2E**: Se comprueba todo el flujo: la petición entra, se procesa por el caso de uso, interactúa con el repositorio y devuelve una respuesta HTTP.

### Ejemplo de Prueba de Aceptación:

```typescript
// tests/acceptance/example/example.acceptance.test.ts
import { createExample } from '../../../lambdas/example/create';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';
import { ApiGwMockEvent } from '../../mocks/shared/infrastructure/ApiGwMockEvent';
import { describe, it, expect } from '@jest/globals';

describe('Example acceptance tests', () => {
  it('Given a Qr Data, when we create a qr, then we receive a successful response', async () => {
    // Se invoca el handler de la Lambda con un evento mock de API Gateway
    const result = await createExample(
      ApiGwMockEvent({
        bodyParams: MockExample.toObject(),
      }),
    );
    // Se verifica el código de estado y el cuerpo de la respuesta
    expect(result).toHaveProperty('statusCode', 200);
  });
});
```

---

## Mocks y Utilidades

- **`tests/mocks`**: Es fundamental para nuestra estrategia. Contiene datos falsos (`MockExample`) y simulaciones de clases (`MockExampleRepository`, `MockNotificationService`) para desacoplar componentes en las pruebas. También incluye mocks de eventos de servicios de AWS (`ApiGwMockEvent`, `DynamoStreamMockEvent`, etc.).
- **`tests/utils/helpers.ts`**: Proporciona funciones de ayuda reutilizables en los tests, como `assertPropertiesMatch`, para simplificar las aserciones.
- **`tests/setup.ts`**: Archivo de configuración global para Jest, donde se pueden inicializar mocks globales o configurar el entorno de pruebas.
