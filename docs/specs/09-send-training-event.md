# 09 · POST /v1/training/send-event

Implement an authenticated endpoint that publishes a training event to the training SNS topic. Do not change the infra repo: the topic and its `arn` export already exist (`challenge-onboarding-sofia-training-topic-arn`).

## Endpoint

- `POST /v1/training/send-event`, with the same Alegra authorizer as `POST /v1/training`.
- Body:
  - `eventType`: non-empty string.
  - `datetime`: ISO 8601 datetime string (offset allowed).
  - `timestamp`: integer number.
- `idCompany` and `idUser` come from the authorizer. The client does not send them, and they are not part of the published event.
- Success: `200` with the published payload `{ eventType, datetime, timestamp }`.
- Invalid body: `400` with the validation errors from zod.
- Without a token, API Gateway returns `401` and the Lambda does not run.

## Implementation

- Event `TrainingEventSent` in `layers/common/context/Training/domain/events/`, `type = 'TrainingEventSent'`, payload `ITrainingEvent`.
- DTO `SendTrainingEventDTO` with the zod schema above.
- Use case `SendTrainingEvent.run(dto)`: builds `TrainingEventSent` from `eventType`, `datetime`, and `timestamp`, and calls `NotificationService.publish`.
- `SnsNotificationService` maps `TrainingEventSent` to the topic in env `TRAINING_TOPIC_ARN`. The SNS message is the event envelope `{ payload, type }`, the same format the Example events use.
- `OutputEnvMap` maps `TRAINING_TOPIC_ARN` to the `training-topic` export, suffix `arn`.
- Lambda `lambdas/training/send-event.ts`, using `ApiMiddleware` and `BugTracker`.
- In `stacks/resources/Training.ts`: function `challenge-onboarding-sofia-send-training-event`, route `POST /v1/training/send-event`, authorizer, `sns:Publish` on the training topic, and `TRAINING_TOPIC_ARN` in its environment.
- Unit tests: publishes the event with the three fields, and the schema rejects an invalid `datetime` and a non-numeric `timestamp`.
- Use case doc in `docs/useCases/Training/SendTrainingEvent.md` with `Status: DONE`.

## Out of scope

Subscribing to the topic (task 10), the SQS consumer (task 11), and any change to the SNS message envelope.
