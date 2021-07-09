import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../dal/repository/user.repository';
import { User } from '../interfaces/user.interface';
import UpdateProfileCommand from './update-profile.command';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: UpdateProfileCommand) {
    const { id, name, allianceId, allianceName } = command;
    const user: User = {
      id,
      name,
      allianceId,
      allianceName,
    };
    console.log(user);
    await this.repository.updateProfile(user);
  }
}
