import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PollOption } from '../../../entities/poll-option.entity';
import { Poll } from '../../../entities/poll.entity';
import { In, Repository } from 'typeorm';
import { Vote } from '../../../entities/vote.entity';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { UpdateVoteDto } from '../dto/update-vote.dto';
import { IVoteRepository } from './vote-repository.interface';

@Injectable()
export class VoteRepository implements IVoteRepository {
  constructor(
    @InjectRepository(Vote)
    private readonly repo: Repository<Vote>,
    @InjectRepository(Poll)
    private readonly pollRepo: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionRepo: Repository<PollOption>
  ) {}

  async createVote(dto: CreateVoteDto): Promise<Vote> {
    const { pollId, optionIds, fingerprint } = dto;
    const poll = await this.pollRepo.findOne({ where: { id: pollId } });
    const options = await this.pollOptionRepo.find({
      where: { id: In(optionIds) },
    });
    if (!poll) throw new Error('Poll not found');
    if (!options.length) throw new Error('No poll options found');
    console.info('xZx options', options);
    const entity = this.repo.create({ poll, options, fingerprint });
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<Vote | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPollId(pollId: string): Promise<Vote[]> {
    return this.repo.find({ where: { poll: { id: pollId } }, relations: ['poll'] });
  }

  async findByFingerprint(fingerprint: string): Promise<Vote[]> {
    return this.repo.find({ where: { fingerprint } });
  }

  async updateVote(dto: UpdateVoteDto): Promise<Vote> {
    const { id, optionIds } = dto;
    // 先查出原本的投票
    const vote = await this.repo.findOne({ where: { id }, relations: ['options'] });
    if (!vote) throw new Error('Vote not found');

    // 查出新的 options
    let options: PollOption[] = [];
    if (optionIds) {
      options = await this.pollOptionRepo.find({ where: { id: In(optionIds) } });
    }
    // 更新 options 關聯
    vote.options = options;
    await this.repo.save(vote);
    // 回傳最新結果
    const updated = await this.findById(id);
    if (!updated) throw new Error('Vote not found');
    return updated;
  }

  async deleteVote(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
