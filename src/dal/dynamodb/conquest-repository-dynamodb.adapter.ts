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
import { ConquestEntity } from '../entities/conquest.entity';
import { ConquestRepository } from '../repository/conquest.repository';
import { parseConquest } from './conquests-items.parser';
import { DynamoDbService } from './dynamodb.service';
import {
  marshallConquest,
  marshallConquestKey,
} from './marshall/conquest.marshall';
import Schema from './schema.defintions';

@Injectable()
export class ConquestRepositoryDynamoDbAdapter extends ConquestRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async findAll(): Promise<Conquest[]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: 'CONQUEST' },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
      },
      TableName: Schema.Table.Name,
    };

    const conquests = await this.service.client.send(new QueryCommand(params));
    const conquestsList = parseConquest(conquests.Items);
    return conquestsList;
  }

  async findAllByAllianceId(allianceId: string): Promise<Conquest[]> {
    const params: QueryCommandInput = {
      IndexName: Schema.Indexes.GSI1,
      KeyConditionExpression: '#gsi1pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: `AC#${allianceId}` },
      },
      ExpressionAttributeNames: {
        '#gsi1pk': Schema.Keys.GSI1PK,
      },
      ScanIndexForward: false,
      TableName: Schema.Table.Name,
    };

    const conquests = await this.service.client.send(new QueryCommand(params));
    const conquestsList = parseConquest(conquests.Items);
    return conquestsList;
  }

  async findByQuery(
    allianceId: string,
    start: string,
    end: string,
  ): Promise<Conquest[]> {
    const params: QueryCommandInput = {
      IndexName: Schema.Indexes.GSI1,
      KeyConditionExpression:
        '#gsi1pk = :pk and #gsi1sk between :start and :end',
      ExpressionAttributeValues: {
        ':pk': { S: `AC#${allianceId}` },
        ':start': { S: start },
        ':end': { S: end },
      },
      ExpressionAttributeNames: {
        '#gsi1pk': Schema.Keys.GSI1PK,
        '#gsi1sk': Schema.Keys.GSI1SK,
      },
      ScanIndexForward: false,
      TableName: Schema.Table.Name,
    };

    const conquests = await this.service.client.send(new QueryCommand(params));
    const conquestsList = conquests.Items.map((i) => new ConquestEntity(i));
    return conquestsList;
  }

  //Returns all related conquest information: Phases, Zones, Nodes
  async findOneById(id: string): Promise<Conquest> {
    const params: QueryCommandInput = {
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `CONQUEST` },
        ':sk': { S: `CONQUEST#${id}` },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
        '#sk': Schema.Keys.SK,
      },
      TableName: Schema.Table.Name,
    };

    const items = await this.service.query(params);
    const conquests = parseConquest(items);
    return conquests.length === 1 ? conquests[0] : null;
  }

  async create(conquest: Conquest): Promise<Conquest> {
    const item = marshallConquest(conquest);
    const params: PutItemCommandInput = {
      TableName: Schema.Table.Name,
      Item: item,
    };
    await this.service.client.send(new PutItemCommand(params));
    return conquest;
  }

  async delete(conquestId: string) {
    const key = marshallConquestKey(conquestId);
    const params: DeleteItemCommandInput = {
      TableName: Schema.Table.Name,
      Key: key,
    };
    await this.service.client.send(new DeleteItemCommand(params));
    return true;
  }
}
