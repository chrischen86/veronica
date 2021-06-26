import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { Phase } from '../../conquest/interfaces/conquest.interface';
import { ConquestRepositoryDynamoDbAdapter } from './conquest-repository-dynamodb.adapter';
import { createConquest } from './conquest-repository-dynamodb.adapter.spec';
import { DynamoDbService } from './dynamodb.service';
import { PhaseRepositoryDynamoDbAdapter } from './phase-repository-dynamodb.adapter';

export const createPhase = (
  id,
  conquestId,
  number,
  startDate = '2021-06-15',
  endDate = '2021-06-14',
): Phase => {
  return {
    id,
    conquestId,
    number,
    endDate: new Date(startDate),
    startDate: new Date(endDate),
    zones: [],
  };
};

xdescribe('PhaseRepositoryDynamoDbAdapter', () => {
  let conquestService: ConquestRepositoryDynamoDbAdapter;
  let service: PhaseRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        PhaseRepositoryDynamoDbAdapter,
        ConquestRepositoryDynamoDbAdapter,
      ],
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();

    service = module.get<PhaseRepositoryDynamoDbAdapter>(
      PhaseRepositoryDynamoDbAdapter,
    );

    conquestService = module.get<ConquestRepositoryDynamoDbAdapter>(
      ConquestRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create one phase on conquest', async () => {
    const id = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const number = 1;
    const phase = createPhase(id, conquestId, number);
    const results = await service.create(phase);
    expect(results).toBeDefined();
  });

  it('should find all phases on conquest', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const id = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase1 = createPhase(id, conquestId, 1);
    await service.create(phase1);
    const id2 = 'ec9adf80-aba3-4f4d-8218-81d0e763a96f';
    const phase2 = createPhase(id2, conquestId, 2);
    await service.create(phase2);

    const phases = await service.findAllOnConquest(conquestId);
    expect(phases).toBeDefined();
    expect(phases.length).toBeGreaterThanOrEqual(2);
    expect(phases.find((p) => p.id === id)).toBeDefined();
    expect(phases.find((p) => p.id === id2)).toBeDefined();
  });

  it('should get one phase', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const id = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase1 = createPhase(id, conquestId, 1);
    await service.create(phase1);

    const phase = await service.findOneOnConquestById(conquestId, id);
    expect(phase).not.toBeNull();
    expect(phase.id).toEqual(id);
  });
});
