import {
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from '@nestjs/common';
import { UpdateStatsDto } from '../../stats/dtos/update-stats.dto';
import { Stats } from '../../stats/interfaces/stats.interface';
import { StatsEntity } from '../entities/stats.enttity';
import { StatsRepository } from '../repository/stats.repository';
import { DynamoDbService } from './dynamodb.service';
import {
  getAttackDateString,
  marshallStatsKey,
} from './marshall/stats.marshall';
import Schema from './schema.defintions';

@Injectable()
export class StatsRepositoryDynamoDbAdapter extends StatsRepository {
  constructor(private readonly service: DynamoDbService) {
    super();
  }

  async incrementAttack(dto: UpdateStatsDto) {
    const params = this.buildUpdateParams(dto, 1);
    this.service.client.send(new UpdateItemCommand(params));
  }

  async decrementAttack(dto: UpdateStatsDto) {
    const params = this.buildUpdateParams(dto, -1);
    this.service.client.send(new UpdateItemCommand(params));
  }

  async findAllUserStats(ownerId: string): Promise<Stats[]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `STATS` },
        ':sk': { S: `USER#${ownerId}#` },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
        '#sk': Schema.Keys.SK,
      },
      TableName: Schema.Table.Name,
    };

    const items = await this.service.query(params);
    const stats = items.map((s) => new StatsEntity(s));
    return stats;
  }

  async findUserStatsByDate(
    ownerId: string,
    startDate: Date,
  ): Promise<Stats[]> {
    const startDateString = getAttackDateString(startDate);
    const params: QueryCommandInput = {
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `STATS` },
        ':sk': { S: `USER#${ownerId}#DATE#${startDateString}` },
      },
      ExpressionAttributeNames: {
        '#pk': Schema.Keys.PK,
        '#sk': Schema.Keys.SK,
      },
      TableName: Schema.Table.Name,
    };

    const items = await this.service.query(params);
    const stats = items.map((s) => new StatsEntity(s));
    return stats;
  }

  async findAllianceStats(allianceId: string): Promise<Stats[]> {
    const params: QueryCommandInput = {
      IndexName: Schema.Indexes.GSI1,
      KeyConditionExpression: '#gsi1pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: `AS#${allianceId}` },
      },
      ExpressionAttributeNames: {
        '#gsi1pk': Schema.Keys.GSI1PK,
      },
      TableName: Schema.Table.Name,
    };

    const data = await this.service.client.send(new QueryCommand(params));
    const stats = data.Items.map((s) => new StatsEntity(s));
    return stats;
  }

  buildUpdateParams(dto: UpdateStatsDto, count: number) {
    const { id, ownerId, ownerName, allianceName, allianceId, attackDate } =
      dto;
    const attackDateString = getAttackDateString(attackDate);
    const key = marshallStatsKey(ownerId, attackDate);
    const params: UpdateItemCommandInput = {
      TableName: Schema.Table.Name,
      Key: key,
      UpdateExpression: `set #gsi1pk = :gsi1pk, #gsi1sk = :gsi1sk, #id = if_not_exists(#id, :id), #ownerId = :ownerId, #ownerName = :ownerName, #allianceId = :allianceId, #allianceName = :allianceName, #attackDate = :attackDate ADD #attacks :attacks`,
      ExpressionAttributeNames: {
        '#gsi1pk': Schema.Keys.GSI1PK,
        '#gsi1sk': Schema.Keys.GSI1SK,
        '#id': 'id',
        '#ownerId': 'ownerId',
        '#ownerName': 'ownerName',
        '#allianceId': 'allianceId',
        '#allianceName': 'allianceName',
        '#attackDate': 'attackDate',
        '#attacks': 'attacks',
      },
      ExpressionAttributeValues: marshall({
        ':gsi1pk': `AS#${allianceId}`,
        ':gsi1sk': `USER#${ownerId}#DATE#${attackDateString}`,
        ':id': id,
        ':ownerId': ownerId,
        ':ownerName': ownerName,
        ':allianceId': allianceId,
        ':allianceName': allianceName,
        ':attackDate': attackDateString,
        ':attacks': count,
      }),
    };
    return params;
  }
}
