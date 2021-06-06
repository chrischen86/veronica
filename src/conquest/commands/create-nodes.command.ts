export default class CreateNodesCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zoneId: string,
    public readonly nodes: number[],
    public readonly holds?: number[],
  ) {}
}
