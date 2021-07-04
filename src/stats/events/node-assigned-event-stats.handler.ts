import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { NodeAssignedEvent } from '../../shared/events/node-assigned.event';
import { StatsService } from '../stats.service';

@EventsHandler(NodeAssignedEvent)
export class NodeAssignedEventStatsHandler
  implements IEventHandler<NodeAssignedEvent>
{
  constructor(private readonly service: StatsService) {}

  async handle(event: NodeAssignedEvent) {
    console.log('NodeAssignedEvent Socket Handler...');
    const { context } = event;
    if (context === undefined) {
      return;
    }
    console.log('updating stats');
    const { ownerId, ownerName, allianceId, allianceName } = context;
    this.service.updateStats(ownerId, ownerName, allianceId, allianceName);
  }
}
