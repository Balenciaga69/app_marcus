import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from '../../entities/vote.entity';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { VoteRepository } from './repo/vote.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Vote])],
  controllers: [VoteController],
  providers: [VoteService, VoteRepository],
  exports: [VoteService],
})
export class VoteModule {}
