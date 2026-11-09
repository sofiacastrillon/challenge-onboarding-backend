# Infraestructura como Código (IaC) con AWS CDK

Para la definición y despliegue de nuestra infraestructura como código (IaC), utilizamos el **[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/es/cdk/)**. CDK es un framework de desarrollo de software de código abierto para definir la infraestructura de la nube en código y aprovisionarla a través de AWS CloudFormation. Nos permite usar lenguajes de programación familiares, como TypeScript, para modelar nuestros recursos de aplicación.

---

## Arquitectura de Infraestructura: Separación de Responsabilidades

Seguimos un principio clave de diseño: la **separación de la infraestructura base y la infraestructura de la aplicación**.

1.  **Repositorio de Infraestructura (Externo)**: Existe un repositorio separado y centralizado que es responsable de provisionar los recursos de infraestructura base que son compartidos o que tienen un ciclo de vida más largo. Esto incluye:
    - Bases de datos (Tablas de DynamoDB)
    - Colas de mensajes (SQS)
    - Tópicos de notificación (SNS)
    - Buckets (S3)

- Nota: Puedes ver un ejemplo en [Infra Skeleton for Backend](https://github.com/alegradev/cdk-infra-for-backend-skeleton).

2.  **Repositorio de Aplicación (Este Repositorio)**: Este proyecto se centra exclusivamente en la lógica de la aplicación. No crea los recursos base mencionados anteriormente. En su lugar, se **conecta** a ellos utilizando sus **ARNs (Amazon Resource Names)**, que se cargan desde variables de entorno.

## Abstracción con `CdkLess`

Dentro de este template, para agilizar y estandarizar el desarrollo, hacemos uso de **`CdkLess`**, una librería de alto nivel construida sobre CDK. `CdkLess` simplifica drásticamente la creación de microservicios serverless al proporcionar una API fluida y concisa, permitiéndonos enfocarnos en la lógica de negocio en lugar de en la complejidad de la configuración de la infraestructura.

Es la herramienta que nos permite definir la infraestructura que sí es responsabilidad de este repositorio, que es:

- Las funciones **Lambda**.
- Los endpoints del **API Gateway** que actúan como disparadores (triggers) para esas Lambdas.
- Los triggers de **EventBridge** para Lambdas programadas o reactivas a eventos.
- Los **permisos (IAM Policies)** que las Lambdas necesitan para acceder a los recursos de infraestructura base (definidos por ARN).

---

## Implementación con `CdkLess`

La definición de la infraestructura se inicia en `stacks/App.ts`, que instancia `CdkLess` y delega la construcción de los recursos a clases específicas.

```typescript
// stacks/App.ts
import { CdkLess } from '@alegradev/cdkless';
// ...
const app = new CdkLess({
  appName: PROJECT_NAME,
  // ...
});

// Delega la construcción de los recursos del dominio 'Example'
Example.build(app);
```

La lógica real para definir Lambdas y endpoints se encuentra en los archivos de recursos, como `stacks/resources/Example.ts`. Aquí se puede ver la simplicidad y la potencia de la API fluida de `CdkLess`:

```typescript
// stacks/resources/Example.ts
import { CdkLess } from '@alegradev/cdkless';
// ...

export class Example {
  static build(app: CdkLess) {
    // ...
    app
      // 1. Define la ruta al código de la Lambda
      .lambda(`${LAMBDAS_BASE_PATH}/example/create`)
      // 2. Asigna un nombre a la función Lambda
      .name(`${PROJECT_NAME}-create-example`)
      // 3. Crea un endpoint POST en el API Gateway
      .post(`/${CURRENT_API_VERSION}/examples`)
      // 4. Asocia un autorizador al endpoint
      .addAuthorizer(Authorizer)
      // 5. Otorga permisos a la Lambda sobre una tabla DynamoDB existente vía ARN
      .addTablePermissions(getEnv(Env.EXAMPLES_TABLE_ARN))
      // 6. Inyecta variables de entorno
      .environment({
        ...commonExampleEnv,
      });

    // ... más definiciones de Lambdas
  }
}
```

Este enfoque nos permite definir todo un CRUD de endpoints y Lambdas en un solo archivo, de manera legible y mantenible.

---

## Flexibilidad y Recomendaciones

### Combinando con CDK Nativo

Aunque `CdkLess` cubre la gran mayoría de nuestros casos de uso, no estamos encerrados en su ecosistema. Si en algún momento una funcionalidad muy específica no está disponible en la librería, **podemos usar constructos de CDK nativo** (`aws-cdk-lib`) directamente en nuestros archivos de stack y combinarlos con `CdkLess`. La instancia `app` de `CdkLess` expone los constructos subyacentes de CDK, como el `Stack` y la `Api`, permitiendo una integración transparente.

### ¿Por qué usar `CdkLess`?

Si bien sería posible escribir todo el stack utilizando CDK nativo, **se recomienda utilizar `CdkLess`** por las siguientes razones:

- **Simplicidad**: Reduce drásticamente el código repetitivo.
- **Consistencia**: Asegura que todos los microservicios sigan los mismos patrones de infraestructura.
- **Rapidez**: Permite a los desarrolladores lanzar nuevos endpoints y servicios en minutos.

Para más información, puedes consultar la [documentación oficial de cdkless](https://www.npmjs.com/package/cdkless).
