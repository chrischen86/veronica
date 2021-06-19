import {
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from '@nestjs/common';
import { UpdateZoneDto } from '../../conquest/interfaces/update-zone-dto.interface';
import { Zone } from '../../conquest/interfaces/conquest.interface';
import { ZoneRepository } from '../repository/zone.repository';
import { parseZone } from './conquests-items.parser';
import { DynamoDbService } from './dynamodb.service';
import { marshallZone, marshallZoneKey } from './marshall/zone.marshall';

@Injectable()
export class ZoneRepositoryDynamoDbAdapter extends ZoneRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async findAllOnPhase(conquestId: string, phaseId: string): Promise<Zone[]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST#${conquestId}` },
        ':sk': { S: `PHASE#${phaseId}#ZONE#` },
      },
      TableName: 'Conquests',
    };

    const zones = await this.service.client.send(new QueryCommand(params));
    const zoneList = parseZone(phaseId, zones.Items);
    return zoneList;
  }

  async findOneOnPhaseById(
    conquestId: string,
    phaseId: string,
    id: string,
  ): Promise<Zone> {
    const params: QueryCommandInput = {
      KeyConditionExpression: 'PK = :pk AND SK =:sk',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST#${conquestId}` },
        ':sk': { S: `PHASE#${phaseId}#ZONE#${id}#NULL` },
      },
      TableName: 'Conquests',
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const zones = parseZone(conquestId, data.Items);
    return zones.length > 0 ? zones[0] : undefined;
  }

  async create(conquestId: string, zone: Zone): Promise<Zone> {
    const item = marshallZone(conquestId, zone);
    const params: PutItemCommandInput = {
      TableName: 'Conquests',
      Item: item,
    };
    await this.service.client.send(new PutItemCommand(params));
    return zone;
  }

  async update(updateZoneDto: UpdateZoneDto) {
    const { conquestId, phaseId, zoneId: id, status, orders } = updateZoneDto;

    const key = marshallZoneKey(conquestId, phaseId, id);
    const updateExpression = [];
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    if (status !== undefined) {
      updateExpression.push('#status = :status');
      expressionAttributeNames = {
        ...expressionAttributeNames,
        '#status': 'status',
      };
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ':status': status,
      };
    }
    if (orders !== undefined) {
      updateExpression.push('#orders = :orders');
      expressionAttributeNames = {
        ...expressionAttributeNames,
        '#orders': 'orders',
      };
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ':orders': orders,
      };
    }
    if (updateExpression.length <= 0) {
      return;
    }

    const params: UpdateItemCommandInput = {
      TableName: 'Conquests',
      Key: key,
      UpdateExpression: `set ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    };
    await this.service.client.send(new UpdateItemCommand(params));
  }
}
