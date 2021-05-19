export default class SetupConquestCommand {
  constructor(
    public readonly allianceId: string,
    public readonly to: Date,
    public readonly from: Date,
  ) {}
}
