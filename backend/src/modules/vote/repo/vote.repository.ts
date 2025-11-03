import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../../../entities/vote.entity';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { UpdateVoteDto } from '../dto/update-vote.dto';
import { IVoteRepository } from './vote-repository.interface';

@Injectable()
export class VoteRepository implements IVoteRepository {
  constructor(
    @InjectRepository(Vote)
    private readonly repo: Repository<Vote>
  ) {}

  async createVote(dto: CreateVoteDto): Promise<Vote> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findById(id: number): Promise<Vote | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPollId(pollId: number): Promise<Vote[]> {
    return this.repo.find({ where: { poll: { id: pollId } }, relations: ['poll'] });
  }

  async findByFingerprint(fingerprint: string): Promise<Vote[]> {
    return this.repo.find({ where: { fingerprint } });
  }

  async updateVote(dto: UpdateVoteDto): Promise<Vote> {
    const { id, ...updateData } = dto;
    await this.repo.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Vote not found');
    return updated;
  }

  async deleteVote(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
