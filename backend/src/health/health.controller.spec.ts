import { Test } from '@nestjs/testing';
import { DB } from '../database/database.module.js';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  const db = { execute: vi.fn() };
  let controller: HealthController;

  beforeEach(async () => {
    db.execute.mockReset();
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DB, useValue: db }],
    }).compile();
    controller = moduleRef.get(HealthController);
  });

  it('reports liveness without touching the database', () => {
    expect(controller.check().status).toBe('ok');
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('reports database errors instead of throwing', async () => {
    db.execute.mockRejectedValue(new Error('connection refused'));
    await expect(controller.checkDb()).resolves.toEqual({
      database: 'error',
      message: 'connection refused',
    });
  });
});
