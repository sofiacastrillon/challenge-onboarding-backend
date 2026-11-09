# 🧾 publishOutboxEvent

## Objetivo

Publicar un evento específico del outbox y marcarlo como procesado.

## Input

- id (identificador del registro de outbox)

## Validaciones

- El registro de outbox debe existir
- El registro debe estar en estado PENDING o FAILED
- El payload del evento debe ser válido y parseado correctamente

## Output

- Evento publicado en el servicio de notificaciones
- Registro de outbox actualizado a estado PROCESSED
- Error OutboxNotFoundException si el registro no existe

## Side Effects

- Actualización del estado del registro en la tabla de Outbox
- Publicación del evento en el servicio de notificaciones (SNS)

## Estado: DONE
