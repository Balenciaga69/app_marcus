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

  async findById(id: string): Promise<Vote | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPollId(pollId: string): Promise<Vote[]> {
    return this.repo.find({ where: { poll: { id: pollId }, is_active: true }, relations: ['poll'] });
  }

  async findByFingerprint(fingerprint: string): Promise<Vote[]> {
    return this.repo.find({ where: { fingerprint, is_active: true } });
  }

  async updateVote(dto: UpdateVoteDto): Promise<Vote> {
    const { id, is_active } = dto;
    if (typeof is_active !== 'boolean') {
      throw new Error('Only is_active can be updated');
    }
    await this.repo.update(id, { is_active });
    const updated = await this.findById(id);
    if (!updated) throw new Error('Vote not found'); //TODO: 客製化 ERROR
    return updated;
  }

  async deleteVote(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
