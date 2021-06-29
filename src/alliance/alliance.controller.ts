import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AllianceService } from './alliance.service';
import { CreateAllianceDto } from './dtos/create-alliance.dto.';

@Controller('alliance')
@UseInterceptors(ClassSerializerInterceptor)
export class AllianceController {
  constructor(private readonly service: AllianceService) {}

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    return this.service.findAll(query['$limit'], query['$from']);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: Record<string, any>) {
    return this.service.findOneAlliance(id, query['$select'] === 'members');
  }

  @Post()
  async createAlliance(@Body() dto: CreateAllianceDto) {
    return this.service.createAlliance(dto);
  }
}
