export class NodeUpdatedEvent {
  constructor(
    public readonly conquestId: string,
    public readonly nodeId: string,
  ) {}
}
