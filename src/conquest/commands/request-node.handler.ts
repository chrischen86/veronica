import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NodeUpdatedEvent } from '../events/node-updated.event';
import { NodeRepository } from '../../dal/repository/node.repository';
import RequestNodeCommand from './request-node.command';

@CommandHandler(RequestNodeCommand)
export class RequestNodeHandler implements ICommandHandler<RequestNodeCommand> {
  constructor(
    private readonly repository: NodeRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RequestNodeCommand) {
    console.log('RequestNodeCommand...');
    const { conquestId, phaseId, zoneId, nodeId, ownerId, ownerName } = command;
    if (ownerId === undefined) {
      await this.repository.clearOwner(conquestId, phaseId, zoneId, nodeId);
    } else {
      await this.repository.requestNode(
        conquestId,
        phaseId,
        zoneId,
        nodeId,
        ownerId,
        ownerName,
      );
    }
    this.eventBus.publish(new NodeUpdatedEvent(conquestId, nodeId));
  }
}
