import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import DecrementAttackCommand from './commands/decrement-attack.command';
import IncrementAttackCommand from './commands/increment-attack.command';
import { Stats } from './interfaces/stats.interface';
import { ListUserStatsQuery } from './queries/list-user-stats.query';

@Injectable()
export class StatsService {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async updateStats(
    ownerId: string,
    ownerName: string,
    allianceId: string,
    allianceName: string,
    isIncrement = true,
  ) {
    return this.commandBus.execute(
      isIncrement
        ? new IncrementAttackCommand(
            ownerId,
            ownerName,
            allianceId,
            allianceName,
          )
        : new DecrementAttackCommand(
            ownerId,
            ownerName,
            allianceId,
            allianceName,
          ),
    );
  }

  async findAllUserStats(userId: string): Promise<Stats[]> {
    return this.queryBus.execute(new ListUserStatsQuery(userId));
  }

  async findAllUserStatsByDate(
    userId: string,
    startDate: Date,
  ): Promise<Stats[]> {
    return this.queryBus.execute(new ListUserStatsQuery(userId));
  }

  async findAllianceStats(allianceId: string): Promise<Stats[]> {
    return this.queryBus.execute(new ListUserStatsQuery(allianceId));
  }
}
