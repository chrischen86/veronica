export default class CreateZoneCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zone: number,
  ) {}
}
