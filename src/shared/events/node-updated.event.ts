import { Context } from '../interfaces/context.interface';

export class NodeUpdatedEvent {
  constructor(
    public readonly conquestId: string,
    public readonly nodeId: string,
    public readonly context: Context,
  ) {}
}
