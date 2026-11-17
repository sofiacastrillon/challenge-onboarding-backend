# runTrainingAgent

## Goal

Classify a simulated WhatsApp message and reply with a short LangGraph agent, then store the conversation.

## Input

- message: non-empty text from the client
- idCompany: injected by the authorizer (`organization.legacyId`)
- idUser: injected by the authorizer (`user.legacyId`)

## Validations

- message is required and cannot be blank
- idCompany and idUser are required
- the agent must return an intent of `ventas`, `soporte` or `cancelacion` and a non-empty reply

## Output

- `{ intent, reply }`

## Side Effects

- Write to the DynamoDB training table, with `pk = AGENT#<idCompany>` and `sk = MESSAGE#<timestamp>#<id>`
- Read the model API key from SSM. The key is not logged.

## Status: DONE
