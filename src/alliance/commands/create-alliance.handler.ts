import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../auth/interfaces/user.interface';
import { AllianceRepository } from '../../dal/repository/alliance.repository';
import { UserRepository } from '../../dal/repository/user.repository';
import { AllianceCreatedEvent } from '../events/alliance-created.event';
import { Alliance } from '../interfaces/alliance.interface';
import CreateAllianceCommand from './create-alliance.command';

@CommandHandler(CreateAllianceCommand)
export class CreateAllianceHandler
  implements ICommandHandler<CreateAllianceCommand>
{
  constructor(
    private readonly repository: AllianceRepository,
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAllianceCommand) {
    const { name, ownerId, ownerName } = command;
    const id = uuidv4();
    const alliance: Alliance = {
      id,
      name,
      ownerId,
      ownerName,
    };
    await this.repository.create(alliance);

    this.eventBus.publish(
      new AllianceCreatedEvent(id, name, ownerId, ownerName),
    );
    //Might be better to do this in a transaction or a saga...
    const user: User = {
      id: ownerId,
      name: ownerName,
      allianceId: id,
    };
    this.userRepository.updateProfile(user);
  }
}
