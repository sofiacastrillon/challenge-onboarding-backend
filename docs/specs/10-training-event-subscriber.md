# 10 · SNS subscriber Lambda for training events

Add a Lambda that subscribes to the training SNS topic and writes each received event to CloudWatch with `console.log`. No HTTP endpoint and no change to the infra repo: the topic already exists and exports its ARN.

## Trigger

- Lambda `challenge-onboarding-sofia-training-event-subscriber`, subscribed to the topic in `TRAINING_TOPIC_ARN` with `addSnsTrigger`.
- Input: standard SNS event, `event.Records[].Sns.Message`. Each message is the envelope published by task 09: `{ "payload": { eventType, datetime, timestamp }, "type": "TrainingEventSent" }`.

## Output

For each record, the Lambda writes one line to CloudWatch:

```json
{ "text": "This is an event written from a Lambda that listens directly to the SNS event", "eventType": "...", "datetime": "...", "timestamp": 0 }
```

The payload fields are merged into the log object at the top level.

## Implementation

- DTO `LogTrainingEventDTO` with zod schema `LogTrainingEventSchema`: `type` must be the literal `TrainingEventSent`, `payload` is validated with `SendTrainingEventSchema`.
- Output DTO `TrainingEventLogDTO` (`text` plus the three payload fields).
- Use case `LogTrainingEvent.run(dto)` returns `TrainingEventLogDTO`. It does not publish or write anything itself.
- Lambda `lambdas/training/training-event-subscriber.ts`: parses each record's message with `LogTrainingEventSchema`, runs the use case, and calls `console.log(JSON.stringify(result))`. Wrapped with `BugTracker.wrapHandler`.
- Stack `stacks/resources/Training.ts`: `.addSnsTrigger(getOutputValueByEnv(Env.TRAINING_TOPIC_ARN))` and the common environment.
- Unit tests: returns the fixed text merged with the payload; rejects a message with a different `type`; rejects a message without `payload`.
- Use case doc `docs/useCases/Training/LogTrainingEvent.md` with `Status: DONE`.

## Out of scope

The SQS consumer that writes to Kafka (task 11), the intentional error on even timestamps (task 12), and any change to the topic or the SNS envelope.
