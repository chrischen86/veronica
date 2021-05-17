import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConquestService } from './conquest.service';
import { ConquestController } from './conquest.controller';
import { ConquestRepository } from './repository/conquest.repository';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';

@Module({
  imports: [CqrsModule],
  controllers: [ConquestController],
  providers: [
    ConquestService,
    ConquestRepository,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class ConquestModule {}
