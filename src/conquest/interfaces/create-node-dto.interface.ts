import { NodeStatus } from './conquest.interface';

export interface CreateNodeDto {
  zoneId: string;
  node: number;
  ownerId: string;
  status: NodeStatus;
}
