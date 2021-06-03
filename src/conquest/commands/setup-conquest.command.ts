export default class SetupConquestCommand {
  constructor(
    public readonly allianceId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}
}
