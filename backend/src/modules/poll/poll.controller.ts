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
  async findById(@Param('id') id: string) {
    return await this.pollService.findById(id);
  }

  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    return await this.pollService.create(createPollDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return await this.pollService.update(id, updatePollDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.pollService.delete(id);
    return { message: 'Poll deleted' };
  }
}
