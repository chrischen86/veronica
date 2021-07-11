import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateConquestDto {
  @Type(() => Date)
  @IsDate()
  startDate: Date;
}
