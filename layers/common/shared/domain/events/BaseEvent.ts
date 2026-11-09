export const EventActionValue = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export type EventActionValue =
  (typeof EventActionValue)[keyof typeof EventActionValue];

export interface IEvent {
  type: string;
  payload: any;
  toObject(): any;
}

export abstract class BaseEvent<T> implements IEvent {
  abstract readonly type: string;
  constructor(public readonly payload: T) {}

  toObject(): T {
    return this.payload;
  }
}
