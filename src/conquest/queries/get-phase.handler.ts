import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PhaseRepository } from '../../dal/repository/phase.repository';
import { Phase } from '../interfaces/conquest.interface';
import { GetPhasesQuery } from './get-phase.query';

@QueryHandler(GetPhasesQuery)
export class GetPhaseHandler implements IQueryHandler<GetPhasesQuery> {
  constructor(private repository: PhaseRepository) {}

  async execute(query: GetPhasesQuery): Promise<Phase> {
    console.log('Async GetPhasesQuery...');
    const { conquestId, id } = query;
    return this.repository.findOneOnConquestById(conquestId, id);
  }
}
