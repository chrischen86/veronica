import { Zone } from '../interfaces/conquest.interface';

export class ZoneCreatedEvent {
  constructor(
    public readonly conquestId: string,
    public readonly zone: Zone,
    public readonly holds: number[],
  ) {}
}
