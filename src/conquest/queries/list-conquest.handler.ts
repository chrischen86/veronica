import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ConquestRepository } from '../../dal/repository/conquest.repository';
import { Conquest } from '../interfaces/conquest.interface';
import { ListConquestQuery } from './list-conquest.query';

@QueryHandler(ListConquestQuery)
export class ListConquestHandler implements IQueryHandler<ListConquestQuery> {
  constructor(private repository: ConquestRepository) {}

  async execute(): Promise<Conquest[]> {
    console.log('Async ListConquestQuery');
    return this.repository.findAll();
  }
}
