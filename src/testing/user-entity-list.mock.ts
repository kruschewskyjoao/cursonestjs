import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    name: 'joao',
    email: 'joao@email.com',
    birthAt: new Date('2000-01-01'),
    id: 1,
    password: '123456',
    role: Role.Admin,
  },
  {
    name: 'vi',
    email: 'vi@email.com',
    birthAt: new Date('2002-02-02'),
    id: 2,
    password: '1234567',
    role: Role.Admin,
  },
  {
    name: 'ana',
    email: 'ana@email.com',
    birthAt: new Date('2010-10-10'),
    id: 3,
    password: '654321',
    role: Role.Admin,
  },
];
