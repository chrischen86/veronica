import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Phase } from '../interfaces/conquest.interface';
import { PhaseRepository } from '../repository/phase.repository';
import { ListPhasesQuery } from './list-phases.query';

@QueryHandler(ListPhasesQuery)
export class ListPhasesHandler implements IQueryHandler<ListPhasesQuery> {
  constructor(private repository: PhaseRepository) {}

  async execute(query: ListPhasesQuery): Promise<Phase[]> {
    const { conquestId } = query;
    return this.repository.findAllOnConquest(conquestId);
  }
}
