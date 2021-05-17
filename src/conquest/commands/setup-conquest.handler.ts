import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { ConquestCreatedEvent } from '../events/conquest-created.event';
import { Conquest } from '../interfaces/conquest.interface';
import { ConquestRepository } from '../repository/conquest.repository';
import SetupConquestCommand from './setup-conquest.command';

@CommandHandler(SetupConquestCommand)
export class SetupConquestHandler
  implements ICommandHandler<SetupConquestCommand>
{
  constructor(
    private readonly repository: ConquestRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SetupConquestCommand) {
    console.log('SetupConquestCommand...');
    const { to, from } = command;
    // const hero = this.publisher.mergeObjectContext(
    //   await this.repository.findOneById(+heroId),
    // );

    const conquest: Conquest = {
      id: '1',
      to,
      from,
      phases: [],
    };

    await this.repository.saveConquest(conquest);

    this.eventBus.publish(new ConquestCreatedEvent(conquest.id));
  }
}
