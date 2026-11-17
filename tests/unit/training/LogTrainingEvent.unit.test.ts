import { describe, expect, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { LogTrainingEvent } from '../../../layers/common/context/Training/application/LogTrainingEvent';
import { LogTrainingEventSchema } from '../../../layers/common/context/Training/application/DTO/LogTrainingEventDTO';

const message = {
  type: 'TrainingEventSent',
  payload: {
    eventType: 'training.created',
    datetime: '2026-11-11T10:00:00-05:00',
    timestamp: 1794431907,
  },
};

describe('Log Training Event', () => {
  test('returns the fixed text merged with the event payload', () => {
    const logTrainingEvent = DependencyInjection.resolve(LogTrainingEvent);

    const result = logTrainingEvent.run(LogTrainingEventSchema.parse(message));

    expect(result).toEqual({
      text: 'This is an event written from a Lambda that listens directly to the SNS event',
      eventType: 'training.created',
      datetime: '2026-11-11T10:00:00-05:00',
      timestamp: 1794431907,
    });
  });

  test('rejects a message with a different type', () => {
    const result = LogTrainingEventSchema.safeParse({
      ...message,
      type: 'ExampleEntityEvent',
    });

    expect(result.success).toBe(false);
  });

  test('rejects a message without payload', () => {
    const result = LogTrainingEventSchema.safeParse({
      type: 'TrainingEventSent',
    });

    expect(result.success).toBe(false);
  });
});
