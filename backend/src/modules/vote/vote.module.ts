import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from '../../entities/vote.entity';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { VoteRepository } from './repo/vote.repository';
import { Poll } from '../../entities/poll.entity';
import { PollOption } from '../../entities/poll-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Poll, PollOption])],
  controllers: [VoteController],
  providers: [VoteService, VoteRepository],
  exports: [VoteService],
})
export class VoteModule {}
