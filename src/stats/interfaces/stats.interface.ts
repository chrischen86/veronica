import { Expose } from 'class-transformer';

export class Stats {
  @Expose()
  id: string;

  @Expose()
  attackDate: Date;

  @Expose()
  attacks: number;

  @Expose()
  ownerId: string;

  @Expose()
  ownerName: string;

  @Expose()
  allianceId: string;

  @Expose()
  allianceName: string;
}
