# 🧾 updateExample

## Objetivo

Actualizar los datos de un ejemplo existente.

## Input

- id
- idCompany
- name (string)
- description (string)
- status (ExampleStatusValue)

## Validaciones

- El ejemplo debe existir en la base de datos
- El nombre debe tener menos de 20 caracteres
- La descripción debe tener menos de 255 caracteres
- El status debe ser un valor válido del enum ExampleStatusValue
- El id debe ser un UUID válido
- El idCompany debe ser un string válido

## Output

- Ejemplo actualizado y persistido
- Evento `ExampleEntityEvent` publicado en la tabla de Outbox
- Error NotFound si el ejemplo no existe

## Side Effects

- Creación de un registro en la tabla de Outbox para el evento de actualización

## Estado: DONE
