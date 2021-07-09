import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStatsDto {
  @IsString()
  id: string;

  @IsString()
  allianceId: string;

  @IsString()
  allianceName: string;

  @IsString()
  ownerId: string;

  @IsString()
  ownerName: string;

  @Type(() => Date)
  @IsDate()
  attackDate: Date;
}
