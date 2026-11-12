import * as cdk from 'aws-cdk-lib';
import {
  Env,
  OutputEnvMap,
} from '../../layers/common/shared/domain/interfaces/IEnvironment';
import { getEnv } from '../../layers/common/utils/Utils';
import { PROJECT_NAME } from '../constants';

export const getCommonEnv = () => ({
  [Env.SENTRY_DSN]: getEnv(Env.SENTRY_DSN),
  [Env.STAGE]: getEnv(Env.STAGE),
  [Env.AWS_REGION_ID]: getEnv(Env.AWS_REGION_ID),
});

/**
 * CloudFormation export name shared with the infra repository.
 * Format: ${PROJECT_NAME}-${key}${suffix ? `-${suffix}` : ''}
 */
export const generateOutputName = (key: string, suffix?: string): string =>
  `${PROJECT_NAME}-${key.toLowerCase().replace(/\//g, '-')}${suffix ? `-${suffix.toLowerCase()}` : ''}`;

export const getOutputValueByEnv = (env: Env): string => {
  return cdk.Fn.importValue(
    generateOutputName(OutputEnvMap[env].key, OutputEnvMap[env].suffix),
  );
};
