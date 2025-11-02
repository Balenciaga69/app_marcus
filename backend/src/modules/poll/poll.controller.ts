import { Controller, Body, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';

@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Get()
  async findAll() {
    return await this.pollService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.pollService.findById(Number(id));
  }

  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    return await this.pollService.create(createPollDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePollDto: UpdatePollDto) {
    return await this.pollService.update(Number(id), updatePollDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.pollService.delete(Number(id));
    return { message: 'Poll deleted' };
  }
}
