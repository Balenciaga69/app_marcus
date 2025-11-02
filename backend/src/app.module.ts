import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { PollOption } from './entities/poll-option.entity';
import { Vote } from './entities/vote.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // 載入 .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'user'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_DATABASE', 'db'),
        entities: [Poll, PollOption, Vote], // 註冊 Entity
        synchronize: true, // 開發階段自動同步 schema（生產環境設 false）
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
