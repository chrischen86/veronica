import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './interfaces/create-user-dto.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.service.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') userId: string) {
    return this.service.findOneUser(userId);
  }

  //   @Delete(':id')
  //   async deleteOne(@Param('id') id: string) {
  //     return this.service.deleteOneConquest(id);
  //   }
}
