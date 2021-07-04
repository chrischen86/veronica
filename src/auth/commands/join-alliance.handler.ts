import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../dal/repository/user.repository';
import { User } from '../interfaces/user.interface';
import JoinAllianceCommand from './join-alliance.command';

@CommandHandler(JoinAllianceCommand)
export class JoinAllianceHandler
  implements ICommandHandler<JoinAllianceCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: JoinAllianceCommand) {
    const { userId: id, userName: name, allianceId, allianceName } = command;
    const user: User = {
      id,
      name,
      allianceId,
      allianceName,
    };

    await this.repository.joinAlliance(user);
  }
}
