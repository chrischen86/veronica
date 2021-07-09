import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { NodeClearedEvent } from '../../shared/events/node-cleared.event';
import { StatsService } from '../stats.service';

@EventsHandler(NodeClearedEvent)
export class NodeClearedEventStatsHandler
  implements IEventHandler<NodeClearedEvent>
{
  constructor(private readonly service: StatsService) {}

  async handle(event: NodeClearedEvent) {
    console.log('NodeClearedEvent Socket Handler...');
    const { context } = event;
    if (context === undefined) {
      return;
    }

    const { ownerId, ownerName, allianceId, allianceName } = context;
    this.service.updateStats(
      ownerId,
      ownerName,
      allianceId,
      allianceName,
      false,
    );
  }
}
