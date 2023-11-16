import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() { name, email, password }: CreateUserDTO) {
    return this.userService.create({ email, name, password });
  }

  @Get()
  async read() {
    return { users: [] };
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id) {
    return { user: {}, id };
  }

  @Put(':id')
  async update(
    @Body() { email, password, name }: UpdatePutUserDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return {
      method: 'put',
      email,
      name,
      password,
      id,
    };
  }

  @Patch(':id')
  async updatePartial(
    @Body() { email, name, password }: UpdatePatchUserDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return {
      method: 'patch',
      name,
      email,
      password,
      id,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return {
      id,
    };
  }
}
