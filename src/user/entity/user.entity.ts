import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../enums/role.enum';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id?: number;

  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    length: 200,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    length: 200,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthAt?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({
    default: Role.User,
  })
  role: number;
}
