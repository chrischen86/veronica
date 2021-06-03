export class ConquestCreatedEvent {
  constructor(
    public readonly conquestId: string,
    public readonly to: Date,
    public readonly from: Date,
  ) {}
}
