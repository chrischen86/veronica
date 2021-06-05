import { NodeStatus } from '../interfaces/conquest.interface';

export default class UpdateNodeCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zoneId: string,
    public readonly nodeId: string,
    public readonly status?: NodeStatus,
    public readonly ownerId?: string,
  ) {}
}
