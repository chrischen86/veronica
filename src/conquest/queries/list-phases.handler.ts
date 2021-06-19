import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PhaseRepository } from '../../dal/repository/phase.repository';
import { Phase } from '../interfaces/conquest.interface';
import { ListPhasesQuery } from './list-phases.query';

@QueryHandler(ListPhasesQuery)
export class ListPhasesHandler implements IQueryHandler<ListPhasesQuery> {
  constructor(private repository: PhaseRepository) {}

  async execute(query: ListPhasesQuery): Promise<Phase[]> {
    const { conquestId } = query;
    return this.repository.findAllOnConquest(conquestId);
  }
}
