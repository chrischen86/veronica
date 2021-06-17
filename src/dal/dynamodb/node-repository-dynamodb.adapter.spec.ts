import { Test, TestingModule } from '@nestjs/testing';
import {
  Node,
  NodeStatus,
  Zone,
  ZoneOrders,
  ZoneStatus,
} from 'src/conquest/interfaces/conquest.interface';
import { UpdateZoneDto } from 'src/conquest/interfaces/update-zone-dto.interface';
import { DynamoDbService } from './dynamodb.service';
import { NodeRepositoryDynamoDbAdapter } from './node-repository-dynamodb.adapter';
import { ZoneRepositoryDynamoDbAdapter } from './zone-repository-dynamodb.adapter';

describe('NodeRepositoryDynamoDbAdapter', () => {
  let service: NodeRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamoDbService, NodeRepositoryDynamoDbAdapter],
      //imports: [CqrsModule],
    }).compile();

    service = module.get<NodeRepositoryDynamoDbAdapter>(
      NodeRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query all node on zone on phase on conquest', async () => {
    const results = await service.findAllOnZone('1', '1', '1');
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should get one node on conquest', async () => {
    const results = await service.findOneOnZoneById('1', '1', '1', '1');
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should create one node', async () => {
    const node: Node = {
      id: '1',
      zoneId: '1',
      number: 1,
      ownerId: 'PulsarShock Test',
      status: NodeStatus.OPEN,
    };
    const results = await service.create('1', '1', node);
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should update node', async () => {
    const results = await service.update(
      '1',
      '1',
      '1',
      '1',
      undefined,
      NodeStatus.HOLD,
    );
    console.log(results);
    expect(service).toBeDefined();
  });
});