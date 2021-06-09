import { ZoneOrders, ZoneStatus } from './conquest.interface';

export interface UpdateZoneDto {
  conquestId: string;
  phaseId: string;
  zoneId: string;
  orders?: ZoneOrders;
  status?: ZoneStatus;
}
