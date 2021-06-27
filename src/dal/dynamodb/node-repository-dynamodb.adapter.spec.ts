import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { Node, NodeStatus } from '../../conquest/interfaces/conquest.interface';
import { ConquestRepositoryDynamoDbAdapter } from './conquest-repository-dynamodb.adapter';
import { createConquest } from './conquest-repository-dynamodb.adapter.spec';
import { DynamoDbService } from './dynamodb.service';
import { NodeRepositoryDynamoDbAdapter } from './node-repository-dynamodb.adapter';
import { PhaseRepositoryDynamoDbAdapter } from './phase-repository-dynamodb.adapter';
import { createPhase } from './phase-repository-dynamodb.adapter.spec';
import { ZoneRepositoryDynamoDbAdapter } from './zone-repository-dynamodb.adapter';
import { createZone } from './zone-repository-dynamodb.adapter.spec';

export const createNode = (
  id,
  zoneId,
  number,
  ownerId?,
  status = NodeStatus.OPEN,
): Node => {
  return {
    id,
    zoneId,
    number,
    ownerId,
    status,
  };
};

xdescribe('NodeRepositoryDynamoDbAdapter', () => {
  let service: NodeRepositoryDynamoDbAdapter;
  let conquestService: ConquestRepositoryDynamoDbAdapter;
  let phaseService: PhaseRepositoryDynamoDbAdapter;
  let zoneService: ZoneRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        NodeRepositoryDynamoDbAdapter,
        ZoneRepositoryDynamoDbAdapter,
        ConquestRepositoryDynamoDbAdapter,
        PhaseRepositoryDynamoDbAdapter,
      ],
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();

    service = module.get<NodeRepositoryDynamoDbAdapter>(
      NodeRepositoryDynamoDbAdapter,
    );
    zoneService = module.get<ZoneRepositoryDynamoDbAdapter>(
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

  it('should create one node', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const phaseId = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase = createPhase(phaseId, conquestId, 1);
    await phaseService.create(phase);

    const zoneId = '43b1b548-4a04-4da9-beb5-43b30e1b7959';
    const zone = createZone(zoneId, phaseId, 1);
    await zoneService.create(conquestId, zone);

    const id = 'f2db102f-09c7-44e4-9c87-28277eca6b40';
    const ownerId = 'd468b717-c2b2-4282-9ee2-bbff3e17cd9d';
    const node = createNode(id, zoneId, 1, ownerId);

    await service.create(conquestId, phaseId, node);
    expect(service).toBeDefined();
  });

  it('should query all node on zone on phase on conquest', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const phaseId = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase = createPhase(phaseId, conquestId, 1);
    await phaseService.create(phase);

    const zoneId = '43b1b548-4a04-4da9-beb5-43b30e1b7959';
    const zone = createZone(zoneId, phaseId, 1);
    await zoneService.create(conquestId, zone);

    const id = 'f2db102f-09c7-44e4-9c87-28277eca6b40';
    const ownerId = 'd468b717-c2b2-4282-9ee2-bbff3e17cd9d';
    const node = createNode(id, zoneId, 1, ownerId);
    await service.create(conquestId, phaseId, node);

    const id2 = '06c9e17f-be32-4ebd-8b3d-d3ca2ffecf78';
    const node2 = createNode(id2, zoneId, 2, ownerId);
    await service.create(conquestId, phaseId, node2);

    const nodes = await service.findAllOnZone(conquestId, phaseId, zoneId);

    expect(nodes).toBeDefined();
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    expect(nodes.find((n) => n.id === id)).toBeDefined();
    expect(nodes.find((n) => n.id === id2)).toBeDefined();
  });

  it('should get one node on conquest', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const phaseId = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase = createPhase(phaseId, conquestId, 1);
    await phaseService.create(phase);

    const zoneId = '43b1b548-4a04-4da9-beb5-43b30e1b7959';
    const zone = createZone(zoneId, phaseId, 1);
    await zoneService.create(conquestId, zone);

    const id = 'f2db102f-09c7-44e4-9c87-28277eca6b40';
    const ownerId = 'd468b717-c2b2-4282-9ee2-bbff3e17cd9d';
    const node = createNode(id, zoneId, 1, ownerId);
    await service.create(conquestId, phaseId, node);

    const actualNode = await service.findOneOnZoneById(
      conquestId,
      phaseId,
      zoneId,
      id,
    );

    expect(actualNode).not.toBeNull();
    expect(actualNode.id).toEqual(id);
  });

  it('should update node', async () => {
    const conquestId = 'e03d1e22-fb5a-4da1-b7e7-f8767c778f1f';
    const allianceId = '109ae49f-17ef-4f9c-b2ff-ebb7f766af56';
    const conquest = createConquest(conquestId, allianceId);
    await conquestService.create(conquest);

    const phaseId = 'afaeb986-26e7-4638-8d8e-65e7c1713278';
    const phase = createPhase(phaseId, conquestId, 1);
    await phaseService.create(phase);

    const zoneId = '43b1b548-4a04-4da9-beb5-43b30e1b7959';
    const zone = createZone(zoneId, phaseId, 1);
    await zoneService.create(conquestId, zone);

    const id = 'f2db102f-09c7-44e4-9c87-28277eca6b40';
    const ownerId = 'd468b717-c2b2-4282-9ee2-bbff3e17cd9d';
    const node = createNode(id, zoneId, 1, ownerId);
    await service.create(conquestId, phaseId, node);

    await service.update(
      conquestId,
      phaseId,
      zoneId,
      id,
      undefined,
      NodeStatus.HOLD,
    );

    const actualNode = await service.findOneOnZoneById(
      conquestId,
      phaseId,
      zoneId,
      id,
    );

    expect(actualNode).not.toBeNull();
    expect(actualNode.id).toEqual(id);
    expect(actualNode.status).toEqual(NodeStatus.HOLD);
  });
});
