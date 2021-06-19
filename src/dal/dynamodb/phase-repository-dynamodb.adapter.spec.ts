import { Test, TestingModule } from '@nestjs/testing';
import { Phase } from '../../conquest/interfaces/conquest.interface';
import { DynamoDbService } from './dynamodb.service';
import { PhaseRepositoryDynamoDbAdapter } from './phase-repository-dynamodb.adapter';

xdescribe('PhaseRepositoryDynamoDbAdapter', () => {
  let service: PhaseRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamoDbService, PhaseRepositoryDynamoDbAdapter],
      //imports: [CqrsModule],
    }).compile();

    service = module.get<PhaseRepositoryDynamoDbAdapter>(
      PhaseRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query', async () => {
    const results = await service.findAllOnConquest(
      'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f',
    );
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should get one phase', async () => {
    const results = await service.findOneOnConquestById(
      'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f',
      'afaeb986-26e7-4638-8d8e-65e7c1713278',
    );
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should create one phase', async () => {
    const phase: Phase = {
      id: '1',
      conquestId: 'test',
      number: 1,
      endDate: new Date('2021-06-15'),
      startDate: new Date('2021-06-14'),
      zones: [],
    };
    const results = await service.create(phase);
    console.log(results);
    expect(service).toBeDefined();
  });
});
