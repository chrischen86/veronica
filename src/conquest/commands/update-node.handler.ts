import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeRepository } from '../repository/node.repository';
import UpdateNodeCommand from './update-node.command';

@CommandHandler(UpdateNodeCommand)
export class UpdateNodeHandler implements ICommandHandler<UpdateNodeCommand> {
  constructor(private readonly repository: NodeRepository) {}

  async execute(command: UpdateNodeCommand) {
    console.log('UpdateNodeCommand...');

    const { conquestId, phaseId, zoneId, nodeId, ownerId, status } = command;
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
  }
}
