import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { UserService } from './user.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { updatePutUserDTO } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test('validate definition', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Guards', () => {
    test('apply guards', () => {
      const guards = Reflect.getMetadata('__guards__', UserController);
      expect(guards.length).toEqual(3);
      expect(new guards[0]()).toBeInstanceOf(ThrottlerGuard);
      expect(new guards[1]()).toBeInstanceOf(AuthGuard);
      expect(new guards[2]()).toBeInstanceOf(RoleGuard);
    });
  });

  describe('Create', () => {
    test('create method', async () => {
      const result = await userController.create(createUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('Read', () => {
    test('read list', async () => {
      const result = await userController.read();
      expect(result).toEqual(userEntityList);
    });
    test('read one', async () => {
      const result = await userController.readOne(1);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    test('update method', async () => {
      const result = await userController.update(updatePutUserDTO, 1);
      expect(result).toEqual(userEntityList[0]);
    });
    test('read one', async () => {
      const result = await userController.updatePartial(updatePatchUserDTO, 1);
      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('Delete', () => {
    test('delete method', async () => {
      const result = await userController.delete(1);
      expect(result).toEqual({
        success: true,
      });
    });
  });
});
