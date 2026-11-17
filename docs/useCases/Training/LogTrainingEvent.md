# logTrainingEvent

## Goal

Write each training event received from the training SNS topic to CloudWatch, so the event can be seen in logs.

## Input

- type: must be the literal `TrainingEventSent`
- payload: `{ eventType, datetime, timestamp }`, validated with the same rules as `sendTrainingEvent`

## Validations

- The message type is `TrainingEventSent`
- The payload has a valid `eventType`, `datetime`, and integer `timestamp`

## Output

- The log object `{ text, eventType, datetime, timestamp }`, written with `console.log` as a single JSON line

## Side Effects

- Writes one line to CloudWatch Logs per SNS record. Does not publish or store anything.

## Status: DONE
