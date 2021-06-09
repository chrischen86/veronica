import { ZoneStatus } from '../interfaces/conquest.interface';

export default class UpdateZoneStatusCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zoneId: string,
    public readonly status: ZoneStatus,
  ) {}
}
