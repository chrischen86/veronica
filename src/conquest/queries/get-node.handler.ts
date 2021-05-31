import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Node } from '../interfaces/conquest.interface';
import { NodeRepository } from '../repository/node.repository';
import { GetNodeQuery } from './get-node.query';

@QueryHandler(GetNodeQuery)
export class GetNodeHandler implements IQueryHandler<GetNodeQuery> {
  constructor(private repository: NodeRepository) {}

  async execute(query: GetNodeQuery): Promise<Node> {
    console.log('Async GetNodeQuery...');
    const { conquestId, phaseId, zoneId, id } = query;
    return this.repository.findOneOnZoneById(conquestId, phaseId, zoneId, id);
  }
}
