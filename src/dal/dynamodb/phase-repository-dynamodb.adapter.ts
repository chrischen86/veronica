import {
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { Phase } from '../../conquest/interfaces/conquest.interface';
import { PhaseRepository } from '../repository/phase.repository';
import { parsePhase } from './conquests-items.parser';
import { DynamoDbService } from './dynamodb.service';
import { marshallPhase } from './marshall/phase.marshall';
import Schema from './schema.defintions';

@Injectable()
export class PhaseRepositoryDynamoDbAdapter extends PhaseRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async findAllOnConquest(conquestId: string): Promise<Phase[]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST` },
        ':sk': { S: `CONQUEST#${conquestId}#PHASE#` },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
        '#sk': Schema.Keys.SK,
      },
      TableName: Schema.Table.Name,
    };

    const phases = await this.service.client.send(new QueryCommand(params));
    const phaseList = parsePhase(conquestId, phases.Items);
    return phaseList;
  }

  async findOneOnConquestById(conquestId: string, id: string): Promise<Phase> {
    const params: QueryCommandInput = {
      KeyConditionExpression: '#pk = :pk AND #sk = :sk',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST` },
        ':sk': { S: `CONQUEST#${conquestId}#PHASE#${id}#NULL` },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
        '#sk': Schema.Keys.SK,
      },
      TableName: Schema.Table.Name,
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const phases = parsePhase(conquestId, data.Items);
    return phases.length > 0 ? phases[0] : undefined;
  }

  async create(phase: Phase): Promise<Phase> {
    const item = marshallPhase(phase);
    const params: PutItemCommandInput = {
      TableName: Schema.Table.Name,
      Item: item,
    };
    await this.service.client.send(new PutItemCommand(params));
    return phase;
  }
}
