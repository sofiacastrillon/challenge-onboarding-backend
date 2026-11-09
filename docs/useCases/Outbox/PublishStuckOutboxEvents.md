# 🧾 publishStuckOutboxEvents

## Objetivo

Publicar eventos que se han quedado atascados en el outbox por más de 5 minutos.

## Input

- No requiere input directo (se ejecuta automáticamente por un cron)

## Validaciones

- Los eventos deben tener más de 5 minutos de antigüedad
- Los eventos deben estar en estado PENDING o FAILED
- El payload de cada evento debe ser válido y parseado correctamente

## Output

- Eventos atascados publicados en el servicio de notificaciones
- Registros de outbox actualizados a estado PROCESSED
- Lista vacía si no hay eventos atascados

## Side Effects

- Actualización masiva de estados en la tabla de Outbox
- Publicación de múltiples eventos en el servicio de notificaciones (SNS)
- Posible incremento en el contador de reintentos para eventos fallidos

## Estado: DONE
