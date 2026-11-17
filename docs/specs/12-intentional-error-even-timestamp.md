# 12 · Intentional error on even timestamps

In the SQS consumer, if the numeric `timestamp` of the event is even, the Lambda throws an error on purpose. The message then goes back to the queue, so the retry and DLQ behaviour can be observed.

## Rule

- `timestamp` is the numeric `payload.timestamp` of the SQS message.
- If `timestamp % 2 === 0`, `PublishTrainingEventToKafka.run` throws before publishing anything to Kafka.
- If the timestamp is odd, the event is published as in task 11.

## Retry and DLQ

- The SQS queue `challenge-onboarding-sofia-training-training` has a redrive policy with `maxReceiveCount: 3` (infra task 04).
- Each failed invocation returns the message to the queue. After 3 receives, SQS moves it to the DLQ `challenge-onboarding-sofia-training-dlq-training`.
- The Lambda timeout (30s) stays below the queue visibility timeout (60s).

## Implementation

- The rule lives in the use case, so the Lambda handler stays thin.
- No infra change is needed.

## Out of scope

- Changing the redrive policy or the DLQ setup.
- The HubSpot webhook (task 13).
