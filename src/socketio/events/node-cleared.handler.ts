import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { ConquestService } from '../../conquest/conquest.service';
import { NodeClearedEvent } from '../../shared/events/node-cleared.event';
import { SocketioGateway } from '../socketio.gateway';

@EventsHandler(NodeClearedEvent)
export class NodeClearedEventHandler
  implements IEventHandler<NodeClearedEvent>
{
  constructor(
    private readonly websocketGateway: SocketioGateway,
    private readonly service: ConquestService,
  ) {}

  async handle(event: NodeClearedEvent) {
    console.log('NodeClearedEvent Socket Handler...');
    const { conquestId } = event;

    const conquestState = await this.service.findOneConquest(conquestId);

    this.websocketGateway.server.to(conquestId).emit('NodeUpdated', {
      status: 'ok',
      conquestState,
    });
  }
}
