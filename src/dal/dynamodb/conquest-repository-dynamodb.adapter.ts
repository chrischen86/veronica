import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { Conquest } from '../../conquest/interfaces/conquest.interface';
import { ConquestRepository } from '../../conquest/repository/conquest.repository';
import { parse } from './conquests-items.parser';
import { DynamoDbService } from './dynamodb.service';
import {
  marshallConquest,
  marshallConquestKey,
} from './marshall/conquest.marshall';

@Injectable()
export class ConquestRepositoryDynamoDbAdapter extends ConquestRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async findAll(): Promise<Conquest[]> {
    const params: QueryCommandInput = {
      IndexName: 'AllianceIndex',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: 'ALLIANCE#alphaflight' },
      },
      ScanIndexForward: false,
      TableName: 'Conquests',
    };

    const conquests = await this.service.client.send(new QueryCommand(params));
    const conquestsList = parse(conquests.Items);
    return conquestsList;
  }

  async findOneById(id: string): Promise<Conquest> {
    const params: QueryCommandInput = {
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST#${id}` },
      },
      TableName: 'Conquests',
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const conquests = parse(data.Items);
    return conquests[0];
  }

  async create(conquest: Conquest): Promise<Conquest> {
    const item = marshallConquest(conquest);
    const params: PutItemCommandInput = {
      TableName: 'Conquests',
      Item: item,
    };
    await this.service.client.send(new PutItemCommand(params));
    return conquest;
  }

  async delete(conquestId: string) {
    const key = marshallConquestKey(conquestId);
    const params: DeleteItemCommandInput = {
      TableName: 'Conquests',
      Key: key,
    };
    await this.service.client.send(new DeleteItemCommand(params));
    return true;
  }
}
