import { Test, TestingModule } from '@nestjs/testing';
import { Conquest } from '../../conquest/interfaces/conquest.interface';
import { ConquestRepositoryDynamoDbAdapter } from './conquest-repository-dynamodb.adapter';
import { DynamoDbService } from './dynamodb.service';

xdescribe('ConquestRepositoryDynamoDbAdapter', () => {
  let service: ConquestRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamoDbService, ConquestRepositoryDynamoDbAdapter],
      //imports: [CqrsModule],
    }).compile();

    service = module.get<ConquestRepositoryDynamoDbAdapter>(
      ConquestRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query', async () => {
    const results = await service.findAll();
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should get one conquest', async () => {
    const results = await service.findOneById(
      'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f',
    );
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should create one conquest', async () => {
    const conquest: Conquest = {
      allianceId: 'test',
      id: '1',
      endDate: new Date('2021-06-15'),
      startDate: new Date('2021-06-14'),
    };
    const results = await service.create(conquest);
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should delete one conquest', async () => {
    await service.delete('1');
    expect(service).toBeDefined();
  });
});
