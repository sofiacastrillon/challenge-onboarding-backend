# 13 · HubSpot webhook

Add a Lambda that receives HubSpot webhooks at `POST /v1/training/hubspot-webhook`. The endpoint has no Alegra authorizer: its security is the HubSpot signature.

## Request

- HubSpot sends an array of events in the body. Each event has `objectId`, `propertyName`, `propertyValue` and `occurredAt` (epoch milliseconds).
- Headers: `X-HubSpot-Signature-v3` and `X-HubSpot-Request-Timestamp` (epoch milliseconds).

## Signature

- Signature = base64(HMAC-SHA256(secret, method + uri + body + X-HubSpot-Request-Timestamp)).
- `uri` is the full public URL: `https://<domain><path><?query>`.
- The secret is a SecureString in SSM: `/challenge-onboarding-sofia/hubspot/webhook-secret`. It is a test secret, not the HubSpot production one.
- The comparison is timing-safe.

## Rules

1. Reject with 401 when the timestamp is missing or more than 5 minutes away from now.
2. Reject with 401 when the signature does not match. Nothing is saved or published.
3. Reject with 400 when the body is not valid JSON or does not match the event array.
4. For each event, save it in the training DynamoDB table and publish it to the training SNS topic.

## DynamoDB

- Table: the training table (`TRAINING_TABLE_NAME`).
- `pk = HUBSPOT#<objectId>`, `sk = EVENT#<occurredAt>#<propertyName>`.
- Attributes: `objectId`, `propertyName`, `propertyValue`, `occurredAt`, `createdAt`, `updatedAt`.
- These items do not appear in `GET /v1/training`, which queries `COMPANY#` keys only.

## SNS

- Each event is published as the existing `TrainingEventSent` envelope, so the training subscribers (tasks 10 and 11) keep working unchanged:
  - `eventType`: `hubspot.propertyChange`
  - `datetime`: `occurredAt` as ISO 8601
  - `timestamp`: `occurredAt` in seconds (integer)
- Because the SQS consumer applies the task 12 rule, an event whose `timestamp` (seconds) is even fails on purpose and goes to the DLQ.

## Implementation

- Use case `ReceiveHubSpotWebhook.run(dto)` in `layers/common/context/Training/application`. Validation and signature checks happen before any write.
- Ports: `HubSpotSignatureVerifier` and `HubSpotEventRepository` in `domain`.
- Adapters: `SsmHubSpotSignatureVerifier` (reads the secret from SSM, caches it) and `DynamoHubSpotEventRepository`.
- Lambda `lambdas/training/hubspot-webhook.ts`: builds the signed URI and headers from the API Gateway event and calls the use case. It does not use `ApiMiddleware`, because that middleware needs the Alegra authorizer context.
- Stack `stacks/resources/Training.ts`: no authorizer. Table permissions, `sns:Publish` on the training topic, and `ssm:GetParameter` on `/challenge-onboarding-sofia/hubspot/*`.

## Out of scope

- Creating the SSM secret. It is created manually with `aws ssm put-parameter --type SecureString`.
- A HubSpot sandbox workflow. Requests are signed by a local script.
