import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PollOption } from './poll-option.entity';
import { Poll } from './poll.entity';

@Entity()
@Index(['poll', 'fingerprint'], { unique: false })
export class Vote extends BaseEntity {
  @ManyToOne(() => Poll)
  poll: Poll;

  @ManyToMany(() => PollOption)
  @JoinTable()
  options: PollOption[];

  @Column()
  fingerprint: string;
}
