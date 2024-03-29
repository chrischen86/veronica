import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConquestOverrideDto {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsString()
  allianceId: string;
}
