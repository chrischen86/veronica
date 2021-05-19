import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConquestService } from './conquest.service';
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
  async findAll() {
    console.log('tset');
    return this.service.findAllConquest();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOneConquest(id);
  }
  /*
  @Get(':id/phase')
  async findAllPHases(@Param('id') id) {
    console.log('getting');
    return this.service.findAllPhasesOnConquest(id);
  }

  @Post(':id/phase')
  async createPhase(@Body() createConquestDto: CreateConquestDto) {
    const { allianceId, to, from } = createConquestDto;
    return this.service.createPhase(1, to, from, allianceId);
  }
  */
}
