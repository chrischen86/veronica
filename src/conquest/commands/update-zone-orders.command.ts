import { ZoneOrders } from '../interfaces/conquest.interface';

export default class UpdateZoneOrdersCommand {
  constructor(
    public readonly conquestId: string,
    public readonly phaseId: string,
    public readonly zoneId: string,
    public readonly orders: ZoneOrders,
  ) {}
}
