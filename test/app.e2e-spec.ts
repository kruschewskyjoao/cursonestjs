import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { authRegisterDTO } from '../src/testing/auth-register-dto.mock';
import { authLoginDTO } from '../src/testing/auth-login-dto.mock';
import { Role } from '../src/enums/role.enum';
import dataSource from '../typeorm/data-source';
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it('register new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDTO); //authRegisterDTO = {email: 'joao@email.com', senha: '123456', name: 'joao'}

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
  });
  it('login with new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authLoginDTO); //authRegisterDTO = {email: 'joao@email', senha: '123456' }

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
    accessToken = response.body.accessToken;
  });
  it('me route. my info', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.id).toEqual('number');
    expect(response.body.role).toEqual(Role.User);
  });
  it('register new user as admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...authRegisterDTO, role: Role.Admin, email: 'test@email.com' });

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
    accessToken = response.body.accessToken;
  });
  it('me route. my info as user yet', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.id).toEqual('number');
    expect(response.body.role).toEqual(Role.User);
    userId = response.body.id;
  });
  it('list all (only works as admin!) as user', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(403);
    expect(response.body.error).toEqual('Forbidden');
  });

  it('create administrator account manually', async () => {
    const ds = await dataSource.initialize();
    const queryRunner = ds.createQueryRunner();
    await queryRunner.query(
      `UPDATE users SET role = ${Role.Admin} WHERE id = ${userId}`,
    );
    const rows = await queryRunner.query(
      `SELECT * FROM users WHERE id = ${userId}`,
    );

    dataSource.destroy();

    expect(rows.length).toEqual(1);
    expect(rows[0].role).toEqual(Role.Admin);
  });
  it('list all (with access) as user', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(2);
  });
});
