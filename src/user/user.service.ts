import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create({ name, email, password, birthAt, role }: CreateUserDTO) {
    if (
      await this.usersRepository.exist({
        where: { email },
      })
    ) {
      throw new BadRequestException('Email já existe');
    }
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      password,
      email,
      role,
      birthAt,
      name,
    });

    return this.usersRepository.save(user);
  }

  async list() {
    return this.usersRepository.find();
  }

  async show(id: number) {
    await this.exists(id);
    return this.usersRepository.findOneBy({ id });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    const hashPass = await bcrypt.hash(password, await bcrypt.genSalt());
    await this.usersRepository.update(id, {
      email,
      name,
      password: hashPass,
      birthAt: birthAt ? new Date(birthAt) : null,
      role,
    });
    return this.show(id);
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
    await this.usersRepository.update(id, data);
    return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);
    this.usersRepository.delete(id);
    return true;
  }

  async exists(id: number) {
    if (
      !(await this.usersRepository.exist({
        where: { id },
      }))
    ) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}
