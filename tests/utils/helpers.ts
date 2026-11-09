import { expect } from '@jest/globals';

export const assertPropertiesMatch = (
  expected: Record<string, any>,
  actual: Record<string, any>,
  ignoreProperties: string[] = [],
): void => {
  const finalIgnoreProperties = [...ignoreProperties, 'createdAt', 'updatedAt'];
  Object.entries(expected).forEach(([key, value]) => {
    if (finalIgnoreProperties.includes(key)) return;
    expect(actual).toHaveProperty(key, value);
  });
};
