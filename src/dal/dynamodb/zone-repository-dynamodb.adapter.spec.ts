import { Test, TestingModule } from '@nestjs/testing';
import {
  Zone,
  ZoneOrders,
  ZoneStatus,
} from '../../conquest/interfaces/conquest.interface';
import { UpdateZoneDto } from '../../conquest/interfaces/update-zone-dto.interface';
import { DynamoDbService } from './dynamodb.service';
import { ZoneRepositoryDynamoDbAdapter } from './zone-repository-dynamodb.adapter';

xdescribe('ZoneRepositoryDynamoDbAdapter', () => {
  let service: ZoneRepositoryDynamoDbAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamoDbService, ZoneRepositoryDynamoDbAdapter],
      //imports: [CqrsModule],
    }).compile();

    service = module.get<ZoneRepositoryDynamoDbAdapter>(
      ZoneRepositoryDynamoDbAdapter,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query all zones on phase on conquest', async () => {
    const results = await service.findAllOnPhase('1', '1');
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should get one zone on conquest', async () => {
    const results = await service.findOneOnPhaseById('1', '1', '1');
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should create one zone', async () => {
    const zone: Zone = {
      id: '1',
      phaseId: '1',
      number: 1,
      orders: ZoneOrders.Fill,
      status: ZoneStatus.Open,
      nodes: [],
    };
    const results = await service.create('1', zone);
    console.log(results);
    expect(service).toBeDefined();
  });

  it('should create update zone', async () => {
    const zone: UpdateZoneDto = {
      conquestId: '1',
      phaseId: '1',
      zoneId: '1',
      orders: ZoneOrders.Fill,
      status: ZoneStatus.Sealing,
    };
    const results = await service.update(zone);
    console.log(results);
    expect(service).toBeDefined();
  });
});
