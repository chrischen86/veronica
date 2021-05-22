import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConquestService } from './conquest.service';
import { CreateZoneDto } from './interfaces/create-zone-dto.interface';

@Controller('conquest/:id/phase/:phaseId')
export class ZoneController {
  constructor(private readonly service: ConquestService) {}
  @Get('zone')
  async findAll(@Param('id') id, @Param('phaseId') phaseId) {
    console.log('getting zones');
    return this.service.findAllZonesOnPhase(id, phaseId);
  }

  @Get('zone/:zoneId')
  async findOne(
    @Param('id') id,
    @Param('phaseId') phaseId,
    @Param('zoneId') zoneId,
  ) {
    console.log(`getting zone ${zoneId} on phase ${phaseId} on conquest ${id}`);
    return this.service.findOneZonesOnPhase(id, phaseId, zoneId);
  }

  @Post('zone')
  async create(
    @Param('id') conquestId,
    @Param('phaseId') phaseId,
    @Body() createZoneDto: CreateZoneDto,
  ) {
    const { zone } = createZoneDto;
    return this.service.createZone(conquestId, phaseId, zone);
  }
}
