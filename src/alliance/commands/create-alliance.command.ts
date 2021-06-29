export default class CreateAllianceCommand {
  constructor(
    public readonly name: string,
    public readonly ownerId: string,
    public readonly ownerName: string,
  ) {}
}
