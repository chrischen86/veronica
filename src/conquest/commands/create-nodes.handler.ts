import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { ZoneInitializedEvent } from '../events/zone-initialized.event';
import { Node, NodeStatus } from '../interfaces/conquest.interface';
import { NodeRepository } from '../repository/node.repository';
import CreateNodesCommand from './create-nodes.command';

@CommandHandler(CreateNodesCommand)
export class CreateNodesHandler implements ICommandHandler<CreateNodesCommand> {
  constructor(
    private readonly repository: NodeRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateNodesCommand) {
    console.log('CreateNodesCommand...');

    const { conquestId, phaseId, zoneId, nodes, holds } = command;

    await Promise.all(
      nodes.map(async (n) => {
        const node: Node = {
          id: uuidv4(),
          zoneId,
          number: n,
          status: holds.indexOf(n) >= 0 ? NodeStatus.HOLD : NodeStatus.OPEN,
          ownerId: undefined,
        };
        await this.repository.create(conquestId, phaseId, node);
      }),
    );

    this.eventBus.publish(new ZoneInitializedEvent(conquestId, zoneId));
  }
}
