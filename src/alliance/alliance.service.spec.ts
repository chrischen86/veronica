import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AllianceService } from './alliance.service';

describe('AllianceService', () => {
  let service: AllianceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllianceService],
      imports: [CqrsModule],
    }).compile();

    service = module.get<AllianceService>(AllianceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
