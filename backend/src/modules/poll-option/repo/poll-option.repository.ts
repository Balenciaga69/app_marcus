import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollOption } from '../../../entities/poll-option.entity';
import { CreatePollOptionDto } from '../dto/create-poll-option.dto';
import { IPollOptionRepository } from './poll-option-repository.interface';

@Injectable()
export class PollOptionRepository implements IPollOptionRepository {
  constructor(
    @InjectRepository(PollOption)
    private readonly repo: Repository<PollOption>
  ) {}

  async createPollOption(dto: CreatePollOptionDto): Promise<PollOption> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<PollOption | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPollId(pollId: string): Promise<PollOption[]> {
    return this.repo.find({ where: { poll: { id: pollId } }, relations: ['poll'] });
  }
}
