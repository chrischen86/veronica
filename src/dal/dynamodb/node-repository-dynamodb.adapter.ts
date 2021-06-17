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
import { UpdateZoneDto } from 'src/conquest/interfaces/update-zone-dto.interface';
import { NodeRepository } from 'src/conquest/repository/node.repository';
import { ZoneRepository } from 'src/conquest/repository/zone.repository';
import {
  Node,
  NodeStatus,
  Zone,
} from '../../conquest/interfaces/conquest.interface';
import { parseNode, parseZone } from './conquests-items.parser';
import { DynamoDbService } from './dynamodb.service';
import { marshallNode, marshallNodeKey } from './marshall/node.marshall';
import { marshallZone, marshallZoneKey } from './marshall/zone.marshall';

@Injectable()
export class NodeRepositoryDynamoDbAdapter extends NodeRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async findAllOnZone(
    conquestId: string,
    phaseId: string,
    zoneId: string,
  ): Promise<Node[]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST#${conquestId}` },
        ':sk': { S: `PHASE#${phaseId}#ZONE#${zoneId}` },
      },
      TableName: 'Conquests',
    };

    const zones = await this.service.client.send(new QueryCommand(params));
    const zoneList = parseNode(zoneId, zones.Items);
    return zoneList;
  }

  async findOneOnZoneById(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    id: string,
  ): Promise<Node> {
    const params: QueryCommandInput = {
      KeyConditionExpression: 'PK = :pk AND SK =:sk',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST#${conquestId}` },
        ':sk': { S: `PHASE#${phaseId}#ZONE#${zoneId}#NODE#${id}` },
      },
      TableName: 'Conquests',
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const nodes = parseNode(zoneId, data.Items);
    return nodes.length > 0 ? nodes[0] : undefined;
  }

  async create(conquestId: string, phaseId: string, node: Node): Promise<Node> {
    const item = marshallNode(conquestId, phaseId, node);
    const params: PutItemCommandInput = {
      TableName: 'Conquests',
      Item: item,
    };
    await this.service.client.send(new PutItemCommand(params));
    return node;
  }

  async update(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeId: string,
    ownerId?: string,
    status?: NodeStatus,
  ) {
    const key = marshallNodeKey(conquestId, phaseId, zoneId, nodeId);
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
    if (ownerId !== undefined) {
      updateExpression.push('#ownerId = :ownerId');
      expressionAttributeNames = {
        ...expressionAttributeNames,
        '#ownerId': 'ownerId',
      };
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ':ownerId': ownerId,
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
