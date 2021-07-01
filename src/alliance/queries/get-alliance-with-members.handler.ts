import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AllianceRepository } from '../../dal/repository/alliance.repository';
import { GetAllianceWithMembersQuery } from './get-alliance-with-members.query';

@QueryHandler(GetAllianceWithMembersQuery)
export class GetAllianceWithMembersHandler
  implements IQueryHandler<GetAllianceWithMembersQuery>
{
  constructor(private readonly repository: AllianceRepository) {}

  async execute(query: GetAllianceWithMembersQuery) {
    console.log('GetAllianceWithMembers...');
    const { allianceId } = query;
    return this.repository.findOneByIdIncludeMembers(allianceId);
  }
}
