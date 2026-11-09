# Debugging Local

Para facilitar un ciclo de desarrollo rápido y eficiente, hemos habilitado dos estrategias principales para la depuración y prueba de funcionalidades en un entorno local, antes de realizar el despliegue en AWS.

---

## Opción 1: Desarrollo Guiado por Pruebas (TDD)

El enfoque de **Test-Driven Development (TDD)** es una metodología de desarrollo de software que consiste en escribir las pruebas antes de escribir el código de producción. Este enfoque es altamente recomendado para asegurar la calidad y el correcto funcionamiento de los casos de uso.

### Flujo de Trabajo

1.  **Escribir la Prueba Primero**: Crea un nuevo archivo de prueba (unitario, de integración o de aceptación) que defina el comportamiento esperado de la nueva funcionalidad. Al principio, esta prueba fallará porque el código aún no existe.
2.  **Escribir el Código de Producción**: Implementa el código mínimo necesario para que la prueba que escribiste pase.
3.  **Refactorizar**: Una vez que la prueba pase, puedes mejorar y limpiar el código con la confianza de que no has roto la funcionalidad.

Para ejecutar las pruebas, simplemente utiliza el siguiente comando en la raíz del proyecto:

```bash
npm run test
```

Este comando utiliza **Jest** para ejecutar todos los archivos de prueba del proyecto. Para más detalles sobre nuestra estrategia de testing, consulta la documentación en `docs/architecture/Testing.md`.

---

## Opción 2: Depuración Interactiva con `lambda-running`

Para una depuración más visual e interactiva, especialmente útil cuando se trabaja con funciones Lambda, utilizamos la librería `lambda-running`. Esta herramienta nos permite ejecutar y probar Lambdas localmente a través de una interfaz web, simulando el entorno de AWS.

### Cómo Funciona

`lambda-running` levanta un servidor local que escanea tu proyecto en busca de funciones handler de Lambda y te proporciona una UI para invocarlas con diferentes _payloads_ (eventos), ver los logs en tiempo real y analizar las respuestas.

### Configuración del Proyecto

La configuración de `lambda-running` se encuentra en el archivo `lambda-running.json` en la raíz del proyecto. El aspecto más importante de esta configuración es el `layerMappings`, que simula las [Capas de Lambda (Lambda Layers)](https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html) en nuestro entorno local.

```json
// lambda-running.json
{
  "layerMappings": {
    "/opt/nodejs": "layers/common"
  },
  "envFiles": [".env"],
  "ignoreLayerFilesOnScan": true,
  "debug": false
}
```

Esta configuración le dice a `lambda-running` que cualquier import que en el código de la Lambda apunte a `/opt/nodejs` (la ruta estándar de las capas en el runtime de AWS) debe ser resuelto localmente a la ruta `layers/common`.

### Uso

Para iniciar la sesión de depuración local, ejecuta el siguiente comando:

```bash
npm run dev
```

Este comando abrirá automáticamente una interfaz web en tu navegador. Desde allí podrás:

1.  **Seleccionar la Lambda**: En el panel izquierdo, verás una lista de todas las funciones handler detectadas en tu proyecto.
2.  **Definir el Evento**: En el panel central, puedes construir el objeto `event` en formato JSON que se pasará a tu Lambda. Puedes usar plantillas de eventos comunes de AWS (ej. API Gateway, S3, SQS) o crear uno personalizado.
3.  **Ejecutar y Observar**: Al ejecutar la Lambda, verás los `console.log` en el panel de logs en tiempo real y la respuesta (o el error) de la función.

Esta herramienta es muy útil para iterar rápidamente en el desarrollo de las Lambdas sin necesidad de desplegar cada cambio. Puedes encontrar más información en la [documentación oficial de lambda-running](https://www.npmjs.com/package/lambda-running).
