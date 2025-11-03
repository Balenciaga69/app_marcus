import { Injectable, Inject } from '@nestjs/common';
import type { PollRepositoryInterface } from './repo/poll-repository.interface';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from '../../entities/poll.entity';

@Injectable()
export class PollService {
  constructor(
    @Inject('PollRepositoryInterface')
    private readonly pollRepository: PollRepositoryInterface
  ) {}

  async findAll(): Promise<Poll[]> {
    return await this.pollRepository.findAll();
  }

  async findById(id: string): Promise<Poll | null> {
    return await this.pollRepository.findById(id);
  }

  async create(createPollDto: CreatePollDto): Promise<Poll> {
    return await this.pollRepository.create(createPollDto);
  }

  async update(id: string, updatePollDto: UpdatePollDto): Promise<Poll> {
    return await this.pollRepository.update(id, updatePollDto);
  }

  async delete(id: string): Promise<void> {
    return await this.pollRepository.delete(id);
  }
}
