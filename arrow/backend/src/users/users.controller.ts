import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(DevAuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(DevAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(DevAuthGuard)
  async update(@Param('id') id: string, @Body() updateData: Partial<any>) {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(DevAuthGuard)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}