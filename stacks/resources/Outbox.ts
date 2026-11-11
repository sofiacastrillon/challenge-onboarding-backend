import { CdkLess } from '@alegradev/cdkless';
import { PROJECT_NAME, LAMBDAS_BASE_PATH } from '../constants';
import { getCommonEnv, getOutputValueByEnv } from '../utils/Utils';
import { Env } from '../../layers/common/shared/domain/interfaces/IEnvironment';
import { FilterCriteria, StartingPosition } from 'aws-cdk-lib/aws-lambda';

export class Outbox {
  static build(app: CdkLess) {
    const snsActions = ['sns:Publish'];
    const dynamoActions = [
      'dynamodb:Query',
      'dynamodb:GetItem',
      'dynamodb:PutItem',
      'dynamodb:UpdateItem',
    ];
    const streamActions = [
      'dynamodb:GetRecords',
      'dynamodb:GetShardIterator',
      'dynamodb:DescribeStream',
      'dynamodb:ListStreams',
    ];

    const commonOutboxEnv = {
      ...getCommonEnv(),
      [Env.OUTBOX_TABLE_NAME]: getOutputValueByEnv(Env.OUTBOX_TABLE_NAME),
    };

    app
      .lambda(`${LAMBDAS_BASE_PATH}/outbox/publish-event`)
      .name(`${PROJECT_NAME}-publish-event`)
      .addPolicy(getOutputValueByEnv(Env.OUTBOX_TABLE_ARN), dynamoActions)
      .addPolicy(
        `${getOutputValueByEnv(Env.OUTBOX_TABLE_ARN)}/*`,
        dynamoActions,
      )
      .addPolicy(
        getOutputValueByEnv(Env.OUTBOX_TABLE_STREAM_ARN),
        streamActions,
      )
      .addPolicy(
        getOutputValueByEnv(Env.SNS_EXAMPLE_ENTITY_TOPIC_ARN),
        snsActions,
      )
      .addDynamoStreamsTrigger(
        getOutputValueByEnv(Env.OUTBOX_TABLE_STREAM_ARN),
        {
          batchSize: 1,
          startingPosition: StartingPosition.LATEST,
          filters: [
            FilterCriteria.filter({
              eventName: ['INSERT'],
            }),
          ],
        },
      )
      .environment({
        ...commonOutboxEnv,
        [Env.SNS_EXAMPLE_ENTITY_TOPIC_ARN]: getOutputValueByEnv(
          Env.SNS_EXAMPLE_ENTITY_TOPIC_ARN,
        ),
      });

    app
      .lambda(`${LAMBDAS_BASE_PATH}/outbox/publish-stuck-events`)
      .name(`${PROJECT_NAME}-publish-stuck-events`)
      .addPolicy(
        getOutputValueByEnv(Env.OUTBOX_TABLE_STREAM_ARN),
        streamActions,
      )
      .addPolicy(getOutputValueByEnv(Env.OUTBOX_TABLE_ARN), dynamoActions)
      .addPolicy(
        `${getOutputValueByEnv(Env.OUTBOX_TABLE_ARN)}/*`,
        dynamoActions,
      )
      .addPolicy(
        getOutputValueByEnv(Env.SNS_EXAMPLE_ENTITY_TOPIC_ARN),
        snsActions,
      )
      .addEventBridgeRuleTrigger({
        scheduleExpression: 'rate(1 minute)',
        ruleName: `${PROJECT_NAME}-outbox-publish-stuck-events`,
      })
      .environment(commonOutboxEnv);
  }
}
