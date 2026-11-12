# readAllTrainings

## Goal

Return all training records for the authenticated company.

## Input

- idCompany: injected by the authorizer (`organization.legacyId`)

## Validations

- idCompany is a non-empty string

## Output

- List of trainings for that company
- Empty list if the company has no records

## Side Effects

- None. Reads by `pk = COMPANY#<idCompany>` and `sk` beginning with `TRAINING#`

## Status: DONE
