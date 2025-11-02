import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { PollOption } from './poll-option.entity';
import { Poll } from './poll.entity';

@Entity()
@Index(['poll_id', 'fingerprint'], { unique: false })
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Poll)
  poll: Poll;

  @ManyToOne(() => PollOption)
  option: PollOption;

  @Column()
  poll_id: number;

  @Column()
  option_id: number;

  @Column()
  fingerprint: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
