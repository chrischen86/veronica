import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import CreateUserCommand from './commands/create-user.command';
import JoinAllianceCommand from './commands/join-alliance.command';
import UpdateProfileCommand from './commands/update-profile.command';
import { CreateUserDto } from './interfaces/create-user-dto.interface';
import { JoinAllianceDto } from './interfaces/join-alliance-dto.interface';
import { UpdateProfileDto } from './interfaces/update-profile-dto.interface';
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
    const { id, name, allianceId, allianceName } = userDto;
    return this.commandBus.execute(
      new CreateUserCommand(id, name, allianceId, allianceName),
    );
  }

  async updateProfile(updateProfileDto: UpdateProfileDto) {
    const { id, name, allianceId } = updateProfileDto;
    return this.commandBus.execute(
      new UpdateProfileCommand(id, name, allianceId),
    );
  }

  async joinAlliance(dto: JoinAllianceDto) {
    const { userId, userName, allianceId, allianceName } = dto;
    console.log(dto);
    return this.commandBus.execute(
      new JoinAllianceCommand(userId, userName, allianceId, allianceName),
    );
  }
}
