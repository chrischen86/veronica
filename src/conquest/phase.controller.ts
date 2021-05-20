import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConquestService } from './conquest.service';
import { CreatePhaseDto } from './interfaces/create-phase-dto.interface';

@Controller('conquest/:id')
export class PhaseController {
  constructor(private readonly service: ConquestService) {}
  @Get('phase')
  async findAll(@Param('id') id) {
    console.log('getting phasees');
    return this.service.findAllPhasesOnConquest(id);
  }

  @Get('phase/:phaseId')
  async findOne(@Param('id') id, @Param('phaseId') phaseId) {
    console.log(`getting phase ${phaseId} on conquest ${id}`);
    return this.service.findOnePhaseOnconquest(id, phaseId);
  }

  @Post('phase')
  async createPhase(@Body() createPhaseDto: CreatePhaseDto) {
    const { phase, to, from, conquestId } = createPhaseDto;
    return this.service.createPhase(phase, to, from, conquestId);
  }
}
