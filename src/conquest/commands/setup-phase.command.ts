export default class SetupPhaseCommand {
  constructor(
    public readonly phase: number,
    public readonly to: Date,
    public readonly from: Date,
    public readonly conquestId: string,
  ) {}
}
