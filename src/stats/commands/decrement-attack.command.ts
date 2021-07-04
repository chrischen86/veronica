export default class DecrementAttackCommand {
  constructor(
    public readonly ownerId: string,
    public readonly ownerName: string,
    public readonly allianceId: string,
    public readonly allianceName: string,
  ) {}
}
