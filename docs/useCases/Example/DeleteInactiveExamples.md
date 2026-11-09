# 🧾 deleteInactiveExamples

## Objetivo

Eliminar todos los ejemplos que se encuentren en estado INACTIVE para una compañía específica.

## Input

- idCompany (identificador de la compañía)

## Validaciones

- El idCompany debe ser un string válido
- Debe existir al menos un ejemplo en estado INACTIVE
- Los ejemplos deben pertenecer a la compañía especificada

## Output

- Lista de ejemplos eliminados
- Eventos `ExampleEntityEvent` publicados en la tabla de Outbox por cada ejemplo eliminado
- Lista vacía si no hay ejemplos inactivos

## Side Effects

- Eliminación de múltiples registros en la tabla de Examples
- Creación de múltiples registros en la tabla de Outbox (uno por cada ejemplo eliminado)
- Publicación de eventos de eliminación para cada ejemplo

## Estado: TODO

- Requiere implementar método findByStatus en ExampleRepository
- Requiere implementar eliminación en lote en DynamoExampleRepository
- Requiere implementar el caso de uso DeleteInactiveExamples
