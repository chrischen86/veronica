import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { ConquestService } from 'src/conquest/conquest.service';
import { NodeUpdatedEvent } from 'src/conquest/events/node-updated.event';
import { SocketioGateway } from '../socketio.gateway';

@EventsHandler(NodeUpdatedEvent)
export class NodeUpdatedEventHandler
  implements IEventHandler<NodeUpdatedEvent>
{
  constructor(
    private readonly websocketGateway: SocketioGateway,
    private readonly service: ConquestService,
  ) {}

  async handle(event: NodeUpdatedEvent) {
    console.log('NodeUpdatedEvent Socket Handler...');
    const { conquestId } = event;

    const conquestState = await this.service.findOneConquest(conquestId);

    this.websocketGateway.server.to(conquestId).emit('NodeUpdated', {
      status: 'ok',
      conquestState,
    });
  }
}
