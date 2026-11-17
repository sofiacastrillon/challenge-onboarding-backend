# 11 · SQS consumer that publishes to Confluent Kafka

Add a Lambda that reads the training SQS queue and publishes each event to the Confluent Kafka topic, after validating it against the Confluent Schema Registry. The topic is in Confluent, not in AWS MSK.

## Trigger

- SQS queue `challenge-onboarding-sofia-training-training` (infra task 03), with `rawMessageDelivery` enabled on its SNS subscription.
- Each SQS record body is the envelope published by task 09: `{ "payload": { eventType, datetime, timestamp }, "type": "TrainingEventSent" }`.

## Kafka message

The Kafka value is an Avro record named `TrainingEvent` with these fields:

```json
{
  "text": "Esto es un evento escrito desde una lambda que escucha eventos desde SQS",
  "eventType": "training.created",
  "datetime": "2026-11-11T10:00:00-05:00",
  "timestamp": 1794431907
}
```

- `text` is a fixed string.
- `eventType`, `datetime` and `timestamp` come from `payload`.
- `timestamp` is an Avro `long`.

## Schema

- Format: Avro (decided by Sofia). Record name `TrainingEvent`, no namespace.
- Registered in the Confluent Schema Registry under the topic subject, with compatibility `BACKWARD`. The schema is sent as a JSON string, which is the format the registry accepts.
- The message is serialized with the registry schema before it is produced, so a message that does not match the schema is not written to the topic.

## Connection

- Topic: `revops-training-events-sofia-castrillon`.
- Bootstrap server: `pkc-p11xm.us-east-1.aws.confluent.cloud:9092`.
- Schema Registry: `https://psrc-zj6ny.us-east-2.aws.confluent.cloud`.
- Cluster and Schema Registry API keys are read from SSM SecureString parameters under `/challenge-onboarding-sofia/confluent/`:
  - `api-key`, `api-secret`
  - `sr-api-key`, `sr-api-secret`
- Libraries: `kafkajs` for the producer and `@kafkajs/confluent-schema-registry` for Avro encoding.

## Implementation

- Use case `PublishTrainingEventToKafka.run(dto)`: takes the parsed `payload`, builds the Kafka value, and calls a `TrainingEventPublisher` interface.
- Infrastructure adapter `ConfluentTrainingEventPublisher`: wraps `kafkajs` and the Schema Registry client. Lives in `layers/common/context/Training/infrastructure/`.
- Lambda `lambdas/training/sqs-to-kafka.ts`: parses each record body, runs the use case, and wraps the handler with `BugTracker.wrapHandler`.
- Stack `stacks/resources/Training.ts`: SQS trigger on the training queue, and the SSM parameter names in the environment.

## Out of scope

- The intentional error on even timestamps and the DLQ behaviour (task 12).
- Removing the MSK cluster and the Glue schema registry from the infra repo.
- The HubSpot webhook (task 13).
