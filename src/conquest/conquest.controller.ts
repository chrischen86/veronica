import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConquestService } from './conquest.service';
import { Conquest } from './interfaces/conquest.interface';
import { CreateConquestDto } from './interfaces/create-conquest-dto.interface';

@Controller('conquest')
export class ConquestController {
  constructor(private readonly service: ConquestService) {}

  @Post()
  async createConquest(@Body() createConquestDto: CreateConquestDto) {
    const { allianceId, to, from } = createConquestDto;
    return this.service.createConquest(allianceId, to, from);
  }

  @Get()
  async findAll(): Promise<Conquest> {
    return this.service.getConquest();
  }
}
