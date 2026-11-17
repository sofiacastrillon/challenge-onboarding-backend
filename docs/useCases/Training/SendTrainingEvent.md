# sendTrainingEvent

## Goal

Publish a training event to the training SNS topic on behalf of the authenticated caller.

## Input

- eventType: non-empty string
- datetime: ISO 8601 datetime string (offset allowed)
- timestamp: integer number
- idCompany and idUser are injected by the authorizer and are not published

## Validations

- eventType is a non-empty string
- datetime is a valid ISO 8601 datetime
- timestamp is an integer

## Output

- The published payload `{ eventType, datetime, timestamp }`

## Side Effects

- Publishes a `TrainingEventSent` to the SNS topic in `TRAINING_TOPIC_ARN`. The SNS message is the envelope `{ payload, type }`.

## Status: DONE
