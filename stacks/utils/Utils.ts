import { Env } from '../../layers/common/shared/domain/interfaces/IEnvironment';
import { getEnv } from '../../layers/common/utils/Utils';

export const getCommonEnv = () => ({
  [Env.SENTRY_DSN]: getEnv(Env.SENTRY_DSN),
  [Env.STAGE]: getEnv(Env.STAGE),
  [Env.AWS_REGION_ID]: getEnv(Env.AWS_REGION_ID),
});
