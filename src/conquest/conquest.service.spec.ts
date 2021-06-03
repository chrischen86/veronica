import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ConquestService } from './conquest.service';

describe('ConquestService', () => {
  let service: ConquestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConquestService],
      imports: [CqrsModule],
    }).compile();

    service = module.get<ConquestService>(ConquestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
