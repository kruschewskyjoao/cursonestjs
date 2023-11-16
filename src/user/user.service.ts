import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
