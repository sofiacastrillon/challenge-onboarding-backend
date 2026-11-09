# 🧾 createExample

## Objetivo

Crear un nuevo ejemplo con sus datos básicos y persistirlo en la base de datos.

## Input

- id (UUID)
- idCompany
- name (string)
- description (string)
- status (ExampleStatusValue)

## Validaciones

- El nombre debe tener menos de 20 caracteres
- La descripción debe tener menos de 255 caracteres
- El status debe ser un valor válido del enum ExampleStatusValue
- El id debe ser un UUID válido
- El idCompany debe ser un string válido

## Output

- Ejemplo persistido en DynamoDB
- Evento `ExampleEntityEvent` publicado en la tabla de Outbox

## Side Effects

- Creación de un registro en la tabla de Outbox para el evento

## Estado: DONE
