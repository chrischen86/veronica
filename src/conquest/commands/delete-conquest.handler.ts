import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConquestRepository } from '../repository/conquest.repository';
import DeleteConquestCommand from './delete-conquest.command';

@CommandHandler(DeleteConquestCommand)
export class DeleteConquestHandler
  implements ICommandHandler<DeleteConquestCommand>
{
  constructor(
    private readonly repository: ConquestRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteConquestCommand) {
    console.log('DeleteConquestCommand...');
    const { conquestId } = command;

    await this.repository.delete(conquestId);
  }
}
