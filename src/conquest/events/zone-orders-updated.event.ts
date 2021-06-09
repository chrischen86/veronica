export class ZoneOrdersUpdatedEvent {
  constructor(
    public readonly conquestId: string,
    public readonly zoneId: string,
  ) {}
}
