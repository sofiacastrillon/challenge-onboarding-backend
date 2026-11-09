import { EventListener } from '../../../../shared/application/EventBus';
import { ExampleEntityEvent } from '../../domain/events/ExampleEntityEvent';

export const exampleListeners: EventListener = subscriber => {
  subscriber.on<ExampleEntityEvent>(ExampleEntityEvent.name, async event => {
    console.log(event);
  });
};
