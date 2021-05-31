import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Node } from '../interfaces/conquest.interface';
import { NodeRepository } from '../repository/node.repository';
import { ListNodesQuery } from './list-nodes.query';

@QueryHandler(ListNodesQuery)
export class ListNodesHandler implements IQueryHandler<ListNodesQuery> {
  constructor(private repository: NodeRepository) {}

  async execute(query: ListNodesQuery): Promise<Node[]> {
    const { conquestId, phaseId, zoneId } = query;
    return this.repository.findAllOnZone(conquestId, phaseId, zoneId);
  }
}
