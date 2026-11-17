import { describe, expect, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { SendTrainingEvent } from '../../../layers/common/context/Training/application/SendTrainingEvent';
import { SendTrainingEventSchema } from '../../../layers/common/context/Training/application/DTO/SendTrainingEventDTO';
import { TrainingEventSent } from '../../../layers/common/context/Training/domain/events/TrainingEventSent';
import { TOKENS } from '../../../layers/common/shared/application/di/Tokens';
import { MockNotificationService } from '../../mocks/shared/infrastructure/MockNotificationService';

const validInput = {
  eventType: 'training.created',
  datetime: '2026-11-11T10:00:00-05:00',
  timestamp: 1794431907,
};

describe('Send Training Event', () => {
  test('publishes a TrainingEventSent with the three fields', async () => {
    const sendTrainingEvent = DependencyInjection.resolve(SendTrainingEvent);
    const notifications = DependencyInjection.resolve<MockNotificationService>(
      TOKENS.NotificationService,
    );

    const result = await sendTrainingEvent.run(validInput);

    expect(result).toEqual(validInput);
    expect(notifications.events).toHaveLength(1);
    expect(notifications.events[0]).toBeInstanceOf(TrainingEventSent);
    expect(notifications.events[0].toObject()).toEqual(validInput);
  });

  test('rejects an invalid datetime', () => {
    const result = SendTrainingEventSchema.safeParse({
      ...validInput,
      datetime: 'not-a-date',
    });

    expect(result.success).toBe(false);
  });

  test('rejects a non-numeric timestamp', () => {
    const result = SendTrainingEventSchema.safeParse({
      ...validInput,
      timestamp: '1794431907',
    });

    expect(result.success).toBe(false);
  });
});
