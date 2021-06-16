import { Module } from '@nestjs/common';
import { ConquestRepositoryDynamoDbAdapter } from './dynamodb/conquest-repository-dynamodb.adapter';
import { DynamoDbService } from './dynamodb/dynamodb.service';
import { ConquestRepository } from './repository/conquest.repository';

@Module({
  providers: [
    DynamoDbService,
    {
      provide: ConquestRepository,
      useClass: ConquestRepositoryDynamoDbAdapter,
    },
  ],
  exports: [ConquestRepository],
})
export class DalModule {}
