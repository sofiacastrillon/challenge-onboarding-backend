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
  }
}
