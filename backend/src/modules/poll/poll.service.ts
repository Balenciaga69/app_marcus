import { Injectable } from '@nestjs/common';
import { Poll } from '../../entities/poll.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollRepository } from './repo/poll.repository';

@Injectable()
export class PollService {
  constructor(private readonly pollRepo: PollRepository) {}

  async findAll(): Promise<Poll[]> {
    return await this.pollRepo.findAll();
  }

  async findById(id: string): Promise<Poll | null> {
    return await this.pollRepo.findById(id);
  }

  async create(createPollDto: CreatePollDto): Promise<Poll> {
    return await this.pollRepo.create(createPollDto);
  }

  async update(id: string, updatePollDto: UpdatePollDto): Promise<Poll> {
    return await this.pollRepo.update(id, updatePollDto);
  }

  async delete(id: string): Promise<void> {
    return await this.pollRepo.delete(id);
  }
}
