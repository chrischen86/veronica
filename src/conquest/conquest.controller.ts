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

  @UseGuards(AuthGuard('jwt'))
  @Get('/active')
  async findActiveConquest(@Request() req) {
    const {
      user: { sub },
    } = req;
    if (sub === undefined) {
      return { message: 'error' };
    }

    const user = await this.userService.findOneUser(sub);
    const { allianceId } = user;

    const today = new Date();
    const offset = this.getOffset(today);
    const start = new Date(today.setDate(today.getDate() + offset));
    start.setUTCHours(17);
    start.setUTCMinutes(0);
    start.setUTCSeconds(0);
    start.setUTCMilliseconds(0);
    const end = new Date(start);
    end.setUTCHours(end.getUTCHours() + 16);
    return this.service.findActiveConquest(
      allianceId,
      start.toISOString(),
      end.toISOString(),
    );
  }

  getOffset(date: Date) {
    const dayOfWeek = date.getUTCDay();
    switch (dayOfWeek) {
      case 0: //Sunday
        return -2;
      case 1: //Monday
        return -3;
      case 2: //Tuesday
        return -4;
      case 3: //Wednesday
        return -5;
      case 4: //Thursday
        return 1;
      case 5: //Friday
        return 0;
      case 6: //Saturday
        return -1;
      default:
        return 0;
    }
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
