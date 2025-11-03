import { CreateVoteDto } from '../dto/create-vote.dto';
import { UpdateVoteDto } from '../dto/update-vote.dto';
import { Vote } from '../../../entities/vote.entity';

export interface IVoteRepository {
  createVote(dto: CreateVoteDto): Promise<Vote>;
  findById(id: string): Promise<Vote | null>;
  findByPollId(pollId: string): Promise<Vote[]>;
  findByFingerprint(fingerprint: string): Promise<Vote[]>;
  updateVote(dto: UpdateVoteDto): Promise<Vote>;
  deleteVote(id: string): Promise<void>;
}
