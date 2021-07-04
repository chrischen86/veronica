import { Context } from '../../shared/interfaces/context.interface';

export default class ClearNodeCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zoneId: string,
    public readonly nodeId: string,
    public readonly context?: Context,
  ) {}
}
