import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NodeUpdatedEvent } from '../../shared/events/node-updated.event';
import { NodeRepository } from '../../dal/repository/node.repository';
import UpdateNodeCommand from './update-node.command';

@CommandHandler(UpdateNodeCommand)
export class UpdateNodeHandler implements ICommandHandler<UpdateNodeCommand> {
  constructor(
    private readonly repository: NodeRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateNodeCommand) {
    console.log('UpdateNodeCommand...');

    const { conquestId, phaseId, zoneId, nodeId, ownerId, status, context } =
      command;
    const node = await this.repository.findOneOnZoneById(
      conquestId,
      phaseId,
      zoneId,
      nodeId,
    );

    if (node === null) {
      return;
    }

    await this.repository.update(
      conquestId,
      phaseId,
      zoneId,
      nodeId,
      ownerId,
      status,
    );

    this.eventBus.publish(new NodeUpdatedEvent(conquestId, nodeId, context));
  }
}
