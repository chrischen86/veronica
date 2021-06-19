import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDbService {
  public readonly client: DynamoDBClient;
  private readonly maxIterations = 10;

  constructor(private readonly configService: ConfigService) {
    const databaseConfig = this.configService.get('database');
    this.client = new DynamoDBClient({ ...databaseConfig });
  }

  async query(params: QueryCommandInput) {
    let sentinel = 0;
    let lastEvaluatedKey = null;
    const items = [];

    const queryParams: QueryCommandInput = JSON.parse(JSON.stringify(params));
    do {
      const data = await this.client.send(new QueryCommand(queryParams));
      items.push(...data.Items);
      lastEvaluatedKey = data.LastEvaluatedKey;
      queryParams.ExclusiveStartKey = lastEvaluatedKey;
      sentinel++;
    } while (sentinel < this.maxIterations && lastEvaluatedKey);
    return items;
  }
}
