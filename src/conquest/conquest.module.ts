import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConquestService } from './conquest.service';
import { ConquestController } from './conquest.controller';
import { ConquestRepositoryMemoryAdapter } from './repository/conquest-repository-memory.adapter';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { ConquestRepository } from './repository/conquest.repository';
import MemoryStore from './repository/memory.store';
import { PhaseRepository } from './repository/phase.repository';
import { PhaseRepositoryMemoryAdapter } from './repository/phase-repository-memory.adapter';
import { PhaseController } from './phase.controller';

@Module({
  imports: [CqrsModule],
  exports: [ConquestService],
  controllers: [ConquestController, PhaseController],
  providers: [
    ConquestService,
    {
      provide: ConquestRepository,
      useClass: ConquestRepositoryMemoryAdapter,
    },
    {
      provide: PhaseRepository,
      useClass: PhaseRepositoryMemoryAdapter,
    },
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    MemoryStore,
  ],
})
export class ConquestModule {}
