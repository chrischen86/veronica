export class AllianceCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly allianceName: string,
    public readonly ownerId: string,
    public readonly ownerName: string,
  ) {}
}
