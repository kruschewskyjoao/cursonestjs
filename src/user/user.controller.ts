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
    return this.userService.list();
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id) {
    return this.userService.show(id);
  }

  @Put(':id')
  async update(@Body() body: UpdatePutUserDTO, @Param('id', ParseIntPipe) id) {
    return this.userService.update(id, body);
  }

  @Patch(':id')
  async updatePartial(
    @Body() body: UpdatePatchUserDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return this.userService.updatePartial(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return {
      id,
    };
  }
}
