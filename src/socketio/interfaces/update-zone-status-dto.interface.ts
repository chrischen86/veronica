import { ZoneStatus } from '../../conquest/interfaces/conquest.interface';

export interface UpdateZoneStatusDto {
  conquestId: string;
  phaseId: string;
  zoneId: string;
  status: ZoneStatus;
}
