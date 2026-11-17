# 15 · Training agent

Add a Lambda at `POST /v1/training/agent` that runs a two-node LangGraph agent. The endpoint uses the Alegra authorizer.

## Request

- Body: `{ "message": "texto del cliente" }`.
- `idCompany` and `idUser` come from the authorizer.

## Graph

- Node `classify`: labels the message as `ventas`, `soporte` or `cancelacion`.
- Node `respond`: writes a short Spanish reply for that intent.
- The model is OpenAI (`TRAINING_AGENT_MODEL`, default `gpt-4o-mini`), matching the LangChain Academy course.
- The API key is a SecureString in SSM: `/challenge-onboarding-sofia/agent/api-key`. It is never stored in the repository. Creating the parameter is manual, after the leader provides the key.

## Response

- `{ "intent": "...", "reply": "..." }`.
- The Lambda logs `message`, `intent` and `reply` so the three acceptance messages are visible in CloudWatch.

## DynamoDB

- Table: the training table (`TRAINING_TABLE_NAME`).
- `pk = AGENT#<idCompany>`, `sk = MESSAGE#<iso timestamp>#<id>`.
- Attributes: `message`, `intent`, `reply`, `idCompany`, `idUser`, `createdAt`, `updatedAt`.
- These items do not appear in `GET /v1/training`, which queries `TRAINING#` sort keys only.

## Out of scope

- Creating the SSM parameter.
- A provider other than OpenAI. Swap `LangGraphTrainingAgent` if the leader assigns a different model.
