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
  }
}
