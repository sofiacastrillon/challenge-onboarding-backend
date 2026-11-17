# 15 · Training agent

Add a Lambda at `POST /v1/training/agent` that runs a two-node LangGraph agent. The endpoint uses the Alegra authorizer.

## Request

- Body: `{ "message": "texto del cliente" }`.
- `idCompany` and `idUser` come from the authorizer.

## Graph

- Node `classify`: labels the message as `ventas`, `soporte` or `cancelacion`.
- Node `respond`: writes a short Spanish reply for that intent.
- The model is called through the Alegra LiteLLM gateway (`https://alegra-litellm.alegra.com/v1`), which exposes an OpenAI-compatible API. The model name is `openai/gpt-4.1-mini` (`TRAINING_AGENT_MODEL`).
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
- Prompt rules to avoid invented facts (for example, prices). The agent can still invent prices today.
- A direct call to OpenAI. Requests must go through LiteLLM; the key comes from the LiteLLM gateway.
