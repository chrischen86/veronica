import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../dal/repository/user.repository';
import { User } from '../interfaces/user.interface';
import CreateUserCommand from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    const { id, name, allianceId } = command;
    const user: User = {
      id,
      name,
      allianceId,
    };
    await this.repository.create(user);
  }
}
