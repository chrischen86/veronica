export class ZoneInitializedEvent {
  constructor(
    public readonly conquestId: string,
    public readonly zoneId: string,
  ) {}
}
