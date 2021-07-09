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
import { Node, NodeStatus } from '../../conquest/interfaces/conquest.interface';
import { NodeRepository } from '../repository/node.repository';
import { parseNode } from './conquests-items.parser';
import { DynamoDbService } from './dynamodb.service';
import { marshallNode, marshallNodeKey } from './marshall/node.marshall';
import Schema from './schema.defintions';

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
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST` },
        ':sk': { S: `CONQUEST#${conquestId}#PHASE#${phaseId}#ZONE#${zoneId}` },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
        '#sk': Schema.Keys.SK,
      },
      TableName: Schema.Table.Name,
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
      KeyConditionExpression: '#pk = :pk AND #sk = :sk',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST` },
        ':sk': {
          S: `CONQUEST#${conquestId}#PHASE#${phaseId}#ZONE#${zoneId}#NODE#${id}`,
        },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
        '#sk': Schema.Keys.SK,
      },
      TableName: Schema.Table.Name,
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const nodes = parseNode(zoneId, data.Items);
    return nodes.length > 0 ? nodes[0] : null;
  }

  async create(conquestId: string, phaseId: string, node: Node): Promise<Node> {
    const item = marshallNode(conquestId, phaseId, node);
    const params: PutItemCommandInput = {
      TableName: Schema.Table.Name,
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
      const nowString = new Date().toISOString();
      updateExpression.push(
        '#ownerId = :ownerId, #gsi1pk = :gsi1pk, #gsi1sk = :gsi1sk',
      );
      expressionAttributeNames = {
        ...expressionAttributeNames,
        '#ownerId': 'ownerId',
        '#gsi1pk': Schema.Keys.GSI1PK,
        '#gsi1sk': Schema.Keys.GSI1SK,
      };
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ':ownerId': ownerId,
        ':gsi1pk': `USERATTACK#${ownerId}`,
        ':gsi1sk': `${nowString}`,
      };
    }
    if (updateExpression.length <= 0) {
      return;
    }

    const params: UpdateItemCommandInput = {
      TableName: Schema.Table.Name,
      Key: key,
      UpdateExpression: `set ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    };
    await this.service.client.send(new UpdateItemCommand(params));
  }

  async clearOwner(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeId: string,
  ) {
    const key = marshallNodeKey(conquestId, phaseId, zoneId, nodeId);
    const params: UpdateItemCommandInput = {
      TableName: Schema.Table.Name,
      Key: key,
      UpdateExpression: `remove ownerId, ownerName, ${Schema.Keys.GSI1PK}, ${Schema.Keys.GSI1SK}`,
    };
    await this.service.client.send(new UpdateItemCommand(params));
  }

  async requestNode(
    conquestId: string,
    phaseId: string,
    zoneId: string,
    nodeId: string,
    ownerId: string,
    ownerName: string,
  ) {
    const key = marshallNodeKey(conquestId, phaseId, zoneId, nodeId);
    const nowString = new Date().toISOString();
    const params: UpdateItemCommandInput = {
      TableName: Schema.Table.Name,
      Key: key,
      UpdateExpression: `set #ownerId = :ownerId, #ownerName = :ownerName, #gsi1pk = :gsi1pk, #gsi1sk = :gsi1sk`,
      ExpressionAttributeNames: {
        '#ownerId': 'ownerId',
        '#ownerName': 'ownerName',
        '#gsi1pk': Schema.Keys.GSI1PK,
        '#gsi1sk': Schema.Keys.GSI1SK,
      },
      ExpressionAttributeValues: marshall({
        ':ownerId': ownerId,
        ':ownerName': ownerName,
        ':gsi1pk': `USERATTACK#${ownerId}`,
        ':gsi1sk': `${nowString}`,
      }),
      ConditionExpression: 'attribute_not_exists(#ownerId)',
    };
    await this.service.client.send(new UpdateItemCommand(params));
  }
}
