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

@Injectable()
export class PhaseRepositoryDynamoDbAdapter extends PhaseRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async findAllOnConquest(conquestId: string): Promise<Phase[]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST#${conquestId}` },
        ':sk': { S: 'PHASE#' },
      },
      TableName: 'Conquests',
    };

    const phases = await this.service.client.send(new QueryCommand(params));
    const phaseList = parsePhase(conquestId, phases.Items);
    return phaseList;
  }

  async findOneOnConquestById(conquestId: string, id: string): Promise<Phase> {
    const params: QueryCommandInput = {
      KeyConditionExpression: 'PK = :pk AND SK =:sk',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST#${conquestId}` },
        ':sk': { S: `PHASE#${id}#NULL` },
      },
      TableName: 'Conquests',
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const phases = parsePhase(conquestId, data.Items);
    return phases.length > 0 ? phases[0] : undefined;
  }

  async create(phase: Phase): Promise<Phase> {
    const item = marshallPhase(phase);
    const params: PutItemCommandInput = {
      TableName: 'Conquests',
      Item: item,
    };
    await this.service.client.send(new PutItemCommand(params));
    return phase;
  }
}
