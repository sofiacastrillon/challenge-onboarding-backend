# Getting Started

Bienvenido al template de backend serverless. Esta guía te ayudará a configurar tu entorno, ejecutar el proyecto localmente y desplegarlo en AWS.

---

## Entendiendo la Arquitectura

Antes de sumergirte en el código, es importante que entiendas los principios arquitectónicos sobre los que se construye este template. La arquitectura está diseñada para ser escalable, mantenible y robusta, siguiendo las mejores prácticas de la industria.

Te recomendamos leer los siguientes documentos para tener un contexto completo:

- **[Infraestructura con AWS CDK y CdkLess](./architecture/InfrastructureWithCdkLess.md)**: Explica cómo definimos nuestra infraestructura como código.
- **[Patrón Outbox](./architecture/OutboxPattern.md)**: Detalla cómo garantizamos la entrega fiable de notificaciones a sistemas externos.
- **[Sistema de Testing](./architecture/Testing.md)**: Describe nuestra estrategia de pruebas en diferentes niveles (unitaria, integración, aceptación).
- **[Debugging Local](./architecture/LocalDebugging.md)**: Muestra las herramientas y estrategias para depurar tu código localmente antes de desplegar.

---

## 1. Prerrequisitos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu sistema:

- **Node.js**: Se recomienda la versión 22 o superior.
- **NPM**: Generalmente se instala junto con Node.js.
- **AWS CLI**: La Interfaz de Línea de Comandos de AWS. Asegúrate de tenerla [configurada con tus credenciales de AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
- **AWS CDK CLI**: La CLI del Cloud Development Kit. Si no la tienes, instálala globalmente:
  ```bash
  npm install -g aws-cdk
  ```

---

## 2. Instalación

1.  **Clona el repositorio** en tu máquina local.
2.  **Instala las dependencias** del proyecto ejecutando el siguiente comando en la raíz del repositorio:
    ```bash
    npm install
    ```

---

## 3. Configuración

La configuración del proyecto se gestiona principalmente a través de variables de entorno.

1.  **Crea un archivo `.env`** en la raíz del proyecto. Puedes hacerlo copiando el archivo de ejemplo si existiera, o creándolo desde cero.
2.  **Añade las siguientes variables** a tu archivo `.env`. Estas variables son necesarias para que la aplicación se conecte a los recursos de infraestructura de AWS (que deben ser creados previamente en un repositorio de infraestructura separado).

    ```dotenv
    # Entorno (dev, stg, prod)
    STAGE=dev

    # DSN de Sentry para monitoreo de errores
    SENTRY_DSN=TU_SENTRY_DSN_AQUI

    # Nombres y ARNs de las tablas de DynamoDB
    EXAMPLES_TABLE_NAME=nombre-de-tu-tabla-examples
    EXAMPLES_TABLE_ARN=arn-de-tu-tabla-examples
    OUTBOX_TABLE_NAME=nombre-de-tu-tabla-outbox
    OUTBOX_TABLE_ARN=arn-de-tu-tabla-outbox

    # ARN del tópico SNS para notificaciones
    SNS_EXAMPLE_ENTITY_TOPIC_ARN=arn-de-tu-topico-sns

    # Región de AWS
    AWS_REGION_ID=us-east-1
    ```

---

## 4. Desarrollo Local

Para ejecutar y depurar las funciones Lambda en tu entorno local, utilizamos la herramienta `lambda-running`.

Ejecuta el siguiente comando para iniciar la interfaz de usuario web:

```bash
npm run dev
```

Esto abrirá una aplicación en tu navegador donde podrás seleccionar una Lambda, proporcionarle un evento (payload) y ver los logs y la respuesta en tiempo real.

Para más detalles, consulta la documentación en `docs/architecture/LocalDebugging.md`.

---

## 5. Ejecución de Pruebas

Para asegurar la calidad del código, contamos con un conjunto de pruebas unitarias, de integración y de aceptación. Para ejecutarlas, utiliza:

```bash
npm run test
```

Este comando utiliza Jest para correr todas las pruebas definidas en el directorio `tests/`.

Para más detalles, consulta la documentación en `docs/architecture/Testing.md`.

---

## 6. Despliegue en AWS

Una vez que tu funcionalidad esté completa y probada, puedes desplegarla en AWS.

1.  **Bootstrap de CDK (Solo la primera vez)**: Si es la primera vez que despliegas una aplicación con CDK en esta cuenta y región de AWS, necesitas ejecutar el comando de bootstrap:

    ```bash
    cdk bootstrap
    ```

2.  **Compilar y Desplegar**: El siguiente comando compilará el código de la capa compartida (common layer) y desplegará todas las pilas de CDK definidas en el proyecto:
    ```bash
    npm run deploy
    ```

Este comando utiliza `
