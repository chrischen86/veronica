export class ConquestCreatedEvent {
  constructor(
    public readonly conquestId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}
}
