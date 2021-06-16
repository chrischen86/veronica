import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DalModule } from 'src/dal/dal.module';
import { CommandHandlers } from './commands';
import { ConquestController } from './conquest.controller';
import { ConquestService } from './conquest.service';
import { EventHandlers } from './events';
import { NodeController } from './node.controller';
import { PhaseController } from './phase.controller';
import { QueryHandlers } from './queries';
import MemoryStore from './repository/memory.store';
import { NodeRepositoryMemoryAdapter } from './repository/node-repository-memory.adapter';
import { NodeRepository } from './repository/node.repository';
import { PhaseRepositoryMemoryAdapter } from './repository/phase-repository-memory.adapter';
import { PhaseRepository } from './repository/phase.repository';
import { ZoneRepositoryMemoryAdapter } from './repository/zone-repository-memory.adapter';
import { ZoneRepository } from './repository/zone.repository';
import { ConquestSagas } from './sagas/conquest.sagas';
import { ZoneController } from './zone.controller';

@Module({
  imports: [CqrsModule, DalModule],
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
    ConquestSagas,
  ],
})
export class ConquestModule {}
