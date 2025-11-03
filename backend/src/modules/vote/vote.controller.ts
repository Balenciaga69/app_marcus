import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  create(@Body() dto: CreateVoteDto) {
    return this.voteService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voteService.findOne(id);
  }

  @Get()
  findByPoll(@Query('pollId') pollId: string) {
    return this.voteService.findByPoll(pollId);
  }

  @Get('user')
  findByFingerprint(@Query('fingerprint') fingerprint: string) {
    return this.voteService.findByFingerprint(fingerprint);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVoteDto) {
    return this.voteService.update({ ...dto, id });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.voteService.delete(id);
  }
}
