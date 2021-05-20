import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Phase } from '../interfaces/conquest.interface';
import { PhaseRepository } from '../repository/phase.repository';
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
