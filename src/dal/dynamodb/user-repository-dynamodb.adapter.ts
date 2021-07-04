import {
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from '@nestjs/common';
import { User } from '../../auth/interfaces/user.interface';
import { UserEntity } from '../entities/user.enttity';
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

    const users = data.Items.map((u) => new UserEntity(u));
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
    const { Item } = data;
    if (Item === undefined) {
      return null;
    }
    const user = new UserEntity(Item);
    return user;
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
    const { id, name, allianceId, allianceName } = user;
    if (allianceId === undefined || allianceName === undefined) {
      return;
    }

    const key = marshallUserKey(id);
    const {
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    } = this.getUpdateAllianceParams(allianceId, name, allianceName);

    console.log(updateExpression);

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
        ':sk': { S: `USERNAME#` },
      },
      ExpressionAttributeNames: {
        '#gsi2pk': Schema.Keys.GSI2PK,
        '#gsi2sk': Schema.Keys.GSI2SK,
      },
      ScanIndexForward: false,
      TableName: Schema.Table.Name,
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const users = data.Items.map((u) => new UserEntity(u));
    return users;
  }

  async updateProfile(user: User) {
    const { id, name, allianceId, allianceName } = user;
    const key = marshallUserKey(id);
    const updateExpression = [
      '#id = :id',
      '#name = :name',
      '#gsi1pk = :gsi1pk',
      '#gsi1sk = :gsi1sk',
    ];
    let expressionAttributeNames = {
      '#id': 'id',
      '#name': 'name',
      '#gsi1pk': Schema.Keys.GSI1PK,
      '#gsi1sk': Schema.Keys.GSI1SK,
    };
    let expressionAttributeValues = {
      ':id': id,
      ':name': name,
      ':gsi1pk': `USER`,
      ':gsi1sk': `NAME#${name}`,
    };

    if (allianceId !== undefined && allianceName !== undefined) {
      const {
        updateExpression: allianceUpdateExpression,
        expressionAttributeNames: allianceExpressionAttributeNames,
        expressionAttributeValues: allianceExpressionAttributeValues,
      } = this.getUpdateAllianceParams(allianceId, name, allianceName);
      updateExpression.push(...allianceUpdateExpression);
      expressionAttributeNames = {
        ...expressionAttributeNames,
        ...allianceExpressionAttributeNames,
      };
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ...allianceExpressionAttributeValues,
      };
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

  getUpdateAllianceParams(allianceId, name, allianceName) {
    const updateExpression = [
      '#allianceId = :allianceId',
      '#gsi2pk = :gsi2pk',
      '#gsi2sk = :gsi2sk',
      '#allianceName = :allianceName',
    ];
    const expressionAttributeNames = {
      '#allianceId': 'allianceId',
      '#gsi2pk': Schema.Keys.GSI2PK,
      '#gsi2sk': Schema.Keys.GSI2SK,
      '#allianceName': 'allianceName',
    };
    const expressionAttributeValues = {
      ':allianceId': allianceId,
      ':gsi2pk': `ALLIANCE#${allianceId}`,
      ':gsi2sk': `USERNAME#${name}`,
      ':allianceName': allianceName,
    };

    return {
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    };
  }
}
