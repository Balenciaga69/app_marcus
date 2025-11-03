import { Entity, OneToMany, Column } from 'typeorm';
import { PollOption } from './poll-option.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Poll extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => PollOption, (option) => option.poll)
  options: PollOption[];
}
