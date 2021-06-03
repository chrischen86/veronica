import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ConquestController } from './conquest.controller';
import { ConquestService } from './conquest.service';

describe('ConquestController', () => {
  let controller: ConquestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConquestController],
      providers: [ConquestService],
      imports: [CqrsModule],
    }).compile();

    controller = module.get<ConquestController>(ConquestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
