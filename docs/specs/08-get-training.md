# 08 · GET /v1/training

Implement the listing of the authenticated company's trainings. Do not change the infra repo: the table already has `pk` and `sk`.

## Endpoint

- `GET /v1/training`, with the same Alegra authorizer as `POST /v1/training`.
- `idCompany` comes from `requestContext.authorizer.lambda.organization.legacyId`. The client does not send it.
- No query params or path params.
- `200` with an array of `{ id, idCompany, idUser, documentType, fromDate, toDate, createdAt, updatedAt }`.
- If the company has no records, `200` with `[]`.
- Without a token, API Gateway returns `401` and the Lambda does not run.

## Implementation

- Use case `ReadAllTrainings.run`, DTO `ReadAllTrainingsDTO` with a non-empty string `idCompany`.
- `TrainingRepository.findAll(idCompany)`.
- In `DynamoTrainingRepository`, a `Query` with `pk = COMPANY#<idCompany>` and `sk` beginning with `TRAINING#`. One page only, same as the Example `findAll`.
- Lambda `lambdas/training/read-all.ts`. The response is `trainings.map(training => training.toObject())`.
- In `stacks/resources/Training.ts`, function `challenge-onboarding-sofia-read-all-training`, route `GET /v1/training`, authorizer, and table permission for the training table. Same environment variables as the POST.
- Unit test: returns only that company's records, returns an empty list when there are none, and the schema rejects an empty `idCompany`.
- Use case doc in `docs/useCases/Training/ReadAllTrainings.md` with `Estado: DONE`.

## Out of scope

Pagination, filters, and reading another company's records.
