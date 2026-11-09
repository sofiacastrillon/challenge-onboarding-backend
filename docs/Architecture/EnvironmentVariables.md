# Variables de Entorno

Nuestra aplicación gestiona las variables de entorno de una manera estandarizada y con seguridad de tipos para garantizar la coherencia y prevenir errores en tiempo de ejecución.

## Componentes Principales

- **`getEnv(key, defaultValue)`**: Una función de utilidad para acceder a las variables de entorno. Se encuentra en `layers/common/shared/utils/Utils.ts`.
- **`Env`**: Un objeto completo que centraliza todas las claves de las variables de entorno utilizadas en la aplicación. Se encuentra en `layers/common/shared/domain/interfaces/IEnvironment.ts`.

## Cómo Funciona

El objeto `Env` actúa como un enum, conteniendo una lista predefinida de todas las claves de variables de entorno válidas. Este enfoque ofrece varias ventajas:

- **Seguridad de Tipos**: Evita errores de tipeo y el uso de nombres de variables inexistentes.
- **Autocompletado**: Los IDEs pueden proporcionar sugerencias para las variables disponibles.
- **Centralización**: Todas las definiciones de variables están en un solo lugar, lo que facilita su gestión.

La función `getEnv` debe utilizarse siempre que se necesite acceder a una variable de entorno.

- Toma una clave del objeto `Env` (por ejemplo, `Env.DATABASE_URL`).
- Si la variable no está configurada en el entorno (`process.env`) y no se proporciona un `defaultValue`, lanzará un error, impidiendo que la aplicación se ejecute con una configuración faltante.

## Ejemplo de Uso

Para acceder a la URL de la base de datos, usarías:

```typescript
import { getEnv } from '@/layers/common/shared/utils/Utils';
import { Env } from '@/layers/common/shared/domain/interfaces/IEnvironment';

// En tu servicio o archivo de configuración
const databaseUrl = getEnv(Env.DATABASE_URL);

// Con un valor por defecto
const logLevel = getEnv(Env.LOG_LEVEL, 'info');
```

## Añadir Nuevas Variables de Entorno

Para añadir una nueva variable de entorno:

1.  **Añade la clave** al objeto `Env` en `layers/common/shared/domain/interfaces/IEnvironment.ts`.
2.  **Actualiza tus archivos `.env`** con la nueva variable.
3.  **Usa `getEnv(Env.YOUR_NEW_VARIABLE)`** para acceder a ella en tu código.

Esta práctica asegura que todas las variables de entorno sean declaradas y gestionadas explícitamente, contribuyendo a la robustez general de la aplicación.
