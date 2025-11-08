import { DataSource } from 'typeorm';
import { Poll } from '../entities/poll.entity';
import { PollOption } from '../entities/poll-option.entity';

export async function seedDatabase(dataSource: DataSource) {
  const pollRepository = dataSource.getRepository(Poll);
  const pollOptionRepository = dataSource.getRepository(PollOption);

  const existingPolls = await pollRepository.count();
  if (existingPolls > 0) {
    return;
  }

  const poll = pollRepository.create({
    title: '2024 美國總統大選',
    description: '你支持誰成為美國第47任總統？',
  });

  const savedPoll = await pollRepository.save(poll);

  // 建立選項
  const option1 = pollOptionRepository.create({
    text: '川普 (Donald Trump)',
    poll: savedPoll,
  });

  const option2 = pollOptionRepository.create({
    text: '拜登 (Joe Biden)',
    poll: savedPoll,
  });

  await pollOptionRepository.save([option1, option2]);
}
