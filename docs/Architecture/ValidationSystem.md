# Sistema de Validación y Manejo de Errores HTTP 400

## Resumen

El sistema de validación implementado en este proyecto proporciona un manejo robusto y estructurado de errores de validación HTTP 400 utilizando **Zod** como librería de validación de esquemas, junto con middlewares personalizados que automatizan la validación de datos de entrada en APIs públicas y privadas.

## Arquitectura del Sistema

### Componentes Principales

1. **Schemas de Validación (DTOs)**
2. **Middlewares de Validación**
3. **Sistema de Excepciones**
4. **Mapeo de Errores**
5. **Formateo de Respuestas**

## Flujo de Validación

```
Petición HTTP → Middleware → Validación Zod → Excepción (si error) → Mapeo → Respuesta HTTP 400
```

## Implementación Detallada

### 1. Schemas de Validación con Zod

Los DTOs definen las reglas de validación usando Zod, permitiendo mensajes de error personalizados:

```typescript
// CreateExampleDTO.ts
export const CreateExampleSchema = z.object({
  id: z
    .string({ message: ExampleErrorMessages.ID_IS_REQUIRED })
    .uuid({ message: ExampleErrorMessages.INVALID_ID }),
  name: z.string({ message: ExampleErrorMessages.NAME_IS_REQUIRED }).min(5, {
    message: ExampleErrorMessages.NAME_CHARACTERS_LENGTH,
  }),
  // ... más campos
});
```

**Características:**

- Mensajes de error personalizados con códigos identificadores
- Validaciones específicas por campo (UUID, longitud, enum, etc.)
- Tipos TypeScript inferidos automáticamente

### 2. Middlewares de Validación

#### ApiMiddleware (APIs con Authorizer)

```typescript
export const ApiMiddleware = <T = null>(
  schema: ZodSchema | null,
  handler: (
    data: T,
    request: PrivateRequest,
  ) => Promise<ReturnType<typeof Response.format>>,
) => {
  // Combina datos de body, path params, query params + contexto autorización
  const dataToValidate = {
    ...inputData,
    idCompany: request.getTokenInfo().idc,
    idUser: request.getTokenInfo().idu,
    applicationVersion: request.getTokenInfo().applicationVersion,
  };

  // Validación con Zod
  const validationResult = schema.safeParse(dataToValidate);

  if (!validationResult.success) {
    const errors =
      ValidationMapper.getErrorsFromValidationResult(validationResult);
    throw new ValidationException(errors);
  }
};
```

#### PublicApiMiddleware (APIs Públicas sin Authorizer)

```typescript
export const PublicApiMiddleware = <T = null>(
  schema: ZodSchema | null,
  handler: (
    data: T,
    request: PublicRequest,
  ) => Promise<ReturnType<typeof Response.format>>,
) => {
  // Combina solo datos de body, path params y query params
  const dataToValidate = {
    ...bodyParams,
    ...pathParams,
    ...queryParams,
  };

  // Misma lógica de validación
};
```

**Diferencias Clave:**

- **ApiMiddleware**: Incluye contexto de autorización automáticamente
- **PublicApiMiddleware**: Solo maneja datos de la petición HTTP, son request donde no se necesitan autenticación por parte del usuario. (No son de uso común, siempre validar con el lider).
- Ambos interceptan automáticamente todas las excepciones

### 3. Sistema de Excepciones

#### ValidationException

```typescript
export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export class ValidationException extends Error {
  readonly errors: ValidationError[];
  readonly statusCode: number = 400;

  constructor(errors: ValidationError[]) {
    super('Validation errors occurred');
    this.errors = errors;
  }
}
```

**Características:**

- Contiene múltiples errores de validación
- Estructura estandarizada con código, mensaje y campo
- Status code 400 automático

### 4. Mapeo de Errores

#### ValidationMapper

```typescript
export class ValidationMapper {
  static getErrorCodeFromMessage(
    message: string,
    zodIssueCode: ZodIssueCode,
  ): string {
    // Extrae códigos personalizados del formato [CÓDIGO] mensaje
    const customCodeMatch = message.match(/^\[([^\]]+)\]/);
    if (customCodeMatch) {
      return customCodeMatch[1];
    }

    // Fallback a códigos Zod estándar
    return ERROR_CODES[zodIssueCode] || 'INVALID_TYPE';
  }

  static getErrorsFromValidationResult(
    validationResult: SafeParseReturnType<any, any>,
  ): ValidationError[] {
    return validationResult.error.issues.map(issue => {
      const fieldPath = issue.path.join('.');
      const errorCode = ValidationMapper.getErrorCodeFromMessage(
        issue.message,
        issue.code,
      );

      return {
        code: errorCode,
        message: issue.message,
        field: fieldPath,
      };
    });
  }
}
```

