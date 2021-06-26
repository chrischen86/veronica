import {
  AttributeValue,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from '@nestjs/common';
import { User } from '../../auth/interfaces/user.interface';
import { UserRepository } from '../repository/user.repository';
import { DynamoDbService } from './dynamodb.service';
import { marshallUser, marshallUserKey } from './marshall/user.marshall';
import Schema from './schema.defintions';

@Injectable()
export class UserRepositoryDynamoDbAdapter extends UserRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async findAll(): Promise<User[]> {
    const params: QueryCommandInput = {
      ExpressionAttributeValues: {
        ':pk': { S: `USER` },
      },
      TableName: Schema.Table.Name,
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const users = this.parseUsers(data.Items);
    return users;
  }

  async findOneById(userId: string): Promise<User> {
    const params: GetItemCommandInput = {
      TableName: Schema.Table.Name,
      Key: {
        PK: { S: `USER` },
        SK: { S: `USER#${userId}` },
      },
    };

    const data = await this.service.client.send(new GetItemCommand(params));
    const users = this.parseUsers([data.Item]);
    return users[0];
  }

  async create(user: User): Promise<User> {
    const item = marshallUser(user);
    const params: PutItemCommandInput = {
      TableName: Schema.Table.Name,
      Item: item,
    };
    await this.service.client.send(new PutItemCommand(params));
    return user;
  }

  async joinAlliance(user: User) {
    const { id, name, allianceId } = user;
    if (allianceId === undefined) {
      return;
    }

    const key = marshallUserKey(id);
    const updateExpression = [
      '#allianceId = :allianceId',
      '#gsi2pk = :gsi2pk',
      '#gsi2sk = :gsi2sk',
    ];
    const expressionAttributeNames = {
      '#allianceId': 'allianceId',
      '#gsi2pk': Schema.Keys.GSI2PK,
      '#gsi2sk': Schema.Keys.GSI2SK,
    };
    const expressionAttributeValues = {
      ':allianceId': allianceId,
      ':gsi2pk': `ALLIANCE#${allianceId}`,
      ':gsi2sk': `USER#${name}`,
    };

    const params: UpdateItemCommandInput = {
      TableName: Schema.Table.Name,
      Key: key,
      UpdateExpression: `set ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    };
    await this.service.client.send(new UpdateItemCommand(params));
  }

  async findAllByAllianceId(allianceId: string): Promise<User[]> {
    const params: QueryCommandInput = {
      IndexName: Schema.Indexes.GSI2,
      KeyConditionExpression: '#gsi2pk = :pk AND begins_with(#gsi2sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `ALLIANCE#${allianceId}` },
        ':sk': { S: `USER#` },
      },
      ExpressionAttributeNames: {
        '#gsi2pk': Schema.Keys.GSI2PK,
        '#gsi2sk': Schema.Keys.GSI2SK,
      },
      ScanIndexForward: false,
      TableName: Schema.Table.Name,
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const users = this.parseUsers(data.Items);
    return users;
  }

  parseUsers(
    items: {
      [key: string]: AttributeValue;
    }[],
  ): User[] {
    const userArray: User[] = [];

    items.map((r) => {
      const data = unmarshall(r);
      const { id, allianceId, name } = data;
      const conquest: User = {
        id,
        allianceId,
        name,
      };
      userArray.push(conquest);
    });

    return userArray;
  }
}
