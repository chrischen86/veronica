export default class UpdateProfileCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly allianceId?: string,
  ) {}
}
