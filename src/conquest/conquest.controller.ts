import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConquestService } from './conquest.service';
import { CreateConquestDto } from './dtos/create-conquest.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../auth/user.service';
import { CreateConquestOverrideDto } from './dtos/create-conquest-override.dto';

@Controller('conquest')
export class ConquestController {
  constructor(
    private readonly service: ConquestService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createConquest(
    @Body() createConquestDto: CreateConquestDto,
    @Request() req,
  ) {
    const {
      user: { sub },
    } = req;
    if (sub === undefined) {
      return { message: 'error' };
    }

    const user = await this.userService.findOneUser(sub);
    const { allianceId } = user;
    const { startDate } = createConquestDto;
    return this.service.createConquest(allianceId, startDate);
  }

  @Post('/override')
  async createConquestManual(
    @Body() createConquestDto: CreateConquestOverrideDto,
  ) {
    const { allianceId, startDate, endDate } = createConquestDto;
    return this.service.createConquestOverride(allianceId, startDate, endDate);
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
