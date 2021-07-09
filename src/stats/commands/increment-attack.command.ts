export default class IncrementAttackCommand {
  constructor(
    public readonly ownerId: string,
    public readonly ownerName: string,
    public readonly allianceId: string,
    public readonly allianceName: string,
  ) {}
}
