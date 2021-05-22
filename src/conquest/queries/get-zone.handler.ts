import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Zone } from '../interfaces/conquest.interface';
import { ZoneRepository } from '../repository/zone.repository';
import { GetZoneQuery } from './get-zone.query';

@QueryHandler(GetZoneQuery)
export class GetZoneHandler implements IQueryHandler<GetZoneQuery> {
  constructor(private repository: ZoneRepository) {}

  async execute(query: GetZoneQuery): Promise<Zone> {
    console.log('Async GetZoneQuery...');
    const { conquestId, phaseId, id } = query;
    return this.repository.findOneOnPhaseById(conquestId, phaseId, id);
  }
}
