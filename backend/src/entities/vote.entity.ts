import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { PollOption } from './poll-option.entity';
import { Poll } from './poll.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Index(['poll', 'fingerprint'], { unique: false })
export class Vote extends BaseEntity {
  @ManyToOne(() => Poll)
  poll: Poll;

  @ManyToOne(() => PollOption)
  option: PollOption;

  @Column()
  fingerprint: string;

  @Column({ default: true })
  is_active: boolean;
}
