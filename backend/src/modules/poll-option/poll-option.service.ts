import { Injectable } from '@nestjs/common';
import { PollOptionRepository } from './repo/poll-option.repository';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';

@Injectable()
export class PollOptionService {
  constructor(private readonly pollOptionRepo: PollOptionRepository) {}

  async create(dto: CreatePollOptionDto) {
    return this.pollOptionRepo.createPollOptions(dto);
  }

  async findOne(id: string) {
    return this.pollOptionRepo.findById(id);
  }

  async findByPoll(pollId: string) {
    return this.pollOptionRepo.findByPollId(pollId);
  }
}
