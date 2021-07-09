import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NodeRepository } from '../../dal/repository/node.repository';
import { NodeClearedEvent } from '../../shared/events/node-cleared.event';
import { NodeUpdatedEvent } from '../../shared/events/node-updated.event';
import { Context } from '../../shared/interfaces/context.interface';
import ClearNodeCommand from './clear-node.command';

@CommandHandler(ClearNodeCommand)
export class ClearNodeHandler implements ICommandHandler<ClearNodeCommand> {
  constructor(
    private readonly repository: NodeRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ClearNodeCommand) {
    console.log('ClearNodeCommand...');

    const { conquestId, phaseId, zoneId, nodeId, context } = command;
    const nodeToClear = await this.repository.findOneOnZoneById(
      conquestId,
      phaseId,
      zoneId,
      nodeId,
    );

    await this.repository.clearOwner(conquestId, phaseId, zoneId, nodeId);

    const { ownerId, ownerName } = nodeToClear;
    const { allianceId, allianceName } = context;
    const removedUserContext = new Context(
      ownerId,
      ownerName,
      allianceId,
      allianceName,
    );
    this.eventBus.publish(
      new NodeClearedEvent(conquestId, nodeId, removedUserContext),
    );
  }
}
