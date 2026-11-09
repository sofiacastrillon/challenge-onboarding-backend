# Sistema de Eventos

Nuestra aplicación emplea una arquitectura orientada a eventos facilitada por un `EventBus` personalizado. Este sistema permite la comunicación desacoplada entre diferentes partes de la aplicación, mejorando la modularidad y la escalabilidad.

## EventBus

El núcleo de nuestro sistema de eventos es el `EventBus`, ubicado en `layers/common/shared/application/EventBus.ts`. Proporciona un mecanismo simple de publicación-suscripción.

### Componentes Clave

- **`IEventBus`**: La interfaz para el EventBus, que define los métodos `subscribe` y `publish`.
- **`EventBus`**: La implementación concreta de `IEventBus`.
- **`EventListener`**: Una función que registra los manejadores de eventos. Recibe una instancia de `IEventSubscriber` para suscribirse a eventos específicos.
- **`NotificationService`**: Una interfaz para enviar notificaciones a sistemas externos (ej. SNS). Su método `publish` recibe un objeto de evento, y la implementación se encarga de dirigirlo al destino correcto (ej. un tópico SNS) basándose en un mapeo interno.
- **`EventHandler`**: Una función que procesa un evento.

### Cómo Funciona

1.  **Suscripción a Eventos Internos**: Para escuchar un evento, se crea un `EventListener`. Dentro de este listener, se llama al método `on(eventName, handler)` del `IEventSubscriber` proporcionado. El `eventName` es típicamente el nombre de la clase del evento (por ejemplo, `UserCreated.name`).

2.  **Publicación de Eventos Internos**: Para despachar un evento dentro de la aplicación, se llama a `eventBus.publish(newEvent)`. El `EventBus` identifica el evento por el nombre de su clase (`event.constructor.name`) e invoca a todos los manejadores registrados para ese evento.

3.  **Publicación de Notificaciones Externas**: Para garantizar la entrega confiable de eventos a sistemas externos, **todas las notificaciones externas deben usar el patrón Outbox**. Los eventos se almacenan primero en la tabla de outbox y luego son procesados por el `outboxListener`, que es el único listener autorizado para publicar eventos a sistemas externos a través del `NotificationService`.

    **⚠️ Importante**: Solo el `outboxListener` debe usar `notificationService.publish(event)` para enviar eventos a sistemas externos (SNS, etc.). Otros listeners deben limitarse a lógica de negocio interna para evitar pérdida de eventos en caso de fallos.

El `outboxListener` maneja eventos de tipo `OutboxEntityEvent` que contienen la información necesaria para la notificación externa. La implementación del servicio (p. ej., `SnsNotificationService`) contiene un mapa que asocia los nombres de los eventos con los destinos de las notificaciones (p. ej., ARNs de temas de SNS), asegurando que el evento se envíe al lugar correcto.

### Ejemplo de Uso

#### Definiendo un Evento

```typescript
// layers/common/context/User/domain/events/UserCreated.ts
export class UserCreated {
  constructor(public readonly userId: string) {}
}
```

#### Creando un Listener

```typescript
// layers/common/context/Organization/application/listeners/OnUserCreated.ts
import { EventListener } from '@/layers/common/shared/application/EventBus';
import { UserCreated } from '@/layers/common/context/User/domain/events/UserCreated';
import { CreateOrganization } from '../CreateOrganization';

// Este listener maneja lógica de negocio interna únicamente
export const onUserCreated: EventListener = subscriber => {
  subscriber.on(UserCreated.name, async (event: UserCreated) => {
    // Lógica del manejador aquí - SOLO lógica interna
    console.log(`Usuario creado con ID: ${event.userId}`);

    // Ejemplo: crear una organización para el nuevo usuario
    // await createOrganization.run({ userId: event.userId });

    // ❌ NO hacer esto: await notificationService.publish(event);
    // ✅ Las notificaciones externas se manejan automáticamente via outbox
  });
};
```

#### Listener para Notificaciones Externas (Outbox)

```typescript
// layers/common/context/Outbox/application/listeners/OutboxListeners.ts
export const outboxListeners: EventListener = (
  subscriber,
  notificationService,
) => {
  // ✅ Solo el outboxListener puede usar notificationService
  subscriber.on<OutboxEntityEvent>(OutboxEntityEvent.name, async event => {
    console.log('📤 Publishing to external system...');

    const outbox = Outbox.fromObject(event.payload);
    await notificationService.publish(outbox.getEventToSend());

    console.log('✅ Event published successfully to external system');
  });
};
```

#### Suscribiendo Listeners

Los listeners se suscriben al `EventBus` en el punto de entrada de la aplicación, generalmente donde se configura el contenedor de inyección de dependencias. Es importante suscribir tanto los listeners de lógica interna como el `outboxListener` para notificaciones externas.

```typescript
// Ejemplo de configuración del contenedor DI
import { container } from 'tsyringe';
import { EventBus, TOKENS } from '@/layers/common/shared/application';
import { onUserCreated } from '@/layers/common/context/Organization/application/listeners/OnUserCreated';
import { outboxListeners } from '@/layers/common/context/Outbox/application/listeners/OutboxListeners';

const eventBus = container.resolve<EventBus>(TOKENS.EventBus);

// Suscribir listeners de lógica interna
eventBus.subscribe(onUserCreated);
```

### Flujo de Eventos Completo

1. **Evento de Dominio**: Se crea un evento de dominio (ej. `UserCreated`)
2. **Almacenamiento en Outbox**: El evento se almacena en la tabla outbox para garantizar persistencia
3. **Procesamiento Interno**: Los listeners internos procesan la lógica de negocio
4. **Notificación Externa**: El `outboxListener` procesa `OutboxEntityEvent` y envía notificaciones a sistemas externos via `NotificationService`
5. **Garantía de Entrega**: El patrón outbox asegura que los eventos externos se entreguen incluso en caso de fallos

Esta configuración asegura que cuando se publique un evento `UserCreated` en cualquier parte de la aplicación, se ejecute el manejador interno `onUserCreated` para lógica de negocio, y el `outboxListener` se encargue de las notificaciones externas de manera confiable.
