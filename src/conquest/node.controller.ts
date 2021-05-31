import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConquestService } from './conquest.service';
import { CreateNodeDto } from './interfaces/create-node-dto.interface';
import { CreateZoneDto } from './interfaces/create-zone-dto.interface';

@Controller('conquest/:id/phase/:phaseId/zone/:zoneId')
export class NodeController {
  constructor(private readonly service: ConquestService) {}
  @Get('node')
  async findAll(
    @Param('id') id,
    @Param('phaseId') phaseId,
    @Param('zoneId') zoneId,
  ) {
    return this.service.findAllNodesOnZone(id, phaseId, zoneId);
  }

  @Get('node/:nodeId')
  async findOne(
    @Param('id') id,
    @Param('phaseId') phaseId,
    @Param('zoneId') zoneId,
    @Param('nodeId') nodeId,
  ) {
    console.log(
      `getting node ${nodeId} on zone ${zoneId} on phase ${phaseId} on conquest ${id}`,
    );
    return this.service.findOneNodeOnZone(id, phaseId, zoneId, nodeId);
  }

  @Post('node')
  async create(
    @Param('id') conquestId,
    @Param('phaseId') phaseId,
    @Param('zoneId') zoneId,
    @Body() createNodeDto: CreateNodeDto,
  ) {
    const { node: nodeNumber, ownerId, status } = createNodeDto;
    const result = await this.service.createNode(
      conquestId,
      phaseId,
      zoneId,
      nodeNumber,
      ownerId,
      status,
    );
    console.log(result);
    return result;
  }
}
