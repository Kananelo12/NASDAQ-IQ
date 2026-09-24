import { Test, TestingModule } from '@nestjs/testing';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

// Runs without a real database: env values come from vitest.config.e2e.ts.
describe('App (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>({
      bodyParser: false,
    });
    configureApp(app);
    await app.init();
  });

  it('GET /api/health is public', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'));
  });

  it('GET /api/me requires a session', () => {
    return request(app.getHttpServer()).get('/api/me').expect(401);
  });

  it('mounts Better Auth under /api/auth', () => {
    return request(app.getHttpServer())
      .get('/api/auth/ok')
      .expect(200)
      .expect((res) => expect(res.body.ok).toBe(true));
  });

  it('rejects job endpoints without the secret', () => {
    return request(app.getHttpServer()).get('/api/jobs').expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
