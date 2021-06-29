import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AllianceController } from './alliance.controller';
import { AllianceService } from './alliance.service';

describe('AllianceController', () => {
  let controller: AllianceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllianceController],
      providers: [AllianceService],
      imports: [CqrsModule],
    }).compile();

    controller = module.get<AllianceController>(AllianceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
