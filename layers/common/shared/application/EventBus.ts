import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { NotificationService } from '../domain/services/NotificationService';
import { TOKENS } from './di/Tokens';
import { BaseEvent } from '../domain/events/BaseEvent';

type EventHandler<T extends BaseEvent<any>> = (event: T) => Promise<void>;

export interface IEventSubscriber {
  on<T extends BaseEvent<any>>(
    eventName: string,
    handler: EventHandler<T>,
  ): void;
}

export interface EventListener {
  (
    subscriber: IEventSubscriber,
    notificationService: NotificationService,
  ): void;
}

export interface IEventBus extends IEventSubscriber {
  subscribe(...listeners: EventListener[]): void;
  publish<T extends BaseEvent<any>>(event: T): Promise<void>;
}

@injectable()
export class EventBus implements IEventBus {
  private handlers: Map<string, EventHandler<BaseEvent<any>>[]> = new Map();
  private subscribedListeners: Set<EventListener> = new Set();

  constructor(
    @inject(TOKENS.NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  subscribe(...listeners: EventListener[]) {
    listeners.forEach(listener => {
      if (!this.subscribedListeners.has(listener)) {
        listener(this, this.notificationService);
        this.subscribedListeners.add(listener);
      }
    });
  }

  on<T extends BaseEvent<any>>(
    eventName: string,
    handler: EventHandler<T>,
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    const existingHandlers = this.handlers.get(eventName)!;

    // Verificar si el handler ya está registrado para evitar duplicados
    if (!existingHandlers.includes(handler as EventHandler<BaseEvent<any>>)) {
      existingHandlers.push(handler as EventHandler<BaseEvent<any>>);
    }
  }

  async publish<T extends BaseEvent<any>>(event: T) {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];
    await Promise.all(handlers.map(handler => handler(event)));
  }
}
