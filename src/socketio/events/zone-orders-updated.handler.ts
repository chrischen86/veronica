import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { ConquestService } from '../../conquest/conquest.service';
import { ZoneOrdersUpdatedEvent } from '../../conquest/events/zone-orders-updated.event';
import { SocketioGateway } from '../socketio.gateway';

@EventsHandler(ZoneOrdersUpdatedEvent)
export class ZoneOrdersUpdatedHandler
  implements IEventHandler<ZoneOrdersUpdatedEvent>
{
  constructor(
    private readonly websocketGateway: SocketioGateway,
    private readonly service: ConquestService,
  ) {}

  async handle(event: ZoneOrdersUpdatedEvent) {
    console.log('ZoneOrdersUpdatedEvent Socket Handler...');
    const { conquestId } = event;

    const conquestState = await this.service.findOneConquest(conquestId);

    this.websocketGateway.server.to(conquestId).emit('ZoneOrdersUpdated', {
      status: 'ok',
      conquestState,
    });
  }
}
