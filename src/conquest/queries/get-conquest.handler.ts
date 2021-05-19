import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ConquestRepository } from '../repository/conquest.repository';
import { GetConquestQuery } from './get-conquest.query';

@QueryHandler(GetConquestQuery)
export class GetConquestHandler implements IQueryHandler<GetConquestQuery> {
  constructor(private readonly repository: ConquestRepository) {}

  async execute(query: GetConquestQuery) {
    console.log('Async GetConquestQuery...');
    const { id } = query;
    return this.repository.findOneById(id);
  }
}
