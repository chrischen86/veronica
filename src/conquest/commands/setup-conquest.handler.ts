import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConquestCreatedEvent } from '../events/conquest-created.event';
import { Conquest } from '../interfaces/conquest.interface';
import { ConquestRepository } from '../repository/conquest.repository';
import SetupConquestCommand from './setup-conquest.command';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(SetupConquestCommand)
export class SetupConquestHandler
  implements ICommandHandler<SetupConquestCommand>
{
  constructor(
    private readonly repository: ConquestRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SetupConquestCommand) {
    console.log('CreateConquestCommand...');
    const { to, from, allianceId } = command;

    const conquest: Conquest = {
      id: uuidv4(),
      allianceId,
      to,
      from,
      phases: [],
    };

    await this.repository.create(conquest);
    this.eventBus.publish(new ConquestCreatedEvent(conquest.id));
  }
}
