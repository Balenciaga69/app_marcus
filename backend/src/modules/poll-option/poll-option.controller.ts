import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PollOptionService } from './poll-option.service';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';

@Controller('poll-options')
export class PollOptionController {
  constructor(private readonly pollOptionService: PollOptionService) {}

  @Post()
  create(@Body() dto: CreatePollOptionDto) {
    return this.pollOptionService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollOptionService.findOne(id);
  }

  @Get()
  findByPoll(@Query('pollId') pollId: string) {
    return this.pollOptionService.findByPoll(pollId);
  }
}
