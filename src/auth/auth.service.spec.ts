import { Test, TestingModule } from '@nestjs/testing';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { AuthService } from './auth.service';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { describe } from 'node:test';
import { userEntityList } from '../testing/user-entity-list.mock';
import { accessToken } from '../testing/token.mock';
import { jwtPayload } from '../testing/jwt-payload.mock';
import * as bcrypt from 'bcrypt';
import { resetToken } from '../testing/reset-token.mock';
import { authRegisterDTO } from '../testing/auth-register-dto.mock';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let bcryptCompare: jest.Mock;
  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  test('validate definition', () => {
    expect(authService).toBeDefined();
  });

  describe('Token', () => {
    test('createToken method', () => {
      const result = authService.createToken(userEntityList[0]);
      expect(result).toEqual({ accessToken });
    });

    test('checkToken method', () => {
      const result = authService.checkToken(accessToken);
      expect(result).toEqual(jwtPayload);
    });
    test('isValidToken method', () => {
      const result = authService.isValidToken(accessToken);
      expect(result).toEqual(true);
    });
  });
  describe('Authentication', () => {
    test('login method', async () => {
      const result = await authService.login('joao@email.com', '123456');
      expect(result).toEqual({ accessToken });
    });
    test('forget method', async () => {
      const result = await authService.forget('joao@email.com');
      expect(result).toEqual({
        success: true,
      });
    });
    test('reset method', async () => {
      const result = await authService.reset('654321', resetToken);
      expect(result).toEqual({ accessToken });
    });
    test('register method', async () => {
      const result = await authService.register(authRegisterDTO);
      expect(result).toEqual({ accessToken });
    });
  });
});
