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
import { ZoneController } from './zone.controller';
import { ZoneRepository } from './repository/zone.repository';
import { ZoneRepositoryMemoryAdapter } from './repository/zone-repository-memory.adapter';
import { NodeRepository } from './repository/node.repository';
import { NodeRepositoryMemoryAdapter } from './repository/node-repository-memory.adapter';
import { NodeController } from './node.controller';

@Module({
  imports: [CqrsModule],
  exports: [ConquestService],
  controllers: [
    ConquestController,
    PhaseController,
    ZoneController,
    NodeController,
  ],
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
    {
      provide: ZoneRepository,
      useClass: ZoneRepositoryMemoryAdapter,
    },
    {
      provide: NodeRepository,
      useClass: NodeRepositoryMemoryAdapter,
    },
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    MemoryStore,
  ],
})
export class ConquestModule {}
