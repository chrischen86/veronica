import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConquestService } from './conquest.service';
import { CreateConquestDto } from './interfaces/create-conquest.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('conquest')
export class ConquestController {
  constructor(private readonly service: ConquestService) {}

  @Post()
  async createConquest(@Body() createConquestDto: CreateConquestDto) {
    const { allianceId, startDate, endDate } = createConquestDto;
    return this.service.createConquest(allianceId, startDate, endDate);
  }

  @Get()
  async findAll() {
    return this.service.findAllConquest();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOneConquest(id);
  }
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.service.deleteOneConquest(id);
  }
}
