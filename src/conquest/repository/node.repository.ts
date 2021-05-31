import { Node } from '../interfaces/conquest.interface';

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
}
