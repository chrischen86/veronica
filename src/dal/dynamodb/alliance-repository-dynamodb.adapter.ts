import {
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { Alliance } from '../../alliance/interfaces/alliance.interface';
import { AllianceEntity } from '../entities/alliance.enttity';
import { UserEntity } from '../entities/user.enttity';
import { AllianceRepository } from '../repository/alliance.repository';
import { DynamoDbService } from './dynamodb.service';
import {
  marshallAlliance,
  marshallAllianceKey,
} from './marshall/alliance.marshall';
import Schema from './schema.defintions';

@Injectable()
export class AllianceRepositoryDynamoDbAdapter extends AllianceRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async findAll(maxItems = 100, lastId?: string): Promise<Alliance[]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: `ALLIANCE` },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
      },
      ExclusiveStartKey:
        lastId !== undefined ? marshallAllianceKey(lastId) : undefined,
      TableName: Schema.Table.Name,
    };

    const items = await this.service.query(params, maxItems);
    const alliances = items.map((a) => new AllianceEntity(a));
    return alliances;
  }

  async findOneById(allianceId: string): Promise<Alliance> {
    const params: GetItemCommandInput = {
      TableName: Schema.Table.Name,
      Key: {
        PK: { S: `ALLIANCE` },
        SK: { S: `ALLIANCE#${allianceId}` },
      },
    };
    const data = await this.service.client.send(new GetItemCommand(params));
    const { Item } = data;
    if (Item === undefined) {
      return null;
    }

    const alliance = new AllianceEntity(Item);
    return alliance;
  }

  async create(user: Alliance): Promise<Alliance> {
    const item = marshallAlliance(user);
    const params: PutItemCommandInput = {
      TableName: Schema.Table.Name,
      Item: item,
    };
    await this.service.client.send(new PutItemCommand(params));
    return user;
  }

  async findAllByName(name: string): Promise<Alliance[]> {
    const params: QueryCommandInput = {
      IndexName: Schema.Indexes.GSI1,
      KeyConditionExpression: '#gsi1pk = :pk AND begins_with(#gsi1sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `ALLIANCE` },
        ':sk': { S: `NAME#${name}` },
      },
      ExpressionAttributeNames: {
        '#gsi1pk': Schema.Keys.GSI1PK,
        '#gsi1sk': Schema.Keys.GSI1SK,
      },
      TableName: Schema.Table.Name,
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const alliances = data.Items.map((a) => new AllianceEntity(a));
    return alliances;
  }

  async findOneByIdIncludeMembers(allianceId: string): Promise<Alliance> {
    const params: QueryCommandInput = {
      IndexName: Schema.Indexes.GSI2,
      KeyConditionExpression: '#gsi2pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: `ALLIANCE#${allianceId}` },
      },
      ExpressionAttributeNames: {
        '#gsi2pk': Schema.Keys.GSI2PK,
      },
      TableName: Schema.Table.Name,
    };

    const data = await this.service.client.send(new QueryCommand(params));
    let alliance: AllianceEntity;
    const members: UserEntity[] = [];
    console.log(data.Items);
    data.Items.forEach((i) => {
      if (i[Schema.Keys.GSI2SK].S.startsWith('USERNAME#')) {
        members.push(new UserEntity(i));
      } else if (i[Schema.Keys.GSI2SK].S.startsWith('NAME#')) {
        alliance = new AllianceEntity(i);
      }
    });
    if (alliance === undefined) {
      return null;
    }
    alliance.members = members;
    return alliance;
  }
}
