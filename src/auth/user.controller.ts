import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './interfaces/create-user-dto.interface';
import { UpdateProfileDto } from './interfaces/update-profile-dto.interface';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.service.createUser(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') userId: string) {
    const user = await this.service.findOneUser(userId);
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }

  @Post('/verify')
  async verify(@Request() req) {
    const {
      user: { sub },
    } = req;
    if (sub === undefined) {
      return { message: 'error' };
    }
    const user = await this.service.findOneUser(sub);
    if (user === null) {
      return { id: sub, status: 'NOT_INITIALIZED' };
    }
    return user;
  }

  @Patch()
  async updateProfile(@Body() dto: UpdateProfileDto, @Request() req) {
    const {
      user: { sub },
    } = req;
    if (sub === undefined || dto.name === undefined) {
      return { message: 'error' };
    }

    //Prevent hijacking someone else's id
    dto.id = sub;
    await this.service.updateProfile(dto);
    return this.service.findOneUser(sub);
  }

  //   @Delete(':id')
  //   async deleteOne(@Param('id') id: string) {
  //     return this.service.deleteOneConquest(id);
  //   }
}
