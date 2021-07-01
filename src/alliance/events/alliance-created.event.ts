export class AllianceCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public readonly ownerName: string,
  ) {}
}
