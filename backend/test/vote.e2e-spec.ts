/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Pokemon Vote Integration Test', () => {
  let app: INestApplication;
  let pollId: string;
  const optionIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    // 建立 poll
    const pollRes = await request(app.getHttpServer())
      .post('/polls')
      .send({ title: 'Who is your favorite Pokemon?', description: 'Choose your favorite!' });
    pollId = pollRes.body.id;

    // 批量建立選項
    const optionRes = await request(app.getHttpServer())
      .post('/poll-options')
      .send({ pollId, texts: ['Venusaur', 'Charizard', 'Blastoise'] });
    for (const opt of optionRes.body) {
      optionIds.push(opt.id);
    }
  });

  it('第一位：選 Charizard，後來改成 Blastoise', async () => {
    // 投票 Charizard
    console.info('xZx optionIds', optionIds);
    const voteRes = await request(app.getHttpServer())
      .post('/votes')
      .send({ pollId, optionIds: [optionIds[1]], fingerprint: 'user1' });
    expect(voteRes.status).toBe(201);
    const voteId = voteRes.body.id;

    // Update 改成 Blastoise
    const updateRes = await request(app.getHttpServer())
      .patch(`/votes/${voteId}`)
      .send({ optionIds: [optionIds[2]] });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.optionIds).toContain(optionIds[2]);
  });

  //   it('第二位：全選', async () => {
  //     const voteRes = await request(app.getHttpServer()).post('/votes').send({ pollId, optionIds, fingerprint: 'user2' });
  //     expect(voteRes.status).toBe(201);
  //     expect(voteRes.body.optionIds).toEqual(optionIds);
  //   });

  //   it('第三位：不選任何選項', async () => {
  //     const voteRes = await request(app.getHttpServer())
  //       .post('/votes')
  //       .send({ pollId, optionIds: [], fingerprint: 'user3' });
  //     expect(voteRes.status).toBe(201);
  //     expect(voteRes.body.optionIds).toEqual([]);
  //   });

  afterAll(async () => {
    await app.close();
  });
});
