import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import CreateAllianceCommand from './commands/create-alliance.command';
import { CreateAllianceDto } from './dtos/create-alliance.dto.';
import { Alliance } from './interfaces/alliance.interface';
import { GetAllianceWithMembersQuery } from './queries/get-alliance-with-members.query';
import { GetAllianceQuery } from './queries/get-alliance.query';
import { ListAllianceQuery } from './queries/list-alliances.query';

@Injectable()
export class AllianceService {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async findAll(limit = 25, lastId?: string): Promise<Alliance> {
    return this.queryBus.execute(new ListAllianceQuery(limit, lastId));
  }

  async findOneAlliance(
    allianceId: string,
    includeMembers = false,
  ): Promise<Alliance> {
    return this.queryBus.execute(
      includeMembers
        ? new GetAllianceWithMembersQuery(allianceId)
        : new GetAllianceQuery(allianceId),
    );
  }

  async createAlliance(dto: CreateAllianceDto) {
    const { name, ownerId, ownerName } = dto;
    return this.commandBus.execute(
      new CreateAllianceCommand(name, ownerId, ownerName),
    );
  }
}
