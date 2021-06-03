export default class SetupPhaseCommand {
  constructor(
    public readonly phase: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly conquestId: string,
  ) {}
}
