import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { ConquestService } from '../../conquest/conquest.service';
import { NodeAssignedEvent } from '../../shared/events/node-assigned.event';
import { SocketioGateway } from '../socketio.gateway';

@EventsHandler(NodeAssignedEvent)
export class NodeAssignedEventHandler
  implements IEventHandler<NodeAssignedEvent>
{
  constructor(
    private readonly websocketGateway: SocketioGateway,
    private readonly service: ConquestService,
  ) {}

  async handle(event: NodeAssignedEvent) {
    console.log('NodeAssignedEvent Socket Handler...');
    const { conquestId } = event;

    const conquestState = await this.service.findOneConquest(conquestId);
    this.websocketGateway.server.to(conquestId).emit('NodeUpdated', {
      status: 'ok',
      conquestState,
    });
  }
}
