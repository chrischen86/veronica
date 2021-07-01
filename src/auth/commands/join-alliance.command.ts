export default class JoinAllianceCommand {
  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly allianceId: string,
  ) {}
}
