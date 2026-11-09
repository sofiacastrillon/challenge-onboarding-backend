import z from 'zod';
import { Env, OutputEnvMap } from '../shared/domain/interfaces/IEnvironment';
import { Stage } from '../shared/domain/interfaces/IStage';
import { DEBUG_STAGES } from '../shared/domain/interfaces/IStage';
import { PROJECT_NAME } from '../../../stacks/constants';
import * as cdk from 'aws-cdk-lib';

export const isDebugStage = (stage: Stage): boolean => {
  return DEBUG_STAGES.includes(stage);
};

export const getEnv = (key: Env, defaultValue?: string): string => {
  if (
    !process.env[key] &&
    defaultValue === undefined &&
    defaultValue === null
  ) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return process.env[key] || defaultValue || '';
};

/**
 * Validar si un valor es un UUID
 * @param {string} value Valor a validar
 * @returns {boolean}
 */
export const isUUID = (value: string) => {
  try {
    z.string().uuid().parse(value);
  } catch {
    return false;
  }
  return true;
};

/**
 * Validar si un valor es un JSON
 * @param {string} value Valor a validar
 * @returns {boolean}
 */
export const isJson = (value: string) => {
  try {
    JSON.parse(value);
  } catch {
    return false;
  }
  return true;
};

/**
 * Generate output name following the infra repository pattern
 * Format: ${PROJECT_NAME}-${key.toLowerCase()}${suffix ? `-${suffix.toLowerCase()}` : ''}
 * @param key The resource key
 * @param suffix Optional suffix (e.g., 'arn', 'url')
 * @returns The generated output name
 */
export const generateOutputName = (key: string, suffix?: string): string =>
  `${PROJECT_NAME}-${key.toLowerCase().replace(/\//g, '-')}${suffix ? `-${suffix.toLowerCase()}` : ''}`;

/**
 * Generate environment name following the infra repository pattern
 * Format: ${key.toLowerCase().replace(/\//g, '-').replace(/-/g, '_')}${suffix ? `_${suffix.toLowerCase()}` : ''}
 * @param key The resource key
 * @param suffix Optional suffix (e.g., 'arn', 'url')
 * @returns The generated environment name
 */
export const getEnvName = (key: string, suffix?: string): string => {
  return `${key.toLowerCase().replace(/\//g, '-').replace(/-/g, '_')}${suffix ? `_${suffix.toLowerCase()}` : ''}`.toUpperCase();
};

export const getOutputValueByEnv = (env: Env): string => {
  return cdk.Fn.importValue(
    generateOutputName(OutputEnvMap[env].key, OutputEnvMap[env].suffix),
  );
};
