# publishTrainingEventToKafka

## Goal

Publish a training event, received from the training SQS queue, to the Confluent Kafka topic after it matches the Avro schema.

## Input

- eventType: non-empty string
- datetime: ISO 8601 datetime string
- timestamp: integer number

The SQS body is the envelope `{ payload, type }`. `type` must be `TrainingEventSent`.

## Validations

- The Avro schema requires `text`, `eventType`, `datetime` and `timestamp`
- `timestamp` is encoded as an Avro `long`
- The Schema Registry rejects a message that does not match the schema, and the message stays in the queue

## Output

- The Kafka value `{ text, eventType, datetime, timestamp }`

## Side Effects

- Registers the Avro schema `TrainingEvent` on the subject `<topic>-value` with `BACKWARD` compatibility, when it is not already registered. The schema is sent as a JSON string
- Publishes the encoded value to the topic in `KAFKA_TOPIC`
- Reads the Confluent API keys from SSM SecureString parameters under `/challenge-onboarding-sofia/confluent/`

## Status: DONE
