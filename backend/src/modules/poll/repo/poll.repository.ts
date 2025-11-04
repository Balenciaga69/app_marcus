// Poll Repository
// 實作 Poll 的資料存取邏輯
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../../../entities/poll.entity';
import { PollRepositoryInterface } from './poll-repository.interface';

@Injectable()
export class PollRepository implements PollRepositoryInterface {
  constructor(
    @InjectRepository(Poll)
    private readonly repo: Repository<Poll>
  ) {}

  async findAll(): Promise<Poll[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Poll | null> {
    return this.repo.findOneBy({ id }) ?? null;
  }

  async create(poll: Partial<Poll>): Promise<Poll> {
    const entity = this.repo.create(poll);
    return this.repo.save(entity);
  }

  async update(id: string, poll: Partial<Poll>): Promise<Poll> {
    await this.repo.update(id, poll);
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
