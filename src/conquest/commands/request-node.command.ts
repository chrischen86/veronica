import { Context } from '../../shared/interfaces/context.interface';

export default class RequestNodeCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zoneId: string,
    public readonly nodeId: string,
    public readonly ownerId: string,
    public readonly ownerName: string,
    public readonly context?: Context,
  ) {}
}
