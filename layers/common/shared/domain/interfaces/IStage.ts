export const Stage = {
  DEV: 'dev',
  PROD: 'prod',
  TEST: 'test',
  SAND: 'sand',
  QA_PROD: 'qa-prod',
  QA_TEST: 'qa-test',
  QA_SAND: 'qa-sand',
} as const;

export type Stage = (typeof Stage)[keyof typeof Stage];

export const DEBUG_STAGES: Stage[] = [Stage.DEV, Stage.TEST];
