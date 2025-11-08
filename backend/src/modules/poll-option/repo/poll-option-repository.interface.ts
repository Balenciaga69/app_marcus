import { CreatePollOptionDto } from '../dto/create-poll-option.dto';
import { PollOption } from '../../../entities/poll-option.entity';

export interface IPollOptionRepository {
  createPollOptions(dto: CreatePollOptionDto): Promise<PollOption[]>;
  findById(id: string): Promise<PollOption | null>;
  findByPollId(pollId: string): Promise<PollOption[]>;
}
