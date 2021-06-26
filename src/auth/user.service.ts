import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import CreateUserCommand from './commands/create-user.command';
import { CreateUserDto } from './interfaces/create-user-dto.interface';
import { User } from './interfaces/user.interface';
import { GetUserQuery } from './queries/get-user.query';

@Injectable()
export class UserService {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async findOneUser(userId: string): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(userId));
  }

  async createUser(userDto: CreateUserDto) {
    const { id, name, allianceId } = userDto;
    return this.commandBus.execute(new CreateUserCommand(id, name, allianceId));
  }
}
