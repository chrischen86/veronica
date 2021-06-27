import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NodeRepository } from '../../dal/repository/node.repository';
import { NodeUpdatedEvent } from '../events/node-updated.event';
import ClearNodeCommand from './clear-node.command';

@CommandHandler(ClearNodeCommand)
export class ClearNodeHandler implements ICommandHandler<ClearNodeCommand> {
  constructor(
    private readonly repository: NodeRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ClearNodeCommand) {
    console.log('ClearNodeCommand...');

    const { conquestId, phaseId, zoneId, nodeId } = command;
    await this.repository.clearOwner(conquestId, phaseId, zoneId, nodeId);
    this.eventBus.publish(new NodeUpdatedEvent(conquestId, nodeId));
  }
}
