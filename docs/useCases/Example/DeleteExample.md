# 🧾 deleteExample

## Objetivo

Eliminar un ejemplo existente de la base de datos.

## Input

- id
- idCompany

## Validaciones

- El ejemplo debe existir en la base de datos
- El id debe ser un UUID válido
- El idCompany debe ser un string válido

## Output

- Ejemplo eliminado de la base de datos
- Evento `ExampleEntityEvent` publicado en la tabla de Outbox
- Error NotFound si el ejemplo no existe

## Side Effects

- Creación de un registro en la tabla de Outbox para el evento de eliminación

## Estado: DONE
