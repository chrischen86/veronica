import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Zone } from '../interfaces/conquest.interface';
import { ZoneRepository } from '../repository/zone.repository';
import { ListZonesQuery } from './list-zones.query';

@QueryHandler(ListZonesQuery)
export class ListZonesHandler implements IQueryHandler<ListZonesQuery> {
  constructor(private repository: ZoneRepository) {}

  async execute(query: ListZonesQuery): Promise<Zone[]> {
    const { conquestId, phaseId } = query;
    return this.repository.findAllOnPhase(conquestId, phaseId);
  }
}
