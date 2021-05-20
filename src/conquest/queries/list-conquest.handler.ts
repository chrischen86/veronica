import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Conquest } from '../interfaces/conquest.interface';
import { ConquestRepository } from '../repository/conquest.repository';
import { ListConquestQuery } from './list-conquest.query';

@QueryHandler(ListConquestQuery)
export class ListConquestHandler implements IQueryHandler<ListConquestQuery> {
  constructor(private repository: ConquestRepository) {}

  async execute(): Promise<Conquest[]> {
    console.log('Async ListConquestQuery');
    return this.repository.findAll();
  }
}
