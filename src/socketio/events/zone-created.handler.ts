import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { ConquestService } from '../../conquest/conquest.service';
import { ZoneInitializedEvent } from '../../conquest/events/zone-initialized.event';
import { SocketioGateway } from '../socketio.gateway';

@EventsHandler(ZoneInitializedEvent)
export class ZoneCreatedEventHandler
  implements IEventHandler<ZoneInitializedEvent>
{
  constructor(
    private readonly websocketGateway: SocketioGateway,
    private readonly service: ConquestService,
  ) {}

  async handle(event: ZoneInitializedEvent) {
    console.log('ZoneInitializedEvent Socket Handler...');
    const { conquestId } = event;

    const conquestState = await this.service.findOneConquest(conquestId);

    this.websocketGateway.server.to(conquestId).emit('ZoneCreated', {
      status: 'ok',
      conquestState,
    });
  }
}
