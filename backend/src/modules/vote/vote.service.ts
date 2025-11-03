import { Injectable } from '@nestjs/common';
import { VoteRepository } from './repo/vote.repository';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@Injectable()
export class VoteService {
  constructor(private readonly voteRepo: VoteRepository) {}

  async create(dto: CreateVoteDto) {
    return this.voteRepo.createVote(dto);
  }

  async findOne(id: string) {
    return this.voteRepo.findById(id);
  }

  async findByPoll(pollId: string) {
    return this.voteRepo.findByPollId(pollId);
  }

  async findByFingerprint(fingerprint: string) {
    return this.voteRepo.findByFingerprint(fingerprint);
  }

  async update(dto: UpdateVoteDto) {
    return this.voteRepo.updateVote(dto);
  }

  async delete(id: string) {
    return this.voteRepo.deleteVote(id);
  }
}
