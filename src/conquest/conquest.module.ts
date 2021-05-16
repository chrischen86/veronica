import { Module } from '@nestjs/common';
import { ConquestService } from './conquest.service';

@Module({
  providers: [ConquestService],
})
export class ConquestModule {}
