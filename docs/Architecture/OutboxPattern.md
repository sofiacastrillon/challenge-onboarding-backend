# Patrón Outbox para Notificaciones Externas

En nuestra arquitectura, utilizamos el **Patrón Outbox** para garantizar la consistencia y fiabilidad en la comunicación con sistemas externos. Este patrón resuelve el problema clásico de la "escritura dual" (dual writing), donde se necesita actualizar la propia base de datos y, al mismo tiempo, notificar a otro servicio sobre ese cambio. Hacerlo en dos pasos separados puede llevar a inconsistencias si uno de los dos falla.

El patrón Outbox asegura que el guardado del estado de la entidad y la notificación de dicho cambio se realicen de forma **atómica**.

## Flujo de Funcionamiento

El flujo se puede resumir en los siguientes pasos:

1.  **Acción del Negocio y Creación del Evento**: Cuando una entidad de negocio es creada, actualizada o eliminada (p. ej., un `Example`), en lugar de publicar un evento directamente a un bus de mensajes como SNS, se crea un registro de "evento" en una tabla `Outbox` en nuestra propia base de datos.
2.  **Transacción Atómica**: La operación sobre la entidad principal (ej. `CREATE` en la tabla `Examples`) y la inserción del registro en la tabla `Outbox` se ejecutan dentro de la misma transacción de base de datos (`TransactWriteCommand` en DynamoDB). Esto garantiza que ambas operaciones tengan éxito o fallen juntas, manteniendo el sistema consistente.
3.  **Procesamiento Asíncrono**: Un proceso separado y asíncrono monitorea la tabla `Outbox` en busca de nuevos registros.
4.  **Publicación del Evento**: Al detectar un nuevo registro, este proceso lo lee, publica el evento al sistema externo correspondiente (ej. un tópico de SNS) y, una vez publicado con éxito, marca el registro en la tabla `Outbox` como "procesado".

---

## Implementación en el Código

### 1. Escritura Transaccional en el Repositorio

La lógica clave reside en los repositorios de las entidades que necesitan emitir notificaciones. Por ejemplo, en `DynamoExampleRepository`, los métodos `create`, `update` y `delete` son responsables de la escritura atómica.

Utilizan el método `saveTransactionCrossTable` heredado de `DynamoRepository` para guardar tanto la entidad `Example` como el registro `Outbox` en una única transacción.

```typescript
// layers/common/context/Example/infrastructure/DynamoExampleRepository.ts

export class DynamoExampleRepository extends DynamoRepository implements ExampleRepository {
  private readonly outboxRepository: OutboxRepository;

  constructor() {
    super(getEnv(Env.EXAMPLES_TABLE_NAME);
    this.outboxRepository = new DynamoOutboxRepository();
  }

  async create(example: Example): Promise<Example> {
    // 1. Se transforma la entidad en un registro para la tabla Outbox
    const outboxItem = this.outboxRepository.transformEntityEventToOutboxRecord(
      example,
      OutboxEventTypeValue.NEW,
    );

    const item = this.toDynamoItems(example);

    // 2. Se preparan los items para la transacción
    const transactionItems = [
      {
        tableName: this.tableName, // Tabla 'Examples'
        item,
        operation: DynamoOperation.PUT,
        isNew: true,
      },
      {
        tableName: this.outboxRepository.getDatabaseName(), // Tabla 'Outbox'
        item: outboxItem,
        operation: DynamoOperation.PUT,
        isNew: true,
      },
    ];

    // 3. Se ejecuta la transacción atómica
    await this.saveTransactionCrossTable(transactionItems);
    return example;
  }
  // ... implementaciones similares para update y delete
}
```

### 2. Procesamiento del Evento Outbox

La tabla DynamoDB donde se guardan los registros del Outbox tiene configurado **DynamoDB Streams**. Esto significa que cada vez que se inserta un nuevo registro, se emite un evento de stream.

Una función Lambda, `publish-event`, está suscrita a este stream.

```typescript
// lambdas/outbox/publish-event.ts

// La función se envuelve en un middleware que procesa los eventos del stream de DynamoDB
export const publishEvent = DynamoStreamMiddleware<PublishOutboxEventDTO>(
  PublishOutboxEventSchema,
  async (data: PublishOutboxEventDTO) => {
    // Se resuelve el EventBus y se suscriben los listeners específicos del outbox
    const eventBus = DependencyInjection.resolve(EventBus);
    eventBus.subscribe(outboxListeners);

    // Se resuelve y ejecuta el caso de uso para publicar el evento
    const publishOutboxEventApplication =
      DependencyInjection.resolve(PublishOutboxEvent);
    await publishOutboxEventApplication.run(data);
    // ...
  },
);
```

### 3. El OutboxListener y el NotificationService

El `publishOutboxEventApplication` procesa el evento y lo publica en el `EventBus` interno de la aplicación. Es aquí donde entra en juego el `OutboxListener`.

Este listener está suscrito a los eventos que vienen del Outbox y es el **único lugar desde donde se deben enviar notificaciones a servicios externos**. Utiliza el `NotificationService` (una abstracción sobre SNS) para realizar la publicación final.

Este diseño asegura que una notificación externa solo se intenta enviar **después** de que el estado de la aplicación se haya guardado de forma consistente y atómica en la base de datos.

---

## Conclusión para Desarrolladores

**Regla de Oro**: Si necesitas notificar a un sistema externo sobre un cambio en una entidad, **NO** llames al `NotificationService` directamente desde el caso de uso principal (ej. `CreateExample`). En su lugar:

1.  Asegúrate de que el repositorio de tu entidad (ej. `DynamoExampleRepository`) crea un registro de Outbox junto con la entidad dentro de una transacción.
2.  El sistema se encargará del resto de forma asíncrona y fiable.
3.  Si es un nuevo tipo de evento, puede que necesites añadir la configuración correspondiente en el `SnsNotificationService` para mapear el evento al tópico de SNS correcto.
