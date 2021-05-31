import { NodeStatus } from '../interfaces/conquest.interface';

export default class CreateNodeCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zoneId: string,
    public readonly nodeNumber: number,
    public readonly ownerId: string,
    public readonly status: NodeStatus,
  ) {}
}
