import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ConquestRepository } from '../../dal/repository/conquest.repository';
import { GetActiveConquestQuery } from './get-active-conquest.query';

@QueryHandler(GetActiveConquestQuery)
export class GetActiveConquestHandler
  implements IQueryHandler<GetActiveConquestQuery>
{
  constructor(private readonly repository: ConquestRepository) {}

  async execute(query: GetActiveConquestQuery) {
    const { allianceId, start, end } = query;
    console.log(`GetActiveConquestQuery... for ${allianceId}:${start}-${end}`);
    return this.repository.findByQuery(allianceId, start, end);
  }
}
