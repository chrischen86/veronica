import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import {
  Zone,
  ZoneOrders,
  ZoneStatus,
} from '../../conquest/interfaces/conquest.interface';
import { UpdateZoneDto } from '../../conquest/interfaces/update-zone-dto.interface';
import { ConquestRepositoryDynamoDbAdapter } from './conquest-repository-dynamodb.adapter';
import { createConquest } from './conquest-repository-dynamodb.adapter.spec';
import { DynamoDbService } from './dynamodb.service';
import { PhaseRepositoryDynamoDbAdapter } from './phase-repository-dynamodb.adapter';
import { createPhase } from './phase-repository-dynamodb.adapter.spec';
import { ZoneRepositoryDynamoDbAdapter } from './zone-repository-dynamodb.adapter';

export const createZone = (
  id,
  phaseId,
  number,
  orders = ZoneOrders.Attack,
  status = ZoneStatus.Open,
): Zone => {
  return {
    id,
    phaseId,
    number,
    orders,
    status,
    nodes: [],
  };
};

xdescribe('ZoneRepositoryDynamoDbAdapter', () => {
  let service: ZoneRepositoryDynamoDbAdapter;
  let conquestService: ConquestRepositoryDynamoDbAdapter;
  let phaseService: PhaseRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        ZoneRepositoryDynamoDbAdapter,
        ConquestRepositoryDynamoDbAdapter,
        PhaseRepositoryDynamoDbAdapter,
      ],
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();

    service = module.get<ZoneRepositoryDynamoDbAdapter>(
      ZoneRepositoryDynamoDbAdapter,
    );
    conquestService = module.get<ConquestRepositoryDynamoDbAdapter>(
      ConquestRepositoryDynamoDbAdapter,
    );
    phaseService = module.get<PhaseRepositoryDynamoDbAdapter>(
      PhaseRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create one zone', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const phaseId = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase = createPhase(phaseId, conquestId, 1);
    await phaseService.create(phase);

    const id = '43b1b548-4a04-4da9-beb5-43b30e1b7959';
    const zone = createZone(id, phaseId, 1);
    const results = await service.create(conquestId, zone);

    expect(results).toBeDefined();
  });

  it('should query all zones on phase on conquest', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const phaseId = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase = createPhase(phaseId, conquestId, 1);
    await phaseService.create(phase);

    const id = '43b1b548-4a04-4da9-beb5-43b30e1b7959';
    const zone = createZone(id, phaseId, 1);
    await service.create(conquestId, zone);

    const id2 = 'f1127084-1bf3-4884-8807-33d8d8f63879';
    const zone2 = createZone(id2, phaseId, 2);
    await service.create(conquestId, zone2);

    const zones = await service.findAllOnPhase(conquestId, phaseId);
    expect(zones).toBeDefined();
    expect(zones.length).toBeGreaterThanOrEqual(2);
    expect(zones.find((z) => z.id === id)).toBeDefined();
    expect(zones.find((z) => z.id === id2)).toBeDefined();
  });

  it('should get one zone on conquest', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const phaseId = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase = createPhase(phaseId, conquestId, 1);
    await phaseService.create(phase);

    const id = '43b1b548-4a04-4da9-beb5-43b30e1b7959';
    const zone = createZone(id, phaseId, 1);
    await service.create(conquestId, zone);

    const actualZone = await service.findOneOnPhaseById(
      conquestId,
      phaseId,
      id,
    );
    expect(actualZone).not.toBeNull();
    expect(actualZone.id).toEqual(id);
  });

  it('should update zone', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const phaseId = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase = createPhase(phaseId, conquestId, 1);
    await phaseService.create(phase);

    const id = '43b1b548-4a04-4da9-beb5-43b30e1b7959';
    const zone = createZone(id, phaseId, 1);
    await service.create(conquestId, zone);

    const zoneUpdate: UpdateZoneDto = {
      conquestId,
      phaseId,
      zoneId: id,
      orders: ZoneOrders.Attack,
      status: ZoneStatus.Sealing,
    };
    await service.update(zoneUpdate);
    const updatedZone = await service.findOneOnPhaseById(
      conquestId,
      phaseId,
      id,
    );
    expect(updatedZone).not.toBeNull();
    expect(updatedZone.orders).toEqual(ZoneOrders.Attack);
    expect(updatedZone.status).toEqual(ZoneStatus.Sealing);
  });
});
