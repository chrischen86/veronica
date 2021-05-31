import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { Node } from '../interfaces/conquest.interface';
import { NodeRepository } from '../repository/node.repository';
import CreateNodeCommand from './create-node.command';

@CommandHandler(CreateNodeCommand)
export class CreateNodeHandler implements ICommandHandler<CreateNodeCommand> {
  constructor(private readonly repository: NodeRepository) {}

  async execute(command: CreateNodeCommand) {
    console.log('CreateNodeCommand...');

    const { conquestId, phaseId, zoneId, nodeNumber, ownerId, status } =
      command;
    const node: Node = {
      id: uuidv4(),
      zoneId,
      number: nodeNumber,
      ownerId,
      status,
    };
    await this.repository.create(conquestId, phaseId, node);
  }
}
