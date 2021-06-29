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
import { UserRepository } from './repository/user.repository';
import { UserRepositoryDynamoDbAdapter } from './dynamodb/user-repository-dynamodb.adapter';
import { AllianceRepository } from './repository/alliance.repository';
import { AllianceRepositoryDynamoDbAdapter } from './dynamodb/alliance-repository-dynamodb.adapter';

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
    {
      provide: UserRepository,
      useClass: UserRepositoryDynamoDbAdapter,
    },
    {
      provide: AllianceRepository,
      useClass: AllianceRepositoryDynamoDbAdapter,
    },
    MemoryStore,
  ],
  exports: [
    ConquestRepository,
    PhaseRepository,
    ZoneRepository,
    NodeRepository,
    UserRepository,
    AllianceRepository,
  ],
})
export class DalModule {}
