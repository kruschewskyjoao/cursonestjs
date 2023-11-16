import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password }: CreateUserDTO) {
    return await this.prisma.users.create({
      data: {
        email,
        name,
        password,
      },
      //select vai retornar apois criação. Nesse caso vai retornar o id e name.
      //select: {
      // id: true,
      // name: true,
      //},
    });
  }

  async list() {
    return this.prisma.users.findMany();
  }

  async show(id: number) {
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdatePutUserDTO) {
    return this.prisma.users.update({
      data,
      where: { id },
    });
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    return this.prisma.users.update({
      data,
      where: { id },
    });
  }
}
