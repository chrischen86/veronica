import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StatsRepository } from '../../dal/repository/stats.repository';
import { ListUserStatsQuery } from './list-user-stats.query';

@QueryHandler(ListUserStatsQuery)
export class ListUserStatsHandler implements IQueryHandler<ListUserStatsQuery> {
  constructor(private readonly repository: StatsRepository) {}

  async execute(query: ListUserStatsQuery) {
    const { userId } = query;
    return await this.repository.findAllUserStats(userId);
  }
}
