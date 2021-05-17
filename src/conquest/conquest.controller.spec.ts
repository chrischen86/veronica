import { Test, TestingModule } from '@nestjs/testing';
import { ConquestController } from './conquest.controller';

describe('ConquestController', () => {
  let controller: ConquestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConquestController],
    }).compile();

    controller = module.get<ConquestController>(ConquestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
