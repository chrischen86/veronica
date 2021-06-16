import { Module } from '@nestjs/common';
import { DynamoDbService } from './dynamodb/dynamodb.service';

@Module({ providers: [DynamoDbService] })
export class DalModule {}
