import { Module } from '@nestjs/common';
import { ConquestRepositoryDynamoDbAdapter } from './dynamodb/conquest-repository-dynamodb.adapter';
import { DynamoDbService } from './dynamodb/dynamodb.service';
import { NodeRepositoryDynamoDbAdapter } from './dynamodb/node-repository-dynamodb.adapter';
import { PhaseRepositoryDynamoDbAdapter } from './dynamodb/phase-repository-dynamodb.adapter';
import { ZoneRepositoryDynamoDbAdapter } from './dynamodb/zone-repository-dynamodb.adapter';
import { ConquestRepository } from './repository/conquest.repository';
import MemoryStore from './repository/memory.store';
import { NodeRepository } from './repository/node.repository';
import { PhaseRepository } from './repository/phase.repository';
import { ZoneRepository } from './repository/zone.repository';

@Module({
  providers: [
    DynamoDbService,
    {
      provide: ConquestRepository,
      useClass: ConquestRepositoryDynamoDbAdapter,
    },
    {
      provide: PhaseRepository,
      useClass: PhaseRepositoryDynamoDbAdapter,
    },
    {
      provide: ZoneRepository,
      useClass: ZoneRepositoryDynamoDbAdapter,
    },
    {
      provide: NodeRepository,
      useClass: NodeRepositoryDynamoDbAdapter,
    },
    MemoryStore,
  ],
  exports: [
    ConquestRepository,
    PhaseRepository,
    ZoneRepository,
    NodeRepository,
  ],
})
export class DalModule {}
