import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-update-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(LogInterceptor)
  @Post()
  async create(@Body() { name, email, password, birthAt }: CreateUserDTO) {
    return this.userService.create({ email, name, password, birthAt });
  }

  @Get()
  async read() {
    return this.userService.list();
  }

  @Get(':id')
  async readOne(@ParamId() id: number) {
    return this.userService.show(id);
  }

  @Put(':id')
  async update(@Body() body: UpdatePutUserDTO, @ParamId() id: number) {
    return this.userService.update(id, body);
  }

  @Patch(':id')
  async updatePartial(@Body() body: UpdatePatchUserDTO, @ParamId() id: number) {
    return this.userService.updatePartial(id, body);
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    await this.exists(id);
    return this.userService.delete(id);
  }

  async exists(id: number) {
    if (!(await this.readOne(id))) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}
