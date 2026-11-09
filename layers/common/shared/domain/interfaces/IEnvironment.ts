export const Env = {
  STAGE: 'STAGE',
  SENTRY_DSN: 'SENTRY_DSN',
  EXAMPLES_TABLE_NAME: 'EXAMPLES_TABLE_NAME',
  EXAMPLES_TABLE_ARN: 'EXAMPLES_TABLE_ARN',
  OUTBOX_TABLE_NAME: 'OUTBOX_TABLE_NAME',
  OUTBOX_TABLE_ARN: 'OUTBOX_TABLE_ARN',
  OUTBOX_TABLE_STREAM_ARN: 'OUTBOX_TABLE_STREAM_ARN',
  AWS_REGION_ID: 'AWS_REGION_ID',
  SNS_EXAMPLE_ENTITY_TOPIC_ARN: 'SNS_EXAMPLE_ENTITY_TOPIC_ARN',
  OUTBOX_INTEGRATION_TEST_TABLE_NAME: 'OUTBOX_INTEGRATION_TEST_TABLE_NAME',
  LAMBDA_AUTHORIZER_ARN: 'LAMBDA_AUTHORIZER_ARN',
};

enum DynamoTableKeys {
  EXAMPLES = 'examples',
  OUTBOX = 'outbox',
  OUTBOX_INTEGRATION_TEST = 'outbox-integration-test',
}

enum SnsTopicKeys {
  EXAMPLE_ENTITY = 'example-topic-entity',
}

// enum SqsQueueKeys {
//   EXAMPLE_ENTITY = 'example-queue-entity',
// }

export const OutputEnvMap = {
  [Env.EXAMPLES_TABLE_NAME]: { key: DynamoTableKeys.EXAMPLES, suffix: 'name' },
  [Env.EXAMPLES_TABLE_ARN]: { key: DynamoTableKeys.EXAMPLES, suffix: 'arn' },
  [Env.OUTBOX_TABLE_NAME]: { key: DynamoTableKeys.OUTBOX, suffix: 'name' },
  [Env.OUTBOX_TABLE_ARN]: { key: DynamoTableKeys.OUTBOX, suffix: 'arn' },
  [Env.OUTBOX_TABLE_STREAM_ARN]: {
    key: DynamoTableKeys.OUTBOX,
    suffix: 'stream-arn',
  },
  [Env.OUTBOX_INTEGRATION_TEST_TABLE_NAME]: {
    key: DynamoTableKeys.OUTBOX_INTEGRATION_TEST,
    suffix: 'name',
  },
  [Env.SNS_EXAMPLE_ENTITY_TOPIC_ARN]: {
    key: SnsTopicKeys.EXAMPLE_ENTITY,
    suffix: 'arn',
  },
};

export type Env = (typeof Env)[keyof typeof Env];
