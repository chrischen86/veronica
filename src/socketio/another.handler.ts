import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { ConquestCreatedEvent } from '../conquest/events/conquest-created.event';
import { SocketioGateway } from './socketio.gateway';

@EventsHandler(ConquestCreatedEvent)
export class ConquestCreatedTestSocketHandler
  implements IEventHandler<ConquestCreatedEvent>
{
  constructor(private readonly websocketGateway: SocketioGateway) {}

  handle(event: ConquestCreatedEvent) {
    console.log('ConquestCreatedEvent Test Socket...');
    this.websocketGateway.server.to('conquest1').emit('ConquestCreatedevent', {
      test: 1,
      wow: 2,
    });
  }
}
