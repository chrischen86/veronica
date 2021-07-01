import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AllianceRepository } from '../../dal/repository/alliance.repository';
import { ListAllianceQuery } from './list-alliances.query';

@QueryHandler(ListAllianceQuery)
export class ListAlliancesHandler implements IQueryHandler<ListAllianceQuery> {
  constructor(private readonly repository: AllianceRepository) {}

  async execute(query: ListAllianceQuery) {
    const { limit, lastId } = query;
    return this.repository.findAll(limit, lastId);
  }
}
