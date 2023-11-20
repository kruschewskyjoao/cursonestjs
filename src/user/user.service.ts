import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password, birthAt }: CreateUserDTO) {
    const hashPass = await bcrypt.hash(password, await bcrypt.genSalt());
    console.log(hashPass);
    return await this.prisma.users.create({
      data: {
        email,
        name,
        password: hashPass,
        birthAt: birthAt ? new Date(birthAt) : null,
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
    await this.exists(id);
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    const hashPass = await bcrypt.hash(password, await bcrypt.genSalt());
    return this.prisma.users.update({
      data: {
        email,
        name,
        password: hashPass,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
      where: { id },
    });
  }

  async updatePartial(
    id: number,
    { email, name, password, birthAt, role }: UpdatePatchUserDTO,
  ) {
    const data: any = {};
    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }
    if (email) {
      data.email = email;
    }
    if (name) {
      data.name = name;
    }
    if (password) {
      const hashPass = await bcrypt.hash(password, await bcrypt.genSalt());
      data.password = hashPass;
    }
    if (role) {
      data.role = role;
    }
    return this.prisma.users.update({
      data,
      where: { id },
    });
  }

  async delete(id: number) {
    await this.exists(id);
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.users.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}
