import { ZoneOrders } from 'src/conquest/interfaces/conquest.interface';

export interface UpdateZoneOrdersDto {
  conquestId: string;
  phaseId: string;
  zoneId: string;
  orders: ZoneOrders;
}
