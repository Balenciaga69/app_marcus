import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Poll } from './poll.entity';

@Entity()
export class PollOption extends BaseEntity {
  @Column()
  text: string;

  @ManyToOne(() => Poll, (poll) => poll.options)
  poll: Poll;
}
