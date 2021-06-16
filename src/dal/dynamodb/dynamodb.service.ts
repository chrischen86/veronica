import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDbService {
  public readonly client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: 'us-east-1',
      endpoint: 'http://localhost:8000',
    });
  }
}
