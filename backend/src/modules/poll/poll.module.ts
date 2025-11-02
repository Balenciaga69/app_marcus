import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { PollRepository } from './repo/poll.repository';
import { Poll } from '../../entities/poll.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll])],
  controllers: [PollController],
  providers: [
    PollService,
    {
      provide: 'PollRepositoryInterface',
      useClass: PollRepository,
    },
  ],
  exports: [PollService],
})
export class PollModule {}
