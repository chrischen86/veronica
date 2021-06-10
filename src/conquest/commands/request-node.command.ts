export default class RequestNodeCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zoneId: string,
    public readonly nodeId: string,
    public readonly ownerId: string,
  ) {}
}
