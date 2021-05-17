import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { ConquestCreatedEvent } from './conquest-created.event';

@EventsHandler(ConquestCreatedEvent)
export class ConquestCreatedHandler
  implements IEventHandler<ConquestCreatedEvent>
{
  handle(event: ConquestCreatedEvent) {
    console.log('ConquestCreatedEvent...');
    console.log(event);
  }
}