**Funcionalidades:**

- Extrae códigos de error personalizados del formato `[CÓDIGO] mensaje`
- Mapea errores de Zod a estructura ValidationError
- Genera paths de campo anidados automáticamente

### 5. Sistema de Mensajes de Error

#### ExampleErrorMessages

```typescript
export const ExampleErrorCodes = {
  INVALID_ID: 'EXAMPLE001',
  ID_IS_REQUIRED: 'EXAMPLE002',
  // ... más códigos
};

export const ExampleErrorMessages = {
  INVALID_ID: `[${ExampleErrorCodes.INVALID_ID}] Example ID is invalid`,
  ID_IS_REQUIRED: `[${ExampleErrorCodes.ID_IS_REQUIRED}] Example ID is required`,
  // ... más mensajes
};
```

**Estructura:**

- Códigos únicos por dominio (EXAMPLE001, EXAMPLE002, etc.)
- Mensajes descriptivos con formato `[CÓDIGO] descripción`
- Centralización de todos los mensajes de error
- Debe existir uno por cada entidad de dominio que tengamos en el proyecto.

### 6. Formateo de Respuestas

#### Response.handleException

```typescript
export class Response {
  static handleException(e: any) {
    const statusCode = e.statusCode || 500;

    if (e instanceof ValidationException) {
      return Response.format(statusCode, { errors: e.errors });
    }

    const error = {
      code: e.code || statusCode,
      message: e.message || 'Internal server error',
    };

    return Response.format(statusCode, { error });
  }
}
```

## Formato de Respuesta HTTP 400

### Respuesta de Validación

```json
{
  "errors": [
    {
      "code": "EXAMPLE001",
      "message": "[EXAMPLE001] Example ID is invalid",
      "field": "id"
    },
    {
      "code": "EXAMPLE005",
      "message": "[EXAMPLE005] Name is required",
      "field": "name"
    }
  ]
}
```

### Propiedades de la Respuesta

- **code**: Código único del error (ej: EXAMPLE001) Debe registrarse en https://docs.google.com/spreadsheets/d/1n9WDLbU7zRXjVbt-buN-24owe2bLDkw5dExju8f2odg/edit?gid=518093268#gid=518093268
- **message**: Mensaje descriptivo completo
- **field**: Ruta del campo que causó el error (ej: "user.address.street")

## Ventajas del Sistema

### 1. **Consistencia**

- Formato estandarizado para todos los errores 400
- Estructura predecible para el frontend

### 2. **Mantenibilidad**

- Códigos únicos facilitatan el debugging
- Mensajes centralizados por dominio
- Fácil adición de nuevas validaciones

### 3. **Experiencia del Desarrollador**

- Tipos TypeScript automáticos
- Validación declarativa con Zod
- Manejo automático de excepciones

### 4. **Flexibilidad**

- Soporte para APIs públicas y privadas
- Validaciones personalizadas por esquema
- Integración automática con contexto de autorización

## Uso del Sistema

### Implementar Nueva Validación

1. **Definir mensajes de error:**

```typescript
export const UserErrorMessages = {
  INVALID_EMAIL: '[USER001] Invalid email format',
  AGE_TOO_LOW: '[USER002] Age must be at least 18',
};
```

2. **Crear schema Zod:**

```typescript
export const CreateUserSchema = z.object({
  email: z.string().email({ message: UserErrorMessages.INVALID_EMAIL }),
  age: z.number().min(18, { message: UserErrorMessages.AGE_TOO_LOW }),
});
```

3. **Aplicar middleware:**

```typescript
export const createUser = ApiMiddleware(
  CreateUserSchema,
  async (data: CreateUserDTO, request: PrivateRequest) => {
    // Lógica del handler
  },
);
```

## Consideraciones Técnicas

### Monitoreo

- Errores 400 no se reportan a Sentry (configurado en Response.ts)
- Logging automático para debugging

### Performance

- Validación temprana en el middleware
- Estructuras de datos optimizadas
- Reutilización de schemas

### Seguridad

- Validación server-side obligatoria
- Sanitización automática de datos
- Prevención de inyección de datos maliciosos

## Extensiones Futuras

### Validación Condicional

```typescript
const schema = z
  .object({
    type: z.enum(['individual', 'company']),
    taxId: z.string().optional(),
  })
  .refine(
    data => {
      if (data.type === 'company') {
        return data.taxId !== undefined;
      }
      return true;
    },
    { message: 'Tax ID required for companies', path: ['taxId'] },
  );
```

### Validación Asíncrona

```typescript
const schema = z
  .object({
    email: z.string().email(),
  })
  .refine(
    async data => {
      const exists = await checkEmailExists(data.email);
      return !exists;
    },
    { message: 'Email already exists', path: ['email'] },
  );
```
