import { Controller, Get, Post } from '@nestjs/common';
import { ConquestService } from './conquest.service';
import { Conquest } from './interfaces/conquest.interface';

@Controller('conquest')
export class ConquestController {
  constructor(private readonly service: ConquestService) {}

  @Post()
  async createConquest() {
    return this.service.createConquest();
  }

  @Get()
  async findAll(): Promise<Conquest> {
    return this.service.getConquest();
  }
}
