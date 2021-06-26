import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { Conquest } from '../../conquest/interfaces/conquest.interface';
import { ConquestRepositoryDynamoDbAdapter } from './conquest-repository-dynamodb.adapter';
import { DynamoDbService } from './dynamodb.service';

export const createConquest = (
  id,
  allianceId,
  startDate = '2021-06-15',
  endDate = '2021-06-14',
): Conquest => {
  return {
    allianceId,
    id,
    endDate: new Date(startDate),
    startDate: new Date(endDate),
  };
};

xdescribe('ConquestRepositoryDynamoDbAdapter', () => {
  let service: ConquestRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamoDbService, ConquestRepositoryDynamoDbAdapter],
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();

    service = module.get<ConquestRepositoryDynamoDbAdapter>(
      ConquestRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create one conquest', async () => {
    const id = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(id, allianceId);
    const results = await service.create(conquest);
    expect(results).toBeDefined();
  });

  it('should find all conquests', async () => {
    const id = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest1 = createConquest(id, allianceId);
    await service.create(conquest1);
    const id2 = '30d66630-10c6-48cd-95ad-c375c65050cc';
    const allianceId2 = '13f12a16-5e0b-42ee-98f4-3247fb0fdc80';
    const conquest2 = createConquest(id2, allianceId2);
    await service.create(conquest2);

    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.find((c) => c.id === id)).toBeDefined();
    expect(results.find((c) => c.id === id2)).toBeDefined();
  });

  it('should get one conquest', async () => {
    const id = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(id, allianceId);
    await service.create(conquest);
    const result = await service.findOneById(id);
    expect(result).toBeDefined();
    expect(result.id).toEqual(id);
  });

  it('should delete one conquest', async () => {
    const id = 'fc41e4c2-2092-439d-bc22-b670a83a33d0';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(id, allianceId);
    await service.create(conquest);
    await service.delete(id);
    const result = await service.findOneById(id);
    expect(result).toBeNull();
  });
});
