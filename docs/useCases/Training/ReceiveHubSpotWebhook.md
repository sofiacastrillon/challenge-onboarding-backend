# receiveHubSpotWebhook

## Goal

Receive a HubSpot webhook, verify its signature, store each event in the training table and publish it to the training SNS topic.

## Input

- requestMethod: HTTP method of the request
- requestUri: full public URL of the request, with query string if any
- requestBody: raw body string, as signed by HubSpot
- requestTimestamp: value of `X-HubSpot-Request-Timestamp` (epoch milliseconds)
- signature: value of `X-HubSpot-Signature-v3`

The body is an array of `{ objectId, propertyName, propertyValue, occurredAt }`.

## Validations

- The timestamp is present and no more than 5 minutes from now (401 otherwise)
- The signature matches HMAC-SHA256 base64 of method + uri + body + timestamp, with the secret from SSM (401 otherwise)
- The body is valid JSON and matches the event array (400 otherwise)

## Output

- `{ received: <number of events> }`

## Side Effects

- Saves each event in the training table with `pk = HUBSPOT#<objectId>` and `sk = EVENT#<occurredAt>#<propertyName>`
- Publishes each event as `TrainingEventSent` with `eventType = hubspot.propertyChange`
- Reads the secret from SSM `/challenge-onboarding-sofia/hubspot/webhook-secret`

## Status: DONE
