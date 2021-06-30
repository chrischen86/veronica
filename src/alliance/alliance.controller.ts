import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAlliance(@Body() dto: CreateAllianceDto, @Request() req) {
    const {
      user: { sub },
    } = req;
    if (sub === undefined) {
      return { message: 'error' };
    }
    dto.ownerId = sub;
    return this.service.createAlliance(dto);
  }
}
