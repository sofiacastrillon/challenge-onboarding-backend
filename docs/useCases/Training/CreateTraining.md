# createTraining

## Objetivo

Registrar una solicitud de training para la compañía autenticada y persistirla en DynamoDB.

## Input

- documentType: `invoice` | `creditNote` | `bill` | `transaction` | `debitNote`
- fromDate: fecha `YYYY-MM-DD`
- toDate: fecha `YYYY-MM-DD`
- idCompany: lo inyecta el authorizer (`organization.legacyId`)
- idUser: lo inyecta el authorizer (`user.legacyId`)

## Validaciones

- documentType debe ser uno de los valores permitidos
- fromDate y toDate deben ser fechas de calendario en formato `YYYY-MM-DD`
- fromDate debe ser anterior o igual a toDate
- idCompany e idUser son obligatorios

## Output

- Registro persistido con `id`, `createdAt` y `updatedAt` generados por el caso de uso

## Side Effects

- Escritura en la tabla DynamoDB `training`, con `pk = COMPANY#<idCompany>` y `sk = TRAINING#<id>`

## Estado: DONE
