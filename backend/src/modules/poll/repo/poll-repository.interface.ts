// Poll Repository 抽象介面
import { Poll } from '../../../entities/poll.entity';

export interface PollRepositoryInterface {
  findAll(): Promise<Poll[]>;
  findById(id: number): Promise<Poll | null>;
  create(poll: Partial<Poll>): Promise<Poll>;
  update(id: number, poll: Partial<Poll>): Promise<Poll>;
  delete(id: number): Promise<void>;
}
