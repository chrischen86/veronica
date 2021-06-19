import { Node, NodeStatus } from '../../conquest/interfaces/conquest.interface';

export abstract class NodeRepository {
  abstract findAllOnZone(
    conquestId: string,
    phaseId: string,
    zoneId: string,
  ): Promise<Node[]>;
  abstract findOneOnZoneById(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    id: string,
  ): Promise<Node>;
  abstract create(
    conquestId: string,
    phaseId: string,
    node: Node,
  ): Promise<Node>;
  abstract update(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeId: string,
    ownerId?: string,
    status?: NodeStatus,
  );
  abstract clearOwner(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeId: string,
  );
}
