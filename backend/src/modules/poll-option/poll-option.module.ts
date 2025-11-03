import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOption } from '../../entities/poll-option.entity';
import { PollOptionController } from './poll-option.controller';
import { PollOptionService } from './poll-option.service';
import { PollOptionRepository } from './repo/poll-option.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PollOption])],
  controllers: [PollOptionController],
  providers: [PollOptionService, PollOptionRepository],
  exports: [PollOptionService],
})
export class PollOptionModule {}
