import { Aws, Duration } from 'aws-cdk-lib';
import { CdkLess } from '@alegradev/cdkless';
import {
  CURRENT_API_VERSION,
  LAMBDAS_BASE_PATH,
  PROJECT_NAME,
} from '../constants';
import { Authorizer } from '../Authorizer';
import { getCommonEnv, getOutputValueByEnv } from '../utils/Utils';
import { Env } from '../../layers/common/shared/domain/interfaces/IEnvironment';

export class Training {
  static build(app: CdkLess) {
    const commonTrainingEnv = {
      ...getCommonEnv(),
      [Env.TRAINING_TABLE_NAME]: getOutputValueByEnv(Env.TRAINING_TABLE_NAME),
      [Env.TRAINING_TABLE_ARN]: getOutputValueByEnv(Env.TRAINING_TABLE_ARN),
    };

    app
      .lambda(`${LAMBDAS_BASE_PATH}/training/create`)
      .name(`${PROJECT_NAME}-create-training`)
      .post(`/${CURRENT_API_VERSION}/training`)
      .addAuthorizer(Authorizer)
      .addTablePermissions(getOutputValueByEnv(Env.TRAINING_TABLE_ARN))
      .environment(commonTrainingEnv);

    app
      .lambda(`${LAMBDAS_BASE_PATH}/training/read-all`)
      .name(`${PROJECT_NAME}-read-all-training`)
      .get(`/${CURRENT_API_VERSION}/training`)
      .addAuthorizer(Authorizer)
      .addTablePermissions(getOutputValueByEnv(Env.TRAINING_TABLE_ARN))
      .environment(commonTrainingEnv);

    app
      .lambda(`${LAMBDAS_BASE_PATH}/training/send-event`)
      .name(`${PROJECT_NAME}-send-training-event`)
      .post(`/${CURRENT_API_VERSION}/training/send-event`)
      .addAuthorizer(Authorizer)
      .addPolicy(getOutputValueByEnv(Env.TRAINING_TOPIC_ARN), ['sns:Publish'])
      .environment({
        ...getCommonEnv(),
        [Env.TRAINING_TOPIC_ARN]: getOutputValueByEnv(Env.TRAINING_TOPIC_ARN),
      });

    app
      .lambda(`${LAMBDAS_BASE_PATH}/training/training-event-subscriber`)
      .name(`${PROJECT_NAME}-training-event-subscriber`)
      .addSnsTrigger(getOutputValueByEnv(Env.TRAINING_TOPIC_ARN))
      .environment(getCommonEnv());

    app
      .lambda(`${LAMBDAS_BASE_PATH}/training/sqs-to-kafka`)
      .name(`${PROJECT_NAME}-sqs-to-kafka`)
      .timeout(Duration.seconds(30))
      .addSqsTrigger(getOutputValueByEnv(Env.TRAINING_QUEUE_ARN), {
        batchSize: 1,
      })
      .addPolicy(
        `arn:aws:ssm:${Aws.REGION}:${Aws.ACCOUNT_ID}:parameter/challenge-onboarding-sofia/confluent/*`,
        ['ssm:GetParameter', 'ssm:GetParameters'],
      )
      .environment({
        ...getCommonEnv(),
        [Env.CONFLUENT_BOOTSTRAP_SERVER]:
          'pkc-p11xm.us-east-1.aws.confluent.cloud:9092',
        [Env.CONFLUENT_SCHEMA_REGISTRY_URL]:
          'https://psrc-zj6ny.us-east-2.aws.confluent.cloud',
        [Env.KAFKA_TOPIC]: 'revops-training-events-sofia-castrillon',
      });
  }
}
