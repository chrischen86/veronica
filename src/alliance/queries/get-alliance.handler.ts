import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AllianceRepository } from '../../dal/repository/alliance.repository';
import { GetAllianceQuery } from './get-alliance.query';

@QueryHandler(GetAllianceQuery)
export class GetAllianceHandler implements IQueryHandler<GetAllianceQuery> {
  constructor(private readonly repository: AllianceRepository) {}

  async execute(query: GetAllianceQuery) {
    const { allianceId } = query;
    return this.repository.findOneById(allianceId);
  }
}
