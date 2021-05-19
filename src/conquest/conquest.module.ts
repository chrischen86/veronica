import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConquestService } from './conquest.service';
import { ConquestController } from './conquest.controller';
import { ConquestRepositoryMemoryAdapter } from './repository/conquest-repository-memory.adapter';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { ConquestRepository } from './repository/conquest.repository';

@Module({
  imports: [CqrsModule],
  exports: [ConquestService],
  controllers: [ConquestController],
  providers: [
    ConquestService,
    {
      provide: ConquestRepository,
      useClass: ConquestRepositoryMemoryAdapter,
    },
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class ConquestModule {}
