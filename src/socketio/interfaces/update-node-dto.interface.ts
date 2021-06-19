import { NodeStatus } from '../../conquest/interfaces/conquest.interface';

export interface UpdateNodeDto {
  conquestId: string;
  phaseId: string;
  zoneId: string;
  nodeId: string;
  status?: NodeStatus;
  ownerId?: string;
}
