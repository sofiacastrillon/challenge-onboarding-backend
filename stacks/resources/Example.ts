import { CdkLess } from '@alegradev/cdkless';
import {
  CURRENT_API_VERSION,
  PROJECT_NAME,
  LAMBDAS_BASE_PATH,
} from '../constants';
import { Authorizer } from '../Authorizer';
import { getCommonEnv } from '../utils/Utils';
import { Env } from '../../layers/common/shared/domain/interfaces/IEnvironment';
import { getOutputValueByEnv } from '../../layers/common/utils/Utils';

export class Example {
  static build(app: CdkLess) {
    const outboxDynamoActions = ['dynamodb:PutItem'];

    /**
     * Si se usan variables de entorno usar getEnv
     * Si se usan outputs usar getOutputValueByEnv
     * Los outputs se definen desde la infra
     * La recomendación es usar outputs, ya que son más
     * seguros y fáciles de mantener.
     */
    const commonExampleEnv = {
      ...getCommonEnv(),
      [Env.EXAMPLES_TABLE_NAME]: getOutputValueByEnv(Env.EXAMPLES_TABLE_NAME),
      [Env.OUTBOX_TABLE_NAME]: getOutputValueByEnv(Env.OUTBOX_TABLE_NAME),
      [Env.OUTBOX_TABLE_ARN]: getOutputValueByEnv(Env.OUTBOX_TABLE_ARN),
    };

    app
      .lambda(`${LAMBDAS_BASE_PATH}/example/create`)
      .name(`${PROJECT_NAME}-create-example`)
      .post(`/${CURRENT_API_VERSION}/examples`)
      .addAuthorizer(Authorizer)
      .addTablePermissions(getOutputValueByEnv(Env.EXAMPLES_TABLE_ARN))
      .addPolicy(getOutputValueByEnv(Env.OUTBOX_TABLE_ARN), outboxDynamoActions)
      .environment({
        ...commonExampleEnv,
      });

    app
      .lambda(`${LAMBDAS_BASE_PATH}/example/read-one`)
      .name(`${PROJECT_NAME}-read-one-example`)
      .get(`/${CURRENT_API_VERSION}/examples/{exampleId}`)
      .addTablePermissions(getOutputValueByEnv(Env.EXAMPLES_TABLE_ARN))
      .addPolicy(getOutputValueByEnv(Env.OUTBOX_TABLE_ARN), outboxDynamoActions)
      .environment(commonExampleEnv);

    app
      .lambda(`${LAMBDAS_BASE_PATH}/example/read-all`)
      .name(`${PROJECT_NAME}-read-all-by-organization`)
      .get(`/${CURRENT_API_VERSION}/examples`)
      .addAuthorizer(Authorizer)
      .addTablePermissions(getOutputValueByEnv(Env.EXAMPLES_TABLE_ARN))
      .addPolicy(getOutputValueByEnv(Env.OUTBOX_TABLE_ARN), outboxDynamoActions)
      .environment(commonExampleEnv);

    app
      .lambda(`${LAMBDAS_BASE_PATH}/example/update`)
      .name(`${PROJECT_NAME}-update-example`)
      .put(`/${CURRENT_API_VERSION}/examples/{exampleId}`)
      .addAuthorizer(Authorizer)
      .addTablePermissions(getOutputValueByEnv(Env.EXAMPLES_TABLE_ARN))
      .addPolicy(getOutputValueByEnv(Env.OUTBOX_TABLE_ARN), outboxDynamoActions)
      .environment({
        ...commonExampleEnv,
      });

    app
      .lambda(`${LAMBDAS_BASE_PATH}/example/delete`)
      .name(`${PROJECT_NAME}-delete-example`)
      .delete(`/${CURRENT_API_VERSION}/examples/{exampleId}`)
      .addAuthorizer(Authorizer)
      .addTablePermissions(getOutputValueByEnv(Env.EXAMPLES_TABLE_ARN))
      .addPolicy(getOutputValueByEnv(Env.OUTBOX_TABLE_ARN), outboxDynamoActions)
      .environment({
        ...commonExampleEnv,
      });
  }
}
